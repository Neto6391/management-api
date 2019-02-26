import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import Cryptr from "cryptr";

//Import routes
import accountRouter from "./routes/accountRouter";

//Import Models
import AccountModel from "./models/accountModel";

//Test data of account
import dataAccount from "./data/account.json";

const app = express();

//Connection MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error of Connection"));

let securePassword = new Cryptr("aes256");
let password = securePassword.encrypt(dataAccount.password);
dataAccount.password = password;

let account = new AccountModel(dataAccount);

account.save(err => {
	if (err) console.error("Error: " + err);
	console.log("Account test@test.com created with success!");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/accounts", accountRouter);

export default app;
