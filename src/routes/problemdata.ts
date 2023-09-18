import { Driver } from "../driver/aoc-driver";
import { ProblemRequestParams, Route } from "../types";

const getProblemData: (driver: Driver) => Route<ProblemRequestParams> = (driver) =>
  new Route(
    {
      handler: async (req, res) => {
        const { year, day } = req.params;
        if (isNaN(Number(year)) || isNaN(Number(day))) {
          res.status(400).send("Year and day must be numbers");
          return;
        }
        const problem = `${Number(year)}-${Number(day)}` as const;
        const problemData = await driver.getProblemData(problem);
        res.send(problemData);
      },
      method: "get",
      path: "/problemdata/:year/:day",
    },
    driver
  );

export default getProblemData;
