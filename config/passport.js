// 載入相關模組
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserProfile = require('../models/UserProfile')
module.exports = app => {

  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  // 透過done參數，把驗證的結果顯示出來
  passport.use(new LocalStrategy({ usernameField: 'NickName' }, (NickName, Password, done) => {
    UserProfile.findOne({ NickName })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That nick name is not registered!' })
        }
        if (user.Password !== Password) {
          return done(null, false, { message: 'Nick name or Password incorrect.' })
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))

  // 設定序列化 - 登入驗證通過，就把 user id 放進 session
  // 設定反序化 - 用 user id 去資料庫裡查出完整的 user 資料
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    UserProfile.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}