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

// Log response headers for debugging
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      "🚀 Response Headers for",
      req.originalUrl,
      ":",
      res.getHeaders()
    );
  });
  next();
});

// connect to database and cloudinary
await connectDB();
await connectCloudinary();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://job-protal-site.vercel.app/", // use environment variable or fallback
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware()); // should come after JSON and CORS

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

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
