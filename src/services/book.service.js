const Service = require("./main-service");
class BookService extends Service {}
const Book = require("../models/book");
module.exports = new BookService(Book);
