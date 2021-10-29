const express = require("express");
const userModel = require("../models/StoreProfile");
const app = express();

app.post("/add_user", async (request, response) => {
    const userprofile = new userModel(request.body);
  
    try {
      await userprofile.save();
      response.send(userprofile);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/userprofiles", async (request, response) => {
    const userprofiles = await userModel.find({});
  
    try {
      response.send(userprofiles);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  module.exports = app;