const router = require("express").Router();
const { AuthorController } = require("../controllers/index");
const { ValidationMiddleware } = require("../middlewares");
const { AuthorValidation, CommonValidation } = require("../validations/index");

router.post(
  "/",
  ValidationMiddleware(AuthorValidation.create),
  AuthorController.create
);
router.put(
  "/:_id",
  ValidationMiddleware(AuthorValidation.update),
  AuthorController.update
);
router.get("/", AuthorController.getAll);
router.delete(
  "/:_id",
  ValidationMiddleware(CommonValidation._idValidation),
  AuthorController.delete
);
module.exports = router;
