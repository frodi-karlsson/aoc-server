import { Driver } from "../driver/aoc-driver";
import { ProblemRequestBodyWithSolution, ProblemRequestWithPartParams, Route } from "../types";

const postTest: (driver: Driver) => Route<ProblemRequestWithPartParams, ProblemRequestBodyWithSolution> = (driver) =>
  new Route(
    {
      handler: async (req, res) => {
        const { year, day, part } = req.params;
        console.log(year, day, part);
        const { solution } = req.body;
        if (!year || !day || !part || !solution) {
          res.status(400).send("Missing year, day, part, or solution");
          return;
        }
        const problem = `${year}-${day}` as const;
        const problemData = await driver.test(problem, part, solution);
        res.send(problemData);
      },
      method: "post",
      path: "/test/:year/:day/:part",
    },
    driver
  );

export default postTest;
