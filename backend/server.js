import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   console.log("Headers:", JSON.stringify(req.headers, null, 2));

//   let data = "";
//   req.on("data", (chunk) => {
//     data += chunk;
//   });

//   req.on("end", () => {
//     console.log("Raw Request Body:", data); // Check if raw data is received
//   });

//   next();
// });

app.use(userRoutes);
app.use(postRoutes);
app.use(express.static("uploads"));

const start = async () => {
  const connectDB = await mongoose.connect(
    "mongodb+srv://linkmani:linkedMani0107@profconnections.svwrs.mongodb.net/?retryWrites=true&w=majority&appName=profconnections"
  );

  app.listen(9090, () => {
    console.log("listening on port 9090");
  });
};

start();
