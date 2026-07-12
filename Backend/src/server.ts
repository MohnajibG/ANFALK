import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`
====================================
🚀 ANFAL K API
====================================
Server : http://localhost:${env.PORT}
Status : Running
====================================
`);
  });
};

startServer();
