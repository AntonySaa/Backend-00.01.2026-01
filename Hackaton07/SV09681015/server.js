import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api", apiRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("API Gateway ejecutándose en puerto " + PORT);

});



