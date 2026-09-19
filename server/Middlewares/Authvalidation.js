const Joi=require('joi')

const signupValidation=(req,res,next)=>{
    const Schema=Joi.object(
        {
            name:Joi.string().min(3).max(100).required(),
            email: Joi.string().email({ tlds: { allow: false } }).lowercase().trim().required(),
           password: Joi.string().min(6).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')).required()
            .messages({
                "string.pattern.base":
                    "Password must contain at least one uppercase, one lowercase, and one number",
            }),
        });
    const {error}=Schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details[0].message,
        });
    }

    next();
}
const loginValidation=(req,res,next)=>{
    const Schema=Joi.object(
        {
            email: Joi.string()
            .email({ tlds: { allow: false } })
            .lowercase()
            .trim()
            .required(),
           password: Joi.string().min(6).max(30)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
            .required()
            .messages({
                "string.pattern.base":
                    "Password must contain at least one uppercase, one lowercase, and one number",
            }),
        }
    );
    const {error}=Schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details[0].message,
        });
    }

    next();
}


module.exports={
    signupValidation,loginValidation
}