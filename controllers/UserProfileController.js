var UserProfile = require('../models/UserProfile');
// Import module into the application
const crypto = require('crypto')
// Creating salt for all users
let salt = 'f844b09ff50c'

exports.register = (req, res) => {

  // 確認沒有漏填欄位
  const noEmptyData =
    req.body.UserName &&
    req.body.NickName &&
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
  const userdata = {
    UserName: req.body.UserName,
    NickName: req.body.NickName,
    Password: req.body.Password,
    ConfirmPassword: req.body.ConfirmPassword,
  }

  UserProfile.findOne({
    // ensure username is unique, i.e the username is not already in the database
    UserName: req.body.UserName
  })
    .then(user => {
      // if the username is unique 
      if (!user) {
        let hash = crypto.pbkdf2Sync(userdata.Password, salt,  
        1000, 64, `sha512`).toString(`hex`);
        userdata.Password = hash
        // if the username is unique go ahead and create userData after hashing password and salt
          UserProfile.create(userdata)
            .then(user => {
              // after successfully creating userData display registered message
              res.redirect("/login")
            })
            .catch(err => {
              // if an error occured while trying to create userData, go ahead and display the error
              res.send('error:' + err)
            })
      } else {
        // if the username is not unique, display that username is already registered with an account
        res.json({ error: 'The username ' + req.body.UserName + ' is registered with an account' })
      }
    })
    .catch(err => {
      // display error if an error occured
      res.send('error:' + err)
    });      
};

exports.login = (req, res) => {

  UserProfile.findOne({
    // check to see if a username and password match like this is in the database
    NickName: req.body.NickName,
    Password: crypto.pbkdf2Sync(req.body.Password, salt,  
      1000, 64, `sha512`).toString(`hex`)
  })
    .then(user => {
      // if the username and password match exist in database then the user exists
      if (user) {
        const payload = {
          NickName: user.NickName,  
          Password: user.Password 
        }
        // after successful login display token and payload data
        // res.redirect("/stores");
        console.log("login")
        res.send("login successful~")
      } 
      else {
        // if user cannot be found, display the message below
        res.json({ error: 'user not found' })
      }
    })
    // catch and display any error that occurs while trying to login user
    .catch(err => {
      res.send('error:' + err)
    })

}

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

exports.logout = (req, res) => {
  req.logout()
  res.redirect('/login')
}