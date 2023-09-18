import * as fs from "fs";
import { APIClient } from "./src/api-client";
import { Solver } from "./src/solver";
import { PartOne, PartTwo } from "./src/years/2020/2";

const year = 2020;
const day = 2;

type ProblemData = {
  test: string;
  testSolution: string;
  input: string;
};

async function main() {
  const apiClient = new APIClient(year, day);
  const problemDescription = await apiClient.getProblemDescription();
  fs.writeFileSync("problem-description.txt", problemDescription.data);
  const problemData: ProblemData[] = (await apiClient.getProblemData()).data;

  const solver = new Solver([
    new PartOne(problemData[0]),
    new PartTwo(problemData[1]),
  ]);
  const testResults = await solver.test([null, "1"]);
  const solutionResults = await solver.solve();
  console.log(testResults);
  await Promise.all(
    testResults.map(async (x, i) => {
      if (x.result) {
        console.log("Test passed: ", x.message);
        if (solutionResults[i].result) {
          console.log("Solution: ", solutionResults[i].message);
          const submitRes = await apiClient.submit(
            i + 1,
            solutionResults[i].message
          );
          const submitResData = submitRes.data;
          if (submitResData.result) {
            console.log(
              "Submitted successfully, result: ",
              submitResData.message
            );
          } else {
            console.log("Submission failed: ", submitResData.message);
          }
        }
      } else {
        console.log("Test failed: ", x.message);
      }
    })
  );
}

main().catch((err) => {
  console.error(err);
});
