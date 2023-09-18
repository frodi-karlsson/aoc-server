import { Driver } from "../driver/aoc-driver";
import { ProblemRequestParams, Route } from "../types";

const get: (driver: Driver) => Route<ProblemRequestParams> = (driver) =>
  new Route(
    {
      handler: async (req, res) => {
        const { year, day } = req.params;
        if (!year || !day) {
          res.status(400).send("Missing year or day");
          return;
        }
        if (isNaN(Number(year)) || isNaN(Number(day))) {
          res.status(400).send("Year and day must be numbers");
          return;
        }
        const problem = `${Number(year)}-${Number(day)}` as const;
        const problemData = await driver.get(problem).catch((err) => {
            res.status(500).send(err.message);
        });
        console.log(problemData);
        res.send(problemData);
      },
      method: "get",
      path: "/get/:year/:day",
    },
    driver
  );

export default get;
