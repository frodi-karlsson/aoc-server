import { AOCParams, Route } from "./src/types";
import * as dotenv from "dotenv";
import { Server } from "./src/server";
import getIsUp from "./src/routes/isup";
import { Driver } from "./src/driver/aoc-driver";
import postSubmit from "./src/routes/submit";
import getProblemData from "./src/routes/problemdata";
import postTest from "./src/routes/testroute";
import getInput from "./src/routes/getInput";
import getProblemDescription from "./src/routes/problemdescription";

dotenv.config();

const sessionCookie = process.env.SESSION_COOKIE;

if (!sessionCookie) throw new Error("Missing session cookie");

const driver = new Driver(sessionCookie);

async function main() {
    await driver.setUpDriver();

    const routes: Route[] = [
        getIsUp(driver) as Route<AOCParams>,
        postSubmit(driver) as Route<AOCParams>,
        getProblemData(driver) as Route<AOCParams>,
        getProblemDescription(driver) as Route<AOCParams>,
        postTest(driver) as Route<AOCParams>,
        getInput(driver) as Route<AOCParams>,
    ];

    const server = new Server();
    server.setRoutes(routes);
    server.start();
}

main();

