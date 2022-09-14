const express = require("express");
const routerApp = require("./routes");
const cors = require("cors");

const app = express();
const PORT = process.env.APP_PORT || 9001;

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routerApp);
app.listen(PORT, () =>
  console.log(`Aplicativo rodadando em http://localhost:${PORT}`)
);
