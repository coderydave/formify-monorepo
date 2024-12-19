import express from "express";
import userRoutes from "./routes/userRoutes";
import { AppDataSource } from "./database";

//Swagger imports
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger";

const app = express();

app.use(express.json());

// Swagger dokumentáció végpont
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API útvonalak
app.use("/users", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((error: unknown) =>
    console.error("Database connection error:", error)
  );
