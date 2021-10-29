const UserProfile = require('../models/UserProfile');

router.post('/register', (req, res, next) => {
  // 確認沒有漏填欄位
  const noEmptyData =
    req.body.UserName &&
    req.body.Password;

  // 確認第一次和第二次輸入的密碼相同
  const validConfirmPassword = req.body.Password === req.body.confirmPassword;
  if (!noEmptyData) {
    const err = new Error('Some fields are empty');
    err.status = 400;
    return next(err);
  }

  if (!validConfirmPassword) {
    const err = new Error('Passwords do not match');
    err.status = 400;
    return next(err);
  }

  // 資料無誤，將使用者填寫的內容存成物件
  const UserProfileData = {
    UserName: req.body.UserName,
    Password: req.body.Password,
  };

  // 使用 Create 將資料寫入 DB
  UserProfile.create(UserProfileData, (err, UserProfile) => {
    if (err) {
      return next(err);
    }

    return res.redirect('/profile');
  });
});