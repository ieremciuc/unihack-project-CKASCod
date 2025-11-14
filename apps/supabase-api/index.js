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