// import mongoose from "mongoose";

// export const connectDB = async () =>{
//     await mongoose.connect('').then(()=>console.log("DB Connected"));
// }



import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://viveklokannavar5058:123456viv@cluster0.6sdhs.mongodb.net/restMenu', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Connected Successfully");
    } catch (error) {
        console.error("DB Connection Error: ", error);
        process.exit(1); // Exit process with failure
    }
};
