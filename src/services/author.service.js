const Service = require("./main-service");
class AuthorService extends Service {}
const Author = require("../models/author");
module.exports = new AuthorService(Author);