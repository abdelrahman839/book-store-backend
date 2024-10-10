const Joi = require("joi");
const { isValidObjectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().optional(),
  }),
};

const update = {
  params: Joi.object().keys({
    _id: Joi.string().custom(isValidObjectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      address: Joi.string().optional(),
    })
    .or("name", "address")
    .messages({
      "object.missing": "At least one update field must be provided",
    }),
};

module.exports = {
  create,
  update,
};
