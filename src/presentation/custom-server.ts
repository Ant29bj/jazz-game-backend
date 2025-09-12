import express, { type Application, Router } from "express";
import cors from 'cors';
interface Options {
  port?: number;
  routes: Router;
}

export class CustomServer {

  private readonly app: Application = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor (options: Options) {
    const { port = 300, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {

    this.app.use(cors({
      origin: '*',
      methods: ['GET']
    }));

    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`server runing on port ${this.port}`)
    });
  }
}