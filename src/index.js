const express = require("express");
const routerApp = require("./routes");

const app = express();
const PORT = process.env.APP_PORT || 9001;

app.use(express.json());
app.use(routerApp);
app.listen(PORT, () =>
  console.log(`Aplicativo rodadando em http://localhost:${PORT}`)
);
