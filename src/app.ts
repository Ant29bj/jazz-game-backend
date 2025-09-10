import { envs } from "./config/envs.js";
import { AppRoutes } from "./presentation/api/routes.js";
import { CustomServer } from "./presentation/custom-server.js";

(() => {
  main();
})();

async function main() {
  const { port } = envs;
  new CustomServer({
    port,
    routes: AppRoutes.getRoutes()
  })
    .start();
}