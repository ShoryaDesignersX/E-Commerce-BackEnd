import express from "express";
import cors from 'cors'

const app = express();
const port = 3000;
import { router } from "./Routes/UserRoute.js";
import "dotenv/config";
import { Productrouter } from "./Routes/ProductRoute.js";

app.use(cors())
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
// User
app.use("/user", router);

// Product
app.use("/product", Productrouter);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
