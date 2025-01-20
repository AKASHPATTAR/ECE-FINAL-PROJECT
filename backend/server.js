import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json())
app.use(cors())  // Allow all origins temporarily for debugging

// db connection
connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Food Delivery Backend API is running",
        endpoints: {
            auth: "/api/user",
            food: "/api/food",
            cart: "/api/cart",
            order: "/api/order"
        }
    });
})

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))