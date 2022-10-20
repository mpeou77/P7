const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  feeling: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createDate: { type: String, required: true },
  likes: { type: Number, default: 0, required: false },
  usersLiked: { type: [String] },
});

module.exports = mongoose.model("Post", postSchema);
