import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`
====================================
🚀 ANFAL K API
====================================
Server : http://0.0.0.0:${env.PORT}
Status : Running
====================================
`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
