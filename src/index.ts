import { AOCParams, Route } from "./types";
import * as dotenv from "dotenv";
import { Server } from "./server";
import getIsUp from "./routes/isup";
import { Driver } from "./driver/aoc-driver";
import postSubmit from "./routes/submit";
import getProblemData from "./routes/problemdata";
import postTest from "./routes/testroute";
import getInput from "./routes/getInput";
import get from "./routes/get";

dotenv.config();

const sessionCookie = process.env.SESSION_COOKIE;

if (!sessionCookie) throw new Error("Missing session cookie");

const driver = new Driver(sessionCookie);

const routes: Route[] = [
    getIsUp(driver) as Route<AOCParams>,
    postSubmit(driver) as Route<AOCParams>,
    getProblemData(driver) as Route<AOCParams>,
    get(driver) as Route<AOCParams>,
    postTest(driver) as Route<AOCParams>,
    getInput(driver) as Route<AOCParams>,
];

const server = new Server();
server.setRoutes(routes);
server.start();
