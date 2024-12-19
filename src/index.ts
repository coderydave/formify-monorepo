import express from "express";
import userRoutes from "./routes/userRoutes";
import { AppDataSource } from "./database";

const app = express();
app.use(express.json());

app.use("/users", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((error: unknown) =>
    console.error("Database connection error:", error)
  );
