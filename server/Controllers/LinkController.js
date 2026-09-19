// using npm install jsdom @mozilla/readability axios


const uploadLink = async(req,res)=>{

    try{
        const {link}=req.body;
        

    }
    catch(err){
        return res.status(500).json({
            message:'error in link fetching'
        })
    }
}