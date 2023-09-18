import { Route } from "./types";
import express from "express";
import { Server as HTTPServer } from "http";

export class Server {
    private routes: Route[];
    private server: HTTPServer | null = null;
    constructor() {
        this.routes = [];
    }

    public setRoutes(routes: Route[]) {
        this.routes = routes;
    }

    public async start() {
        return new Promise<void>((resolve) => {
            const app = express();
            app.use(express.json());
            app.use((req, res, next) => {
                req.params = Object.entries(req.params).reduce((acc, [key, value]) => {
                    return { ...acc, [key]: Number(value) };
                }, {});
                console.log("Received request", req.method, req.path, req.params, req.body);
                next();
            });
            for (const route of this.routes) {
                const expressRoute = route.route;
                app[expressRoute.method](expressRoute.path, expressRoute.handler);
            }
            const port = process.env.PORT ?? 3000;
            this.server = app.listen(port, () => {
                console.log(`AOC server listening on port ${port}`);
                resolve();
            });
        })
    }

    public async stop() {
        console.log("Stopping server...");
        return new Promise<void>((resolve, reject) => {
            this.server?.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }) ?? resolve();
        });
    }

}

