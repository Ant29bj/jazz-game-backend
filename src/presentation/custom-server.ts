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
      origin: [
        'https://jazz-guesser-git-main-ant29bjs-projects.vercel.app',
        'https://jazz-guesser.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080'
      ],
      methods: ['GET', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));

    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`server runing on port ${this.port}`)
    });
  }
}