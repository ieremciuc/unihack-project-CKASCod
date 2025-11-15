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

app.post("/p_users/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password)
      return res.status(400).json({ error: "Missing credentials" });

    // Try to find user by email OR username
    const { data: user, error } = await supabase
      .from("p_users")
      .select("*")
      .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
      .single();

    if (error || !user)
      return res.status(400).json({ error: "User not found" });

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid password" });

    req.session.userId = user.user_id;
    console.log("Session created:", req.session);
    
    if (!req.session.userId) {
      return res.status(401).json({ loggedIn: false });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/p_users/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ loggedIn: false });
  }
  res.json({ loggedIn: true, userId: req.session.userId });
});

app.post("/p_users/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

async function getBasicUserInfoUsername(username) {
  if (!username) throw new Error("Missing username");

  const { data, error } = await supabase
    .from("p_users")
    .select("user_id, profile_picture")
    .eq("username", user_id)
    .single();

  if (error) throw error;
  return data;
}

async function getBasicUserInfoId(user_id) {
  if (!user_id) throw new Error("Missing user_id");

  const { data, error } = await supabase
    .from("p_users")
    .select("username, profile_picture")
    .eq("user_id", user_id)
    .single();

  if (error) throw error;
  return data;
}

app.get("/p_users/id/:id/basic", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getBasicUserInfoId(id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/p_users/username/:id/basic", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await getBasicUserInfoUsername(username);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const {
      country_name,
      title,
      content,
      image,
      is_event,
      event_date
    } = req.body;
    if (!req.session.userId) {
      return res.status(401).json({ error: "User is not logged in!" });
    }
    const user_id = req.session.userId;

    if (!is_event) {
      if (!content)
        return res.status(400).json({ error: "Content is required!" });

      let country_code = null;
      if (country_name) {
        country_code = countryCodes[country_name];
        if (!country_code) {
          return res.status(400).json({ error: `Invalid country name: ${country_name}!` });
        }
      }

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            country_name,
            country_code,
            user_id,
            content,
            image,
            is_event
          }
        ])
        .select()
        .single();

      if (error) throw error;

      res.json({ message: "Post created successfully!", post: data });
    } else {
      if (!content || !title)
        return res.status(400).json({ error: "Content and title are required!" });

      let country_code = null;
      if (country_name) {
        country_code = countryCodes[country_name];
        if (!country_code) {
          return res.status(400).json({ error: `Invalid country name: ${country_name}!` });
        }
      }

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            country_name,
            country_code,
            user_id,
            content,
            image,
            is_event,
            event_date,
            title
          }
        ])
        .select()
        .single();

      if (error) throw error;

      res.json({ message: "Event created successfully!", post: data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("posts")
      .select("post_id, created_at, event_date, like_count, dislike_count, country_name, user_id, title, content, image, is_event")
      .eq("post_id", id)
      .single();
  
    if (error || !data)
      return res.status(404).json({ error: "Post not found" });
  
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
app.listen(PORT, () => console.log(`Supabase API running on port ${PORT}`));