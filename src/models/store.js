const mongoose = require("mongoose");
const storeSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    searchTerm: { type: String, trim: true },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { Timestamps: true }
);
storeSchema.pre("save", async function (next) {
  this.searchTerm = `${this.name.toLowerCase()} `;
  next();
});

storeSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update?.name) {
    const name = update.name;
    update.searchTerm = name.toLowerCase().trim();
  }
  next();
});

const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);
module.exports = Store;
