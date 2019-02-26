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
								} else {
									res.statusMessage = "OK";
									res.status(200).json(account);
								}
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
	.post((req, res) => {
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
						let password = securePassword.encrypt(req.body.password);
						req.body.password = password;

						let account = new AccountModel(req.body);
						account.save(err => {
							if (err) {
								account._id = account._id - 1;
								console.log(" ID -> " + account._id);
								console.error(err);
								res.statusMessage = "Bad Request";
								res.status(400).json({
									Code: "3",
									message: "Data Request Was Sent Incorrect!"
								});
							} else {
								res.statusMessage = "Create";
								let accountAux = account.toObject();
								delete accountAux["password"];
								res.status(201).json(accountAux);
							}
						});
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
	});

//This Function is for use of validations of Token and Auth
accountRouter.use("/:id", (req, res, next) => {
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
					AccountModel.findById(req.params.id, (err, account) => {
						if (err || !account) {
							console.error(err);
							res.statusMessage = "Not Found";
							res.status(404).json({
								Code: "4",
								message: `Resource ${req.params.id} Not Found!`
							});
						} else {
							req.account = account;
							next();
						}
					});
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
});

accountRouter
	.route("/:id")
	.get((req, res) => {
		res.statusMessage = "OK";
		let accountAux = req.account.toObject();
		delete accountAux["password"];
		res.status(200).json(accountAux);
	})
	.put((req, res) => {
		let password = securePassword.encrypt(req.body.password);
		req.account.password = password;

		req.account.firstName = req.body.firstName;
		req.account.lastName = req.body.lastName;
		req.account.email = req.body.email;
		req.account.dateBirth = req.body.dateBirth;
		req.account.phoneNumber = req.body.phoneNumber;
		req.account.gender = req.body.gender;

		req.account.save(err => {
			if (err) {
				console.error(err);
				res.statusMessage = "Bad Request";
				res.status(400).json({
					Code: "3",
					message: "Data Request Was Sent Incorrect!"
				});
			} else {
				res.statusMessage = "Accept";
				res.status(202).json("");
			}
		});
	})
	.delete((req, res) => {
		req.account.remove(err => {
			if (err) {
				console.error(err);
				res.statusMessage = "Bad Request";
				res.status(400).json({
					Code: "3",
					message: "Data Request Was Sent Incorrect!"
				});
			} else {
				res.statusMessage = "Not Content";
				res.status(204).json("");
			}
		});
	});

export default accountRouter;
