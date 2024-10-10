const mongoose = require("mongoose");
const bookSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    pages: { type: Number },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    searchTerm: { type: String, trim: true },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { Timestamps: true }
);
bookSchema.pre("save", async function (next) {
  this.searchTerm = `${this.name.toLowerCase()} `;
  next();
});

bookSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update?.name) {
    const name = update.name;
    update.searchTerm = name.toLowerCase().trim();
  }
  next();
});
const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
module.exports = Book;
