const router = require("express").Router();

router.get("/", function (req, res) {
  res.json({ message: "welcome to Book world apis" });
});

const author = require("./author");
const store = require("./store");
const book = require("./book");

router.use("/author", author);
router.use("/store", store);
router.use("/book", book);

module.exports = router;
