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
import { body, validationResult, CustomValidator } from "express-validator";
import Poker from "./poker/poker";
import Player from "./poker/player";
export interface PlayerAuthInfoRequest extends Request {
  playerUsername: number;
  // playerRole: string;
}
interface JwtPayload {
  username: number;
  // role: string;
}

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    app.use(bodyParser.json());
    app.use(
      express.static(path.join(__dirname, "../../ClubCasinoFrontend/public/"))
    );

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
    let players: Player[] = [
      new Player("momo", 500, 1),
      new Player("hehe", 500, 2),
    ];
    let game = new Poker(200, players);

    // setup express app here
    // ...
    const authorization = (req: PlayerAuthInfoRequest, res, next) => {
      const token = req.cookies.access_token;
      if (typeof token == "undefined") {
        return res.status(403).json({ message: "Forbidden" });
      }
      try {
        const data = jwt.verify(token, "goshawty") as JwtPayload;
        console.log(data);

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
          return Promise.reject("E-mail already in use");
        }
      });
    };

    app.get("/", (req, res) => {
      res.sendFile("index.html", {
        root: path.join(
          path.join(__dirname, "../../ClubCasinoFrontend/public/")
        ),
      });
    });

    app.get("/login", (req, res) => {
      res.sendFile(path.join(__dirname, "../public", "login.html"));
    });
    app.get("/register", (req, res) => {
      res.sendFile(path.join(__dirname, "../public", "index.html"));
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
      body("email")
        .isEmail()
        .normalizeEmail()
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
              username: req.body.username,
            });
            if (typeof player != "undefined") {
              player = await playerRepository.findOne({
                username: req.body.username,
                password: req.body.password,
              });
              if (typeof player != "undefined") {
                console.log(player);
                const token = jwt.sign(
                  { username: req.body.username },
                  "goshawty",
                  { expiresIn: "24h" }
                );
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
          if (typeof req.body != "undefined") {
            let uPlayer = playerRepository.findOne({
              username: req.body.username,
            });
            let ePlayer = playerRepository.findOne({ email: req.body.email });
            if (
              typeof uPlayer == "undefined" &&
              typeof ePlayer == "undefined"
            ) {
              player.username = req.body.username;
              player.email = req.body.email;
              player.password = req.body.password;
              player.money = 20000;
              player.friends = [];
              console.log(player);
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
        console.log("a user disconnected");
      });
      socket.on("check", (id) => {
        game.check(game.players[id]);
        io.emit("cards", JSON.stringify(game.cards));
        if (game.rounds == 5) {
          io.emit("winners", JSON.stringify(game.winners));
        }
        io.emit("currentPlayer", JSON.stringify(game.currentPlayer.username));
      });

      socket.on("call", (id: number) => {
        game.call(game.players[id]);
        io.emit("cards", JSON.stringify(game.cards));
        if (game.rounds == 5) {
          io.emit("winners", JSON.stringify(game.winners));
        }
        io.emit("currentPlayer", JSON.stringify(game.currentPlayer.username));
      });

      socket.on("bet", (id: number) => {
        game.bet(game.players[id], 200);
        io.emit("cards", JSON.stringify(game.cards));
        io.emit("currentPlayer", JSON.stringify(game.currentPlayer.username));
      });

      socket.on("raise", (id: number) => {
        game.raise(game.players[id], 200);
        io.emit("cards", JSON.stringify(game.cards));
        io.emit("currentPlayer", JSON.stringify(game.currentPlayer.username));
      });

      socket.on("fold", (id) => {
        game.fold(game.players[id]);
        io.emit("cards", JSON.stringify(game.cards));
        if (game.rounds == 5) {
          io.emit("winners", JSON.stringify(game.winners));
        }
        io.emit("currentPlayer", JSON.stringify(game.currentPlayer.username));
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
