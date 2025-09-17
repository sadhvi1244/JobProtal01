import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

// initialize express
const app = express();

// connect to database
await connectDB();
await connectCloudinary();

// ✅ Clean CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://job-protal-site.vercel.app", // Best to use env var!
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight handler

app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("Hell0, Sadhvi Kesarwani");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// PORT
const PORT = process.env.PORT || 3001;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
