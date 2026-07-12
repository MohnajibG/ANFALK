import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";

const app = express();

/* Middlewares */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* Routes */

app.use("/api/auth", authRoutes);

/* Test Route */

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "ANFAL K API Running",
  });
});

export default app;
