const { Types } = require("mongoose");

const isValidObjectId = (value, helpers) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helpers.message("Invalid ObjectId");
};

module.exports = {
  isValidObjectId,
};
