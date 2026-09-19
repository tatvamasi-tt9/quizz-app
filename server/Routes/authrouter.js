const {signupValidation,loginValidation}=require('../Middlewares/Authvalidation')
const router= require('express').Router();

const {signup,login}=require('../Controllers/Authcontroller')

router.post('/signup',signupValidation,signup);
router.post('/login',loginValidation,login);


router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
});


module.exports=router;