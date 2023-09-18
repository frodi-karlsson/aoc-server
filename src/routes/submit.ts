import { ProblemRequestBodyWithSolution, ProblemRequestParams, Route } from "../types";
import { Driver } from "../driver/aoc-driver";

const postSubmit = (driver: Driver): Route<ProblemRequestParams, ProblemRequestBodyWithSolution> =>
  new Route(
    {
      method: "post",
      path: "/submit/:year/:day",
      handler: async (req, res) => {
        const { year, day } = req.params;
        const { solution } = req.body;
        if (!solution || !year || !day) {
          res.status(400).send("Missing solution, year, or day");
          return;
        }
        const problem = `${year}-${day}` as const;
        const sessionCookie = req.headers["session-cookie"] as
          | string
          | undefined;

        if (!sessionCookie) {
          res.status(400).send("Missing session cookie");
          return;
        }

        driver.submit(problem, solution).then((result) => {
          res.status(200).send(result);
        });
      },
    },
    driver
  );

export default postSubmit;
