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
    // ensure username and nickname are unique, i.e the username and nickname are not already in the database
    UserName: req.body.UserName
  })
    .then(user => {
      // if the username is unique 
      if (!user) {
        let hash = crypto.pbkdf2Sync(userdata.Password, salt,  
        1000, 64, `sha512`).toString(`hex`);
        userdata.Password = hash
        UserProfile.findOne({NickName: userdata.NickName}, function(err, data) {
          if(!data) {
              // if the username and nickname are unique go ahead and create userData after hashing password and salt
            UserProfile.create(userdata) 
            .then(() => {
              // after successfully creating userData display registered message
              res.redirect("/login")
            })
            .catch(err => {
              // if an error occured while trying to create userData, go ahead and display the error
              res.send('error:' + err)
            })
          } else {
            // if the username and nickname are not unique, display that username is already registered with an account
            res.status(400).send({
              status: 3,
              user: 'That nick name already exisits!'
            });
          }
        })
        
      } else {
        // if the username and nickname are not unique, display that username is already registered with an account
        res.status(400).send({
          status: 4,
          user: 'That user name already exisits!'
        });
      }
    })
    .catch(err => {
      // display error if an error occured
      res.send('error:' + err)
    });      
};

exports.getregister = (req, res) => {
  UserProfile.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                store:
                    err.store || "Some error occurred while retrieving users.",
            });
        });
}

exports.login = (req, res) => {

  UserProfile.findOne({
    // check to see if a username and password match like this is in the database
    NickName: req.body.NickName,
    // Password: crypto.pbkdf2Sync(req.body.Password, salt,  
    //   1000, 64, `sha512`).toString(`hex`)
  })
    .then(user => {
      // if the username and password match exist in database then the user exists
      if (user) {
        if(user.Password == crypto.pbkdf2Sync(req.body.Password, salt,  
          1000, 64, `sha512`).toString(`hex`)) {
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
          res.status(400).send({
            status: 5,
            user:"Wrong password!"
          });
        }
      } 
      else {
        // if user cannot be found, display the message below
        res.status(400).send({
          status: 6,
          user:"This nick name is not regestered!"
        });
      }
    })
    // catch and display any error that occurs while trying to login user
    .catch(err => {
      res.send('error:' + err)
    })

}

exports.getlogin = (req, res) => {
  res.render('login')
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