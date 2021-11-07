var UserProfile = require('../models/UserProfile');

exports.create = (req, res) => {

  // 確認沒有漏填欄位
  const noEmptyData =
    req.body.UserName &&
    req.body.Password &&
    req.body.ConfirmPassword;

  // 確認第一次和第二次輸入的密碼相同
  const validConfirmPassword = req.body.Password === req.body.ConfirmPassword;
  if (!noEmptyData) {
    const err = new Error('Some fields are empty');
    err.status = 400;
    res.send(err);
  }

  if (!validConfirmPassword) {
    const err = new Error('Passwords do not match');
    err.status = 400;
    res.send(err);
  }

  // 資料無誤，將使用者填寫的內容存成物件
  const user = new UserProfile({
    UserName: req.body.UserName,
    Password: req.body.Password,
    ConfirmPassword: req.body.ConfirmPassword
  });
  user
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          status:1,
          user:
              err.user || "Some error occurred while creating the User.",
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
            store: "Store not found with id" + req.params.storeId,
        });
      }
      return res.status(500).send({
          store: "Store not found with id" + req.params.storeId,
      });
    });
}