const router = require("express").Router();
const { StoreController } = require("../controllers/index");
const { ValidationMiddleware } = require("../middlewares");
const { StoreValidation, CommonValidation } = require("../validations/index");

router.post(
  "/",
  ValidationMiddleware(StoreValidation.create),
  StoreController.create
);
router.put(
  "/:_id",
  ValidationMiddleware(StoreValidation.update),
  StoreController.update
);
router.get("/", StoreController.getAll);
router.delete(
  "/:_id",
  ValidationMiddleware(CommonValidation._idValidation),
  StoreController.delete
);
module.exports = router;
