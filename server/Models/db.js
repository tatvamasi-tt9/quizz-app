const mongoose=require('mongoose')
const mongo_url=process.env.MONGO_URI

mongoose.connect(mongo_url).then(()=>{
    console.log("mongoose connected");
}).catch((err)=>{console.log('mongodb connection error',err)})