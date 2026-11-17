import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!userId || !address) {
      return res.status(400).json({
        message: "userId and address are required",
      });
    }

    // 1. Added missing 'await'
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    // 2. Fixed 'lenght' -> 'length' and added status 400
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Filter out any deleted products just in case
    const validItems = cart.items.filter((item) => item.productId !== null);

    if (validItems.length === 0) {
      return res.status(400).json({
        message: "No valid products found in cart",
      });
    }

    // 3. Fixed 'item.quantity.price' -> 'item.productId.price'
    const orderItems = validItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    // 4. Fixed '.reduce()' return value
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // 5. Deduct stock from products
    for (let item of validItems) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // 6. Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      totalAmount,
      paymentMethod: "COD",
    });

    // 7. Fixed 'findOneAndupdate' -> 'findOneAndUpdate'
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};