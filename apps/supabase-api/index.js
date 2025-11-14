import express from "express"; // API framework
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import session from "express-session"; // client-side sessions
import bcrypt from "bcrypt"; // for password hashing
import fs from "fs";
import path from "path";

const countryCodesPath = path.resolve("./countryCodes.json");
const countryCodes = JSON.parse(fs.readFileSync(countryCodesPath, "utf-8"));

dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.use(cors({
  origin: "https://ieremciuc.github.io",
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60
  }
}));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Supabase API running on port ${PORT}`));