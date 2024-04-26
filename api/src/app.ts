import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "swagger_output.json";
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Ping route
app.get("/api/ping", (_req, res) => {
  return res.status(200).send("🏓 Pong!");
});

// Routes
import authRoutes from "@routes/auth.routes";
import userRoutes from "@routes/user.routes";
import salonRoutes from "@routes/salon.routes";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/salons", salonRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
