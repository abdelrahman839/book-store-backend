const router = require("express").Router();
const { BookController } = require("../controllers/index");
const { ValidationMiddleware } = require("../middlewares");
const { BookValidation, CommonValidation } = require("../validations/index");

router.post(
  "/",
  ValidationMiddleware(BookValidation.create),
  BookController.create
);
router.put(
  "/:_id",
  ValidationMiddleware(BookValidation.update),
  BookController.update
);
router.get("/", BookController.getAll);
router.delete(
  "/:_id",
  ValidationMiddleware(CommonValidation._idValidation),
  BookController.delete
);
module.exports = router;
