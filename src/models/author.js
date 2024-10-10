const mongoose = require("mongoose");
const authorSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    searchTerm: { type: String, trim: true },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { Timestamps: true }
);

authorSchema.pre("save", async function (next) {
  this.searchTerm = `${this.name.toLowerCase()} `;
  next();
});

authorSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update?.name) {
    const name = update.name;
    update.searchTerm = name.toLowerCase().trim();
  }
  next();
});

const Author = mongoose.models.Author || mongoose.model("Author", authorSchema);
module.exports = Author;
