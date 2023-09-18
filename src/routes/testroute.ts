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
        if (isNaN(Number(year)) || isNaN(Number(day)) || isNaN(Number(part))) {
          res.status(400).send("Year, day, and part must be numbers");
          return;
        }
        const problem = `${Number(year)}-${Number(day)}` as const;
        const partNumber = Number(part);
        const problemData = await driver.test(problem, partNumber, solution);
        res.send(problemData);
      },
      method: "post",
      path: "/test/:year/:day/:part",
    },
    driver
  );

export default postTest;
