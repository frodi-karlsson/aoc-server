import { Driver } from "../driver/aoc-driver";
import { ProblemRequestParams, Route } from "../types";

const getProblemData: (driver: Driver) => Route<ProblemRequestParams> = (driver) =>
  new Route(
    {
      handler: async (req, res) => {
        const { year, day } = req.params;
        if (!year || !day) {
          res.status(400).send("Missing year or day");
          return;
        }
        const problem = `${year}-${day}` as const;
        const problemData = await driver.getProblemData(problem);
        res.send(problemData);
      },
      method: "get",
      path: "/problemdata/:year/:day",
    },
    driver
  );

export default getProblemData;
