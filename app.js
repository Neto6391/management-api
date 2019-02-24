var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = require("./config/keys").mongoDB_URI;
mongoose
    .connect(db)
    .then(() => console.log("MongoDB conected!"))
    .catch(err => console.error.bind(console, 'Error of Connection!'));
const UserModel = require("./UserModel");

let user = new UserModel({
    name: 'Jhon Doe'
});

user.save(err => {
    if(err)
        console.error('Error a create the user');
    console.log('User created with success!');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
