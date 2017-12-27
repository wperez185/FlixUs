const express = require("express");
const router = express.Router();
const path = require("path");

function requiredLogin(req, res, next){
  if(!req.session.user){
    res.redirect("/")
  }else {
    next();
  }
}
router.get('/logout', function(req, res) {
 req.session.authenticated = false
 req.session.destroy();
 return res.redirect('/')
})

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "public/index.html"))
})

// router.get("/profile",requiredLogin, (req, res) => {
//   res.sendFile(path.join(__dirname, "../..", "public/settings/profile.html"))
// })

router.get("/account", requiredLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "public/settings/admin.html"))
})

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "public/settings/signup.html"))
})

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "public/settings/login.html"))
})

router.get("/forgotPassword", (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "public/forgotPassword.html"))
})

router.get("/resetPassword", (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "public/resetPassword.html"))
})

module.exports = router;
