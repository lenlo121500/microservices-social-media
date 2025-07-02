import joi from "joi";

export const validateRegisterSchema = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).required(),
    firstName: joi.string().min(3).max(50).required(),
    lastName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(8),
  });
  return schema.validate(data);
};

export const validateLoginSchema = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(8),
  });
  return schema.validate(data);
};
