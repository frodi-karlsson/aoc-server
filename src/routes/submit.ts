import { ProblemRequestBodyWithSolution, ProblemRequestWithPartParams, Route } from "../types";
import { Driver } from "../driver/aoc-driver";

const postSubmit = (driver: Driver): Route<ProblemRequestWithPartParams, ProblemRequestBodyWithSolution> =>
  new Route(
    {
      method: "post",
      path: "/submit/:year/:day/:part",
      handler: async (req, res) => {
        const { year, day, part } = req.params;
        const { solution } = req.body;
        if (!solution || !year || !day || !part) {
          res.status(400).send("Missing solution, year, day, or part");
          return;
        }
        if (isNaN(Number(year)) || isNaN(Number(day)) || isNaN(Number(part))) {
          res.status(400).send("Year, day, and part must be numbers");
          return;
        }
        const problem = `${Number(year)}-${Number(day)}` as const;
        const partNumber = Number(part);

        driver.submit(problem, partNumber, solution).then((result) => {
          res.status(200).send(result);
        });
      },
    },
    driver
  );

export default postSubmit;
