const express = require("express");
const userModel = require("../models/UserProfile");
const app = express();

app.post("/add_user", async (request, response) => {
    const UserProfile = new userModel(request.body);
    try {
      await UserProfile.save();
      response.send(UserProfile);
    } catch (error) {
      response.status(505).send(error);
    }
});

// app.get("/userprofiles", async (request, response) => {
//     const userprofiles = await userModel.find({});
  
//     try {
//       response.send(userprofiles);
//     } catch (error) {
//       response.status(500).send(error);
//     }
//   });

module.exports = app;