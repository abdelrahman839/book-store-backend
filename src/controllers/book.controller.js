const { BookService, AuthorService } = require("../services/index");
const { getAggregateOptions } = require("../utils");

class BookController {
  async create(req, res, next) {
    try {
      const author = await AuthorService.get({
        _id: req.body.authorId,
        isDeleted: false,
      });
      if (!author)
        return res
          .status(404)
          .json({ success: false, error: "Author not found" });

      const exists = await BookService.get({
        isDeleted: false,
        searchTerm: req.body.name.toLowerCase(),
      });
      if (exists)
        return res
          .status(400)
          .json({ success: false, error: "Book already exists" });

      const book = await BookService.create(req.body);
      if (!book)
        return res.status(400).json({
          success: false,
          error: "Error creating book, Please try again.",
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
        const exists = await BookService.get({
          _id: { $ne: req.params._id },
          isDeleted: false,
          searchTerm: req.body.name.toLowerCase(),
        });
        if (exists)
          return res.status(400).json({
            success: false,
            error: "Book already exists with this name",
          });
      }
      const book = await BookService.update({ _id: req.params._id }, req.body);
      if (!book)
        return res.status(404).json({
          success: false,
          error: "Book not found",
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
        project: { $project: { name: 1, pages: 1 } },
        ...getAggregateOptions(req.query),
      };
      const books = await BookService.aggregateQuery(options);
      return res.status(200).json({
        message: "success",
        success: true,
        currentPage: books.currentPage,
        totalPages: books.totalPages,
        total: books.total,
        data: books.data,
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
      const book = await BookService.update(
        { _id: req.params._id, isDeleted: false },
        { deletedAt: new Date(), isDeleted: true }
      );
      if (!book)
        return res
          .status(404)
          .json({ success: false, error: "Book not found" });
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

module.exports = new BookController();
