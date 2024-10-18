import Joi from "joi";

// middleware thats why we take 3 parms
const productValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    price: Joi.number().positive().required(),
    desc: Joi.string().min(10).max(100).required(),
    size: Joi.array().items(Joi.string()).min(1),
    stock: Joi.string().valid("Available", "Unavailable").default("Available"), // Default value if omitted
    category: Joi.string()
      .valid(
        "T-Shirt",
        "Jeans",
        "Jacket",
        "Shoes",
        "Mobile",
        "Furniture",
        "Laptop"
      )
      .required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: `Validation error: ${error.details[0].message}`,
      status: false,
    });
  }

  // Use validated value (which includes default values)
  req.body = value; // Assign the validated value back to req.body
  next();
};

export { productValidation };
