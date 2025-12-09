import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URIR;
    console.log("MONGO_URI:", uri);

    await mongoose.connect(uri);  // ⬅️ बस इतना ही चाहिए

    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed:", error);
  }
};

export default connectDB;
