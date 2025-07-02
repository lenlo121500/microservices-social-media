import joi from "joi";

export const validateCreatePostSchema = (data) => {
  const schema = joi.object({
    content: joi.string().required(),
  });
  return schema.validate(data);
};

export const  validateUpdatePostSchema = (data) => {
  const schema = joi.object({
    content: joi.string(),
  });
  return schema.validate(data);
};
