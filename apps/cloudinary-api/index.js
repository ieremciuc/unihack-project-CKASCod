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

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "CKASCod"
    });

    res.json({
      public_id: result.public_id,
      secure_url: result.secure_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Media API running on port ${PORT}`));
