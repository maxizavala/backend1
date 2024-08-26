import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("productos", productSchema);

export default ProductModel;