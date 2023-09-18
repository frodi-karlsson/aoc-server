import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { Driver } from "../src/driver/aoc-driver";
import * as dotenv from "dotenv";
import { Problem } from "../src/types";

function isProblem(problem: string): problem is Problem {
    return /^\d+-\d+$/.test(problem);
}

describe("Driver", () => {
  let driver: Driver;
  let testProblem: Problem;
  beforeAll(() => {
    dotenv.config();
    const envTestProblem = process.env.TEST_PROBLEM;
    if (!envTestProblem || !isProblem(envTestProblem)) {
        testProblem = "2019-1" as const;
    } else {
        testProblem = envTestProblem;
    }
    return new Promise((resolve, reject) => {
      const sessionCookie = process.env.SESSION_COOKIE;
      if (!sessionCookie) throw new Error("Missing session cookie");
      driver = new Driver(sessionCookie);
      driver
        .setUpDriver()
        .then(() => {
          resolve(driver);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });

  afterAll(() => {
    return new Promise((resolve, reject) => {
        driver
            .close()
            .then(() => {
                resolve(void 0);
            })
            .catch((err) => {
                reject(err);
            });
    });
  });

  test("getInput", async () => {
    const input = await driver.getInput(testProblem);
    expect(input).toBeDefined();
  });

  test("getProblem", async () => {
    const result = await driver.get(testProblem);
    expect(result).toBeDefined();
  });

  test("getProblemData", async () => {
    const result = await driver.getProblemData(testProblem);
    expect(result).toBeDefined();
  });

//   test("submit", async () => { // de-activated because of submit limit
//     const result = await driver.submit(testProblem, "wrong");
//     console.log(result);
//     expect(result).toBe(false);
//   });

  test("test", async () => {
    const problemData = await driver.getProblemData(testProblem);
    const result = await driver.test(testProblem, 1, problemData[0].testSolution);
    expect(result).toBe(true);
  });
});
