import Joi from "joi";

// middleware thats why we take 3 parms
const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(), 
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Bad request", error: error.details });
  }
  next();
};

const loginVaidation = (req,res,next)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    })
    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400).json({message:"Bad request",error})
    }
    next();
}

export { signupValidation ,loginVaidation};
