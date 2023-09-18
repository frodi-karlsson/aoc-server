import { Driver } from "../driver/aoc-driver";
import { ProblemRequestParams, Route } from "../types";

const getInput: (driver: Driver) => Route<ProblemRequestParams> = (driver) =>
  new Route(
    {
      handler: async (req, res) => {
        const { year, day } = req.params;
        if (!year || !day) {
          res.status(400).send("Missing year or day");
          return;
        }
        const problem = `${year}-${day}` as const;
        const problemData = await driver.getInput(problem).catch((err) => {
          console.error(err);
          res.status(500).send(err.message);
        });
        res.send(problemData);
      },
      method: "get",
      path: "/getInput/:year/:day",
    },
    driver
  );

export default getInput;
