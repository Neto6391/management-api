import express from "express";
import AccountModel from "./models/accountModel";
import Cryptr from "cryptr";
import jwt from "jsonwebtoken";

const accountRouter = express.Router();
let securePassword = new Cryptr("aes256");

accountRouter
	.route("/")
	.get((req, res) => {})
	.post((req, res) => {});

//This Function is for use of validations of Token and Auth
accountRouter.use("/:id", (req, res, next) => {
	next();
});

accountRouter
	.route("/:id")
	.get((req, res) => {})
	.put((req, res) => {})
	.delete((req, res) => {});
