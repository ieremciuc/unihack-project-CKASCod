import express from "express"; // API framework
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import session from "express-session"; // client-side sessions
import bcrypt from "bcrypt"; // for password hashing
import fs from "fs";
import path from "path";

const countryCodesPath = path.resolve("./country-codes.json");
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

app.post("/p_users/register", async (req, res) => {
  try {
    const { username, email, password, profile_picture_link } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required!" });

    // Check if email or username already exists
    const { data: existingUser } = await supabase
      .from("p_users")
      .select("email, username")
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (existingUser)
      return res.status(400).json({ error: "Email or username already in use!" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data, error } = await supabase
      .from("p_users")
      .insert([{ username, email, password: hashedPassword, created_at: new Date(), profile_picture_link }])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Supabase API running on port ${PORT}`));