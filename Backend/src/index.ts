import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import path from "path";
import { createHash } from "crypto";
import { body, validationResult, CustomValidator } from "express-validator";
import Poker from "./poker/poker";
import Player from "./poker/player";
import cookieParser from "cookie-parser";
import { Token } from "./entity/Token";
import Room from "./poker/room";
import { Friendship } from "./entity/Friendship";
export interface PlayerAuthInfoRequest extends Request {
  playerUsername: string;
}
interface JwtPayload {
  username: string;
}

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, "../../Frontend/public/")));
    app.use(express.static(path.join("public/")));
    app.use(cookieParser());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    let userRepository = connection.getRepository(User);
    let tokenRepository = connection.getRepository(Token);
    let friendshipRepository = connection.getRepository(Friendship);
    let players: Player[] = [];
    let rooms: Room[] = [];

    // setup express app here
    // ...
    const authorization = (req: PlayerAuthInfoRequest, res, next) => {
      const token = req.cookies.access_token;
      if (typeof token == "undefined") {
        return res.status(403).json({ message: "Forbidden" });
      }
      try {
        const data = jwt.verify(token, "casino") as JwtPayload;
        req.playerUsername = data.username;
      } catch {
        res.sendStatus(403);
      }
      return next();
    };

    const isValidEmail: CustomValidator = (value) => {
      return userRepository.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    };

    const isValidUsername: CustomValidator = (value) => {
      return userRepository.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    };

    // app.get("*", (req: PlayerAuthInfoRequest, res) => {
    //   res.sendFile("index.html", {
    //     root: path.join(path.join(__dirname, "../../Frontend/public/")),
    //   });
    // });

    app.get("/", (req: PlayerAuthInfoRequest, res) => {
      res.sendFile("index.html", {
        root: path.join(path.join(__dirname, "../../Frontend/public/")),
      });
    });

    app.post("/friendship", async (req, res) => {
      let user = await userRepository.findOne({ username: req.body.me });
      let other = await userRepository.findOne({ username: req.body.other });
      let friendship = new Friendship();
      friendship.asker = user;
      friendship.answerer = other;
      friendship.friended = false;
      friendshipRepository.save(friendship);
      res.send("friended with" + other.username);
    });

    app.get("/data", authorization, async (req: PlayerAuthInfoRequest, res) => {
      let player = await userRepository.findOne({
        username: req.playerUsername,
      });
      if (player) {
        res.json({ username: player.username, money: player.money });
      }
    });

    app.get(
      "/logout",
      authorization,
      async (req: PlayerAuthInfoRequest, res) => {
        let player = await userRepository.findOne({
          username: req.playerUsername,
        });
        tokenRepository.delete({ token: req.cookies.access_token });
        await userRepository.save(player);
        return res
          .clearCookie("access_token")
          .status(200)
          .json({ message: "Successfully logged out" });
      }
    );

    app.get("/protected", authorization, (req: PlayerAuthInfoRequest, res) => {
      return res.json({ player: { username: req.playerUsername } });
    });
    app.post(
      "/api/delete",
      authorization,
      async (req: PlayerAuthInfoRequest, res) => {
        await userRepository.delete({ username: req.playerUsername });
        // review to choose what to do
        res.sendFile("index.html", {
          root: path.join(path.join(__dirname, "../../Frontend/public/")),
        });
      }
    );
    app.post(
      "/changePassword",
      authorization,
      body("newPassword")
        .isLength({ min: 8 })
        .withMessage("Password length must be at least 8 characters")
        .not()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage(
          "Password must contain a at least an uppercase letter , a lowercase letter, a number and a special character"
        ),
      body("newPasswordConfirm").custom((value, { req }) => {
        if (value != req.body.newPassword) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),

      async (req: PlayerAuthInfoRequest, res) => {
        let user = await userRepository.findOne({
          username: req.playerUsername,
          password: createHash("sha256")
            .update(req.body.oldPassword)
            .digest("hex"),
        });
        if (user && req.body.newPassword) {
          req.body.newPassword = createHash("sha256")
            .update(req.body.newPassword)
            .digest("hex");
          user.password = req.body.newPassword;
          user.tokens = [];
          userRepository.save(user);
        }
      }
    );
    app.post(
      "/api/login",
      body("email").isEmail().normalizeEmail(),
      body("password")
        .isLength({ min: 8 })
        .withMessage("must be at least 8 characters long")
        .matches(/\d/)
        .withMessage("must contain a number"),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        } else {
          if (typeof req.body != "undefined") {
            let player = await userRepository.findOne({
              email: req.body.email,
            });
            if (player) {
              req.body.password = createHash("sha256")
                .update(req.body.password)
                .digest("hex");
              player = await userRepository.findOne({
                email: req.body.email,
                password: req.body.password,
              });
              if (player) {
                const token = jwt.sign(
                  { username: player.username },
                  "casino",
                  { expiresIn: "24h" }
                );
                let tokenToSave = new Token();
                tokenToSave.token = token;
                tokenToSave.user = player;
                tokenToSave.expiresOn = new Date(
                  new Date().setHours(new Date().getHours() + 23)
                );
                await tokenRepository.save(tokenToSave);
                player.tokens = [tokenToSave];
                await userRepository.save(player);
                return res
                  .cookie("access_token", token, {
                    expires: new Date(Date.now() + 30 * 24 * 3600000),
                    httpOnly: true,
                    secure: true,
                  })
                  .status(200)
                  .sendFile("index.html", {
                    root: path.join(
                      path.join(__dirname, "../../Frontend/public/")
                    ),
                  });
              }
            }
          } else {
            res.status(404);
          }
        }
      }
    );
    app.post(
      "/api/register",
      body("username").not().isEmpty().trim().escape().custom(isValidUsername),
      body("email").isEmail().normalizeEmail().custom(isValidEmail),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password length must be at least 8 characters")
        .not()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage(
          "Password must contain a at least an uppercase letter , a lowercase letter, a number and a special character"
        ),
      body("passwordConfirm").custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        } else {
          let player = new User();
          req.body.password = createHash("sha256")
            .update(req.body.password)
            .digest("hex");
          if (typeof req.body != "undefined") {
            let uPlayer = await userRepository.findOne({
              username: req.body.username,
            });
            let ePlayer = await userRepository.findOne({
              email: req.body.email,
            });
            if (!uPlayer && !ePlayer) {
              player.username = req.body.username;
              player.email = req.body.email;
              player.password = req.body.password;
              player.money = 20000;
              player.requests = [];
              player.responses = [];
              userRepository.save(player);
            } else {
              return res.send("Email or Username already exists");
            }
          } else {
            return res.status(404);
          }
          res.sendFile("index.html", {
            root: path.join(path.join(__dirname, "../../Frontend/public/")),
          });
        }
      }
    );

    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("disconnect", () => {
        console.log("a user disconnected");
        if (getPlayerById(socket.id)) {
          deletePlayer(getRoomById(getPlayerById(socket.id).roomId), socket.id);
        }
      });
      socket.on("game", (user) => {
        if (!isPlayer(user.username)) {
          const roomId = getRoom();
          let player = new Player(user.username, user.money, socket.id, roomId);
          let room = getRoomById(roomId);
          socket.join(roomId);
          room.players = [...room.players, player];
          const play = {
            username: player.username,
            money: player.money,
            cards: player.hand.cards,
          };
          io.to(socket.id).emit("player", play);
          io.to(socket.id).emit("id", room.players.indexOf(player));
          // this is shit, I mean '> 1'
          if (io.sockets.adapter.rooms.get(getRoomById(roomId).id).size > 1) {
            room.startGame(200);
            io.emit("currentPlayer", room.game.currentPlayer);
            io.emit("players", room.players);
          }
        }
      });
      socket.on("check", (id) => {
        let room = getRoomById(getPlayerById(socket.id).roomId);
        room.game.check(room.game.players[id]);
        if (!room.game.end) {
          io.emit("cards", JSON.stringify(room.game.cards));
          io.emit("players", room.players);
          if (room.game.rounds == 5) {
            io.emit("winners", JSON.stringify(room.game.winners));
          }
          io.emit("currentPlayer", room.game.currentPlayer);
        } else {
          io.emit("winners", JSON.stringify(room.game.winners));
        }
      });

      socket.on("call", (id: number) => {
        let room = getRoomById(getPlayerById(socket.id).roomId);
        room.game.call(room.game.players[id]);
        io.emit("cards", JSON.stringify(room.game.cards));
        io.emit("players", room.players);
        if (room.game.rounds == 5) {
          io.emit("winners", JSON.stringify(room.game.winners));
        }
        io.emit("currentPlayer", room.game.currentPlayer);
      });

      socket.on("bet", (id: number) => {
        let room = getRoomById(getPlayerById(socket.id).roomId);
        room.game.bet(room.game.players[id], 200);
        io.emit("cards", JSON.stringify(room.game.cards));
        io.emit("players", room.players);
        io.emit("currentPlayer", room.game.currentPlayer);
      });

      socket.on("raise", (id: number) => {
        let room = getRoomById(getPlayerById(socket.id).roomId);
        room.game.raise(room.game.players[id], 200);
        io.emit("cards", JSON.stringify(room.game.cards));
        io.emit("players", room.players);
        io.emit("currentPlayer", room.game.currentPlayer);
      });

      socket.on("fold", (id) => {
        let room = getRoomById(getPlayerById(socket.id).roomId);
        room.game.fold(room.game.players[id]);
        io.emit("cards", JSON.stringify(room.game.cards));
        io.emit("players", room.players);
        if (room.game.rounds == 5) {
          io.emit("winners", JSON.stringify(room.game.winners));
        }
        io.emit("currentPlayer", room.game.currentPlayer);
      });
      socket.on("playerCards", (id) => {
        let room = getRoomById(getPlayerById(socket.id).roomId);
        io.to(socket.id).emit(
          "playerCards",
          JSON.stringify(room.game.players[id].hand.cards)
        );
      });
    });

    io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });

    io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });

    const simplifyPlayers = (players: Player[]) => {
      let playersToSend = [];
      players.forEach((player) => {
        playersToSend = [
          ...playersToSend,
          {
            username: player.username,
            money: player.money,
          },
        ];
      });
      return playersToSend;
    };

    const simplifyPlayer = (player: Player) => {
      return {
        username: player.username,
        money: player.money,
        cards: player.hand.cards,
      };
    };

    const isPlayer = (username: string): boolean => {
      for (let i = 0; i < players.length; i++) {
        if (username == players[i].username) {
          console.log(username, players[i].username, i);
          return true;
        }
      }
      return false;
    };

    const getPlayerById = (id: string) => {
      for (let i = 0; i < players.length; i++) {
        if (players[i].id === id) {
          return players[i];
        }
      }
    };

    const deletePlayer = (room: Room, id: string) => {
      for (let i = 0; i < players.length; i++) {
        if (id == players[i].id) {
          room.game.fold(players[i]);
          players.splice(i, 1);
        }
      }
    };

    const createRoom = (): string => {
      const str = Buffer.from(Math.random().toString())
        .toString("base64")
        .substring(0, 7);
      rooms = [...rooms, new Room(str)];
      return str;
    };

    const getRoom = (): string => {
      let availableRooms: string[] = [];
      for (let i = 0; i < rooms.length; i++) {
        // perfect number of players to play a poker game
        if (io.sockets.adapter.rooms.get(rooms[i].id).size < 6) {
          availableRooms = [...availableRooms, rooms[i].id];
        }
      }
      if (availableRooms.length < 1) {
        return createRoom();
      }
      return availableRooms[0];
    };

    const getRoomById = (id: string): Room => {
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id === id) {
          return rooms[i];
        }
      }
    };

    const insertPlayerInRoom = () => {};
    // start express server
    httpServer.listen(3000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/ to see results"
    );
  })
  .catch((error) => console.log(error));
