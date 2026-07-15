import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async () => {
  try {
    /*
      IMPORTANT:
      On démarre Express avant MongoDB.
      Northflank doit voir le port ouvert.
    */

    app.listen(env.PORT, "0.0.0.0", async () => {
      console.log(`
====================================
🚀 ANFAL K API
====================================
Server : http://0.0.0.0:${env.PORT}
Status : Running
====================================
`);

      try {
        await connectDB();
      } catch (error) {
        console.error("❌ Database initialization failed");

        console.error(error);

        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Server startup failed");

    console.error(error);

    process.exit(1);
  }
};

startServer();
