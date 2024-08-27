import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "productos" },
            quantity: { type: Number, default: 1 },
        },
    ],
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;