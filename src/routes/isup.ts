import { Driver } from "../driver/aoc-driver";
import { ExpressRoute, Route } from "../types";

const isup: ExpressRoute = {
    method: "get",
    path: "/isup",
    handler: (_, res) => {
        res.send("ok");
    },
};

export const getIsUp = (driver: Driver) => new Route(isup, driver);

export default getIsUp;
