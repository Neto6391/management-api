import express from "express";
import AccountModel from "../models/accountModel";
import Cryptr from "cryptr";
import jwt from "jsonwebtoken";

const accountRouter = express.Router();
let securePassword = new Cryptr("aes256");

accountRouter
	.route("/")
	.get((req, res) => {
		try {
			let token = req.headers["token"];
			if (token) {
				jwt.verify(token, process.env.SECRET, (err, decoded) => {
					if (err) {
						res.statusMessage = "Unauthorized";
						res.status(401).json({
							Code: "2",
							message: "Invalid Token, Inexistent or Expired!"
						});
					} else if (decoded) {
						//Full Collection of data in Database
						AccountModel.find(
							{},
							{
								firstName: 1,
								lastName: 1,
								email: 1,
								phoneNumber: 1,
								dateBirth: 1,
								gender: 1
							},
							(err, account) => {
								if (err) {
									res.statusMessage = "Bad Request";
									res.status(400).json({
										Code: "3",
										message: "Data Request Was Sent Incorrect!"
									});
								}
								res.statusMessage = "OK";
								res.status(200).json(account);
							}
						);
					}
				});
			} else {
				res.statusMessage = "Unauthorized";
				res.status(401).json({
					Code: "2",
					message: "Invalid Token, Inexistent or Expired!"
				});
			}
		} catch (error) {
			console.error(error);
			res.statusMessage = "Internal error";
			res.status(500).json({
				Code: "1",
				message: "Error in Server!"
			});
		}
	})
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

export default accountRouter;
