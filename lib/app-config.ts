import dotenv from "dotenv";

dotenv.config();

const config: {
  projectId: string;
  dataset: string;
  slug: string;
  TTL: number;
  port: string | number;
} = {
  projectId: process.env.PROJECT_ID || "",
  dataset: process.env.DATASET || "",
  slug: process.env.SLUG || "",
  TTL: process.env.TTL ? parseInt(process.env.TTL) : 60,
  port: process.env.PORT || 8888,
};

export default config;
