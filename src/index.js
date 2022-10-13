const express = require("express");
const dotenv = require("dotenv");
const database = require("./config/database");
const routes = require("./routes/index.routes");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();
database();

app.use("/api/users", routes)

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000 🔥");
});
