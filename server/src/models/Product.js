import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    price: { type: Number, required: true, min: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

// Useful indexes
productSchema.index({ name: 1 });
productSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);
