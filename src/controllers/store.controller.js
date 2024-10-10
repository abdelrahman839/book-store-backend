const { StoreService } = require("../services/index");
const { getAggregateOptions } = require("../utils");

class StoreController {
  async create(req, res, next) {
    try {
      const exists = await StoreService.get({
        isDeleted: false,
        searchTerm: req.body.name.toLowerCase(),
      });
      if (exists)
        return res
          .status(400)
          .json({ success: false, error: "Store already exists" });
      const store = await StoreService.create(req.body);
      if (!store)
        return res.status(400).json({
          success: false,
          error: "Error creating store, Please try again.",
        });
      return res.status(201).json({ message: "success", success: true });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }
  async update(req, res, next) {
    try {
      if (req.body?.name) {
        const exists = await StoreService.get({
          _id: { $ne: req.params._id },
          isDeleted: false,
          searchTerm: req.body.name.toLowerCase(),
        });
        if (exists)
          return res.status(400).json({
            success: false,
            error: "Store already exists with this name",
          });
      }
      const store = await StoreService.update(
        { _id: req.params._id },
        req.body
      );
      if (!store)
        return res.status(404).json({
          success: false,
          error: "Store not found",
        });
      return res.status(200).json({ message: "success", success: true });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  async getAll(req, res, next) {
    try {
      let { search } = req.query;
      if (!search) search = "";
      const options = {
        match: {
          $match: {
            isDeleted: false,
            searchTerm: { $regex: search, $options: "i" },
          },
        },
        project: { $project: { name: 1 } },
        ...getAggregateOptions(req.query),
      };
      const stores = await StoreService.aggregateQuery(options);
      return res.status(200).json({
        message: "success",
        success: true,
        currentPage: stores.currentPage,
        totalPages: stores.totalPages,
        total: stores.total,
        data: stores.data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  async delete(req, res, next) {
    try {
      const store = await StoreService.update(
        { _id: req.params._id, isDeleted: false },
        { deletedAt: new Date(), isDeleted: true }
      );
      if (!store)
        return res
          .status(404)
          .json({ success: false, error: "Store not found" });
      return res
        .status(200)
        .json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }
}

module.exports = new StoreController();
