import dotenv from "dotenv";

dotenv.config();

const config: {
  projectId: string;
  dataset: string;
  slug: string;
  TTL: number;
  port: string | number;
  currentAPIVersion: string;
} = {
  projectId: process.env.PROJECT_ID || "",
  dataset: process.env.DATASET || "",
  slug: process.env.SLUG || "",
  TTL: process.env.TTL ? parseInt(process.env.TTL) : 60,
  port: process.env.PORT || 8888,
  currentAPIVersion: process.env.CURRENT_API_VERSION || "2025-01-30",
};

export default config;
