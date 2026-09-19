const UserModel=require('../Models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const user=await UserModel.findOne({email});
        if(user){
            return res.status(400).json({message:'user already exist'})
        }
        
        const userModel= new UserModel({name,email,password});
        userModel.password= await bcrypt.hash(password,10);
        
        await userModel.save();
        res.status(201).json({
            message:"Signup successfully",
            success:'true'
        })

    }
    catch(err)
    {
       res.status(500)
       .json({
        message:"interruption",
        success:false
       })
    }
}

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(403).json({message:'email or password is incorrect',success:false})
        }
        
        const isPass=await bcrypt.compare(password,user.password)
        if(!isPass)
        {
             return res.status(403).json({message:'email or password is incorrect', success:false})
        }

      const jwtToken = jwt.sign(
  {
    userId: user._id,      
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);

res.cookie("token", jwtToken, {
  httpOnly: true,      // JS cannot read it
  secure: false,       // true if i do it in production (https)
  sameSite: "lax",     // protects from some attack called CSRF ,dont know what that is //helps control cross-site cookie sending
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});


    res.status(200).json({
        message:'login successul',
        success:true,
        email,
        name:user.name,
    })

    }
    catch(err)
    {
       res.status(500)
       .json({
        message:"interruption",
        success:false
       })
    }
}


module.exports={signup,login}
