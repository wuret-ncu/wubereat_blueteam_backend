const mongoose = require('mongoose');
var UserProfile = require('../models/UserProfile');

exports.create = (req, res) => {

  // 確認沒有漏填欄位
  const noEmptyData =
    req.body.UserName &&
    req.body.Password &&
    req.body.ConfirmPassword;
  console.log(noEmptyData);
  console.log(req.body);

  // 確認第一次和第二次輸入的密碼相同
  const validConfirmPassword = req.body.Password === req.body.ConfirmPassword;
  if (!noEmptyData) {
    return res.status(400).send({
      status: 1,
      user: 'Some fields are empty.'
    });
  }

  if (!validConfirmPassword) {
    return res.status(400).send({
      status: 2,
      user: 'Passwords do not match.'
    });
  }

  // 資料無誤，將使用者填寫的內容存成物件
  const user = new UserProfile({
    UserName: req.body.UserName,
    Password: req.body.Password,
    ConfirmPassword: req.body.ConfirmPassword,
  });

  user
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          status: 3,
          // user:
          //     err.user || "Can't catch user's data while creating the User.",
          err: err
          
        });
      });
      
};

exports.findOne = (req, res) => {
  UserProfile.findById(req.params.userId)
    .then((data) => {
      if(!data) {
        return res.status(404), send({
          user: "User not found with id " + req.params.userId,
        });
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.kind === "String") {
        return res.status(404).send({
            store: "Store not found with id" + req.params.storeId + ", because the type of data is not string.",
        });
      }
      return res.status(500).send({
          store: "Store not found with id" + req.params.storeId,
      });
    });
}