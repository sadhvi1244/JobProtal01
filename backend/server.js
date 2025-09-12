// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import * as Sentry from "@sentry/node";

const app = express();

await connectDB();
await connectCloudinary();

app.use(clerkMiddleware());
app.use(
  cors({
    origin: "https://job-protal01.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Sadhvi Kesarwani");
});

app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

Sentry.setupExpressErrorHandler(app);

export default app; // 👈 instead of app.listen
