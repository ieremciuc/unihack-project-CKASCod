import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import cors from "cors";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;

const app = express();
app.use(cors({
  origin: "https://ieremciuc.github.io"
}));

app.use(express.json());

const upload = multer({ dest: "uploads/" });
