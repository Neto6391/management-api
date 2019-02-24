var express = require('express');
var router = express.Router();
const UserModel = require("../UserModel");

/* GET users listing. */
router.get('/', function(req, res, next) {
  UserModel.find({name: 'Jhon Doe'}, (err, result) => {
    if(err)
      return handleError(err);
    res.status(200).json(result);
  });
});

module.exports = router;
