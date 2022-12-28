const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

modules.exports = mongoose.model("Post", PostSchema);
