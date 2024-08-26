import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: []
})

const ProductModel = mongoose.model("productos", productSchema);

export default ProductModel;