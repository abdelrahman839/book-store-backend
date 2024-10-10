const Joi = require("joi");
const { isValidObjectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    pages: Joi.number().optional(),
    authorId: Joi.string().custom(isValidObjectId).required(),
  }),
};

const update = {
  params: Joi.object().keys({
    _id: Joi.string().custom(isValidObjectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      pages: Joi.number().optional(),
    })
    .or("name", "pages")
    .messages({
      "object.missing": "At least one update field must be provided",
    }),
};

module.exports = {
  create,
  update,
};
