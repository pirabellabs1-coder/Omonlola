#!/usr/bin/env node
/* eslint-disable */
// Generates a fresh .env.local with strong random ADMIN_PATH, ADMIN_PASSWORD,
// and SESSION_SECRET. Existing values for ADMIN_USER are preserved when present.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ENV_PATH = path.join(process.cwd(), ".env.local");

function genSlug() {
  return crypto.randomBytes(8).toString("hex"); // 64 bits
}

function genPassword(length = 28) {
  const ALPHABET =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*+-=";
  return Array.from(crypto.randomBytes(length))
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");
}

function genSecret() {
  return crypto.randomBytes(32).toString("hex");
}

function readExisting() {
  try {
    return fs.readFileSync(ENV_PATH, "utf8");
  } catch {
    return "";
  }
}

function existing(env, key) {
  const m = env.match(new RegExp(`^${key}=(.*)$`, "m"));
  return m ? m[1] : null;
}

const prev = readExisting();
const adminUser = existing(prev, "ADMIN_USER") ?? "admin@omonlola.ai";

const slug = genSlug();
const pwd = genPassword();
const secret = genSecret();

const content = `# === ADMIN ACCESS — DO NOT COMMIT ===
ADMIN_PATH=${slug}
ADMIN_USER=${adminUser}
ADMIN_PASSWORD=${pwd}
SESSION_SECRET=${secret}
`;

fs.writeFileSync(ENV_PATH, content, "utf8");

console.log("===========================================");
console.log("  IDENTIFIANTS ADMIN GÉNÉRÉS");
console.log("===========================================");
console.log("URL local : http://localhost:3000/manage/" + slug);
console.log("Email     : " + adminUser);
console.log("Password  : " + pwd);
console.log("===========================================");
console.log("→ Sauvegardés dans .env.local (gitignored)");
console.log();
console.log("Pour le déploiement Vercel, copiez ces valeurs dans");
console.log("Project Settings → Environment Variables.");
