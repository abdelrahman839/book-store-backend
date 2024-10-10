const Joi = require("joi");
const { isValidObjectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const update = {
  params: Joi.object().keys({
    _id: Joi.string().custom(isValidObjectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  create,
  update,
};
