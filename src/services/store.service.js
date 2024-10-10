const Service = require("./main-service");
class StoreService extends Service {}
const Store = require("../models/store");
module.exports = new StoreService(Store);
