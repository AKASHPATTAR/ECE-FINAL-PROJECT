import userModel from "../models/userModel.js";

// Add to user cart  
const addToCart = async (req, res) => {
   try {
      const userData = await userModel.findOne({ _id: req.body.userId });

      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      let cartData = userData.cartData || {}; // Ensure cartData is an object

      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      } else {
         cartData[req.body.itemId] += 1;
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });

      res.json({ success: true, message: "Added to cart" });
   } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error occurred" });
   }
};

// Remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);

      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      let cartData = userData.cartData || {};

      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });

      res.json({ success: true, message: "Removed from cart" });
   } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error occurred" });
   }
};

// Get user cart
const getCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);

      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      const cartData = userData.cartData || {};

      res.json({ success: true, cartData: cartData });
   } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error occurred" });
   }
};

export { addToCart, removeFromCart, getCart };
