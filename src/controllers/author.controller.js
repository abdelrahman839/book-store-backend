const { AuthorService } = require("../services/index");
const { getAggregateOptions } = require("../utils");

class AuthorController {
  async create(req, res, next) {
    try {
      const exists = await AuthorService.get({
        isDeleted: false,
        searchTerm: req.body.name.toLowerCase(),
      });
      if (exists)
        return res
          .status(400)
          .json({ success: false, error: "Author already exists" });
      const author = await AuthorService.create(req.body);
      if (!author)
        return res.status(400).json({
          success: false,
          error: "Error creating author, Please try again.",
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
      const exists = await AuthorService.get({
        _id: { $ne: req.params._id },
        isDeleted: false,
        searchTerm: req.body.name.toLowerCase(),
      });
      if (exists)
        return res.status(400).json({
          success: false,
          error: "Author already exists with this name",
        });
      const author = await AuthorService.update(
        { _id: req.params._id },
        req.body
      );
      if (!author)
        return res.status(404).json({
          success: false,
          error: "Author not found",
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
      const authors = await AuthorService.aggregateQuery(options);
      return res.status(200).json({
        message: "success",
        success: true,
        currentPage: authors.currentPage,
        totalPages: authors.totalPages,
        total: authors.total,
        data: authors.data,
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
      const author = await AuthorService.update(
        { _id: req.params._id, isDeleted: false },
        { deletedAt: new Date(), isDeleted: true }
      );
      if (!author)
        return res
          .status(404)
          .json({ success: false, error: "Author not found" });
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

module.exports = new AuthorController();
