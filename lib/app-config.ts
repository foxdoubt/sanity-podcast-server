import dotenv from "dotenv";

dotenv.config();

const config: {
  projectId: string;
  dataset: string;
  slug: string;
  npmPackageVersion: string;
  TTL: number;
} = {
  projectId: process.env.PROJECT_ID || "",
  dataset: process.env.DATASET || "",
  slug: process.env.SLUG || "",
  npmPackageVersion: process.env.npm_package_version || "",
  TTL: process.env.TTL ? parseInt(process.env.TTL) : 60,
};

export default config;
