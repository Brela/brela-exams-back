import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const CONFIG = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3001,
  MONGODB_CLUSTER_URL: process.env.MONGODB_CLUSTER_URL ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "JEST_JWT_SECRET",

  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",

  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL ?? "",
  NODEMAILER_IMAP_PASSWORD: process.env.NODEMAILER_IMAP_PASSWORD ?? "",
};

export default CONFIG;
