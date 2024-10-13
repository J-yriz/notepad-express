import fs from "fs";
import path from "path";
import cors from "cors";
import config from "./config";
import express from "express";

const app = express();
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());

const routesPath = path.resolve(__dirname, "routes");
const routesFolder = fs.readdirSync(routesPath);

(async () => {
  for (const folder of routesFolder) {
    const routeFile = fs.readdirSync(`${routesPath}/${folder}`).filter((file) => file.endsWith(".js"));
    for (const file of routeFile) {
      const route = await import(`${routesPath}/${folder}/${file}`);
      app.use(`/`, route.default);
    }
  }
})();

app.listen(config.port, config.ip, () => {
  console.log(`Server is already Running http://${config.ip}:${config.port}`);
});
