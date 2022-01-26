var UserProfile = require('../models/UserProfile');
// Import module into the application
const crypto = require('crypto')

// Creating salt for all users
let salt = 'f844b09ff50c'
var users = require('../users').items;
const { eachLimit } = require('async');

var findUser = function(name, password){
  return users.find(function(item){
      return item.NickName === name && item.Password === password;
  });
};

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
          // if the nickname is unique 
          if(!data) {
            UserProfile.findOne({UserName: userdata.NickName}, function(err, data) {
              // if the nickname is unique 
              if(!data) {
                UserProfile.findOne({NickName: userdata.UserName}, function(err, data) {
                  // if the username is unique 
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
                    // 當使用者輸入的 UserName 跟其他人的 NickName 相同
                    res.status(400).send({
                      status: 8,
                      user: 'That user name already exisits in database!'
                    });
                  }
                });
              } else {
                // 當使用者輸入的 NickName 跟其他人的 UserName 相同
                res.status(400).send({
                  status: 7,
                  user: 'That nick name already exisits in database!'
                });
              }
            });
          } else {
            // 當使用者輸入的 NickName 跟其他人的 NickName 相同
            res.status(400).send({
              status: 3,
              user: 'That nick name already exisits!'
            });
          }
        });
      } else {
        // 當使用者輸入的 UserName 跟其他人的 UserName 相同
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
  res.render('register')
  // UserProfile.find()
  //       .then((data) => {
  //           res.send(data);
  //       })
  //       .catch((err) => {
  //           res.status(500).send({
  //               store:
  //                   err.store || "Some error occurred while retrieving users.",
  //           });
  //       });
}

exports.login = (req, res) => {
  
  var sess = req.session;
  var user = findUser(req.body.NickName, req.body.Password);
  let UserName = req.body.UserName,
      NickName = req.body.NickName;
  let conditions = !!UserName ? {UserName: UserName} : {NickName: NickName};


  UserProfile.findOne(
    conditions
  //   {
  //   // check to see if a username and password match like this is in the database
  //   NickName: req.body.NickName,
  //   // Password: crypto.pbkdf2Sync(req.body.Password, salt,  
  //   //   1000, 64, `sha512`).toString(`hex`)
  // }
  )
    .then(user => {
      // if the username and password match exist in database then the user exists
      if (user) {
        if(user.Password == crypto.pbkdf2Sync(req.body.Password, salt,  
          1000, 64, `sha512`).toString(`hex`)) {
            const payload = {
              NickName: user.NickName,  
              Password: user.Password 
            }
            // req.session.rege
            // after successful login display token and payload data
            // res.redirect("/stores");
            console.log("login")
            res.send("login successful~")
        }
        else {
          res.status(400).send({
            status: 6,
            user: 'Wrong password!'
          });
        }
      } 
      else {
        // if user cannot be found, display the message below
        res.status(400).send({
          status: 5,
          user: 'This user name or nick name is not regestered!'
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
  
  // clear up session
  req.logout()

  // add flash message
  req.flash('success_msg', 'Logout successful!')

  // redirect back to login page
  res.redirect('/login')
}