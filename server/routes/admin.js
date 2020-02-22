const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const Admin = require("../models/admin");
const router = express.Router();


  
router.post("/adminSignup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const admin = new Admin({
      phone: req.body.phone,
      password: hash
    });
    admin
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/adminLogin", (req, res, next) => {
  let fetchedUser;
  Admin.findOne({ phone: req.body.phone })
    .then(admin => {
      if (!admin) {
        return res.status(401).json({
          message: "Failed"
        });
      }
      fetchedUser = admin;
      return bcrypt.compare(req.body.password, admin.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Failed"
        });
      }
      const token = jwt.sign(
        { phone: fetchedUser.phone, adminId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Failed"
      });
    });
});



 

















module.exports = router;