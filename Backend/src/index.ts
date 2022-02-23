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
import { rmSync } from "fs";
import { emit } from "process";
export interface PlayerAuthInfoRequest extends Request {
  playerUsername: string;
  // playerRole: string;
}
interface JwtPayload {
  username: string;
  // role: string;
}

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, "../../Frontend/public/")));
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

    let playerRepository = connection.getRepository(User);
    let players: Player[] = [];
    let game: Poker;
    let counter = 0;
    let i = 2;

    // setup express app here
    // ...
    const authorization = (req: PlayerAuthInfoRequest, res, next) => {
      const token = req.cookies.access_token;
      if (typeof token == "undefined") {
        return res.status(403).json({ message: "Forbidden" });
      }
      try {
        const data = jwt.verify(token, "goshawty") as JwtPayload;
        req.playerUsername = data.username;
      } catch {
        res.sendStatus(403);
      }
      return next();
    };

    const isValidEmail: CustomValidator = (value) => {
      return playerRepository.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    };

    const isValidUsername: CustomValidator = (value) => {
      return playerRepository.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    };

    app.get("/", (req: PlayerAuthInfoRequest, res) => {
      res.sendFile("index.html", {
        root: path.join(path.join(__dirname, "../../Frontend/public/")),
      });
      io.on("connection", (socket) => {
        console.log("momo");
        io.to(socket.id).emit(req.playerUsername);
      });
    });

    app.get("/logout", authorization, (req, res) => {
      return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out" });
    });

    app.get("/protected", authorization, (req: PlayerAuthInfoRequest, res) => {
      return res.json({ player: { username: req.playerUsername } });
    });

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
            let player = await playerRepository.findOne({
              email: req.body.email,
            });
            if (player) {
              req.body.password = createHash("sha256")
                .update(req.body.password)
                .digest("hex");
              player = await playerRepository.findOne({
                email: req.body.email,
                password: req.body.password,
              });
              if (player) {
                const token = jwt.sign(
                  { username: player.username },
                  "goshawty",
                  { expiresIn: "24h" }
                );
                io.on("connection", (socket) => {
                  io.to(socket.id).emit(player.username);
                });
                return res
                  .cookie("access_token", token, {
                    expires: new Date(Date.now() + 30 * 24 * 3600000),
                    httpOnly: true,
                    secure: true,
                  })
                  .status(200)
                  .json({ message: "Logged in successfully" });
              }
            }
          } else {
            res.status(404).send("no bro");
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
            let uPlayer = await playerRepository.findOne({
              username: req.body.username,
            });
            let ePlayer = await playerRepository.findOne({
              email: req.body.email,
            });
            if (!uPlayer && !ePlayer) {
              player.username = req.body.username;
              player.email = req.body.email;
              player.password = req.body.password;
              player.money = 20000;
              player.friends = [];
              playerRepository.save(player);
            } else {
              return res.send("Email or Username already exists");
            }
          } else {
            return res.status(404).send("no bro");
          }

          res.send("registered man");
        }
      }
    );

    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("disconnect", () => {
        counter--;
        console.log("a user disconnected");
      });
      socket.on("name", (name: string) => {
        counter++;
        let player = new Player(name, 500 * i--);
        players = [...players, player];
        io.to(socket.id).emit("player", players[players.indexOf(player)]);
        io.to(socket.id).emit("id", players.indexOf(player));
        if (counter > 1) {
          game = new Poker(200, players);
          io.emit("currentPlayer", game.currentPlayer);
          io.emit("players", players);
        }
      });
      socket.on("check", (id) => {
        game.check(game.players[id]);
        io.emit("cards", JSON.stringify(game.cards));
        io.emit("players", players);
        if (game.rounds == 5) {
          io.emit("winners", JSON.stringify(game.winners));
        }
        io.emit("currentPlayer", game.currentPlayer);
      });

      socket.on("call", (id: number) => {
        game.call(game.players[id]);
        io.emit("cards", JSON.stringify(game.cards));
        io.emit("players", players);
        if (game.rounds == 5) {
          io.emit("winners", JSON.stringify(game.winners));
        }
        io.emit("currentPlayer", game.currentPlayer);
      });

      socket.on("bet", (id: number) => {
        game.bet(game.players[id], 200);
        io.emit("cards", JSON.stringify(game.cards));
        io.emit("players", players);
        io.emit("currentPlayer", game.currentPlayer);
      });

      socket.on("raise", (id: number) => {
        game.raise(game.players[id], 200);
        io.emit("cards", JSON.stringify(game.cards));
        io.emit("players", players);
        io.emit("currentPlayer", game.currentPlayer);
      });

      socket.on("fold", (id) => {
        game.fold(game.players[id]);
        io.emit("cards", JSON.stringify(game.cards));
        io.emit("players", players);
        if (game.rounds == 5) {
          io.emit("winners", JSON.stringify(game.winners));
        }
        io.emit("currentPlayer", game.currentPlayer);
      });
      socket.on("playerCards", (id) => {
        io.to(socket.id).emit(
          "playerCards",
          JSON.stringify(game.players[id].hand.cards)
        );
      });
    });

    // start express server
    httpServer.listen(3000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/ to see results"
    );
  })
  .catch((error) => console.log(error));
