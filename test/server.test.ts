import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";

import * as dotenv from "dotenv";
import { Server } from "../src/server";
import { Driver } from "../src/driver/aoc-driver";
import get from "../src/routes/problemdescription";
import getIsUp from "../src/routes/isup";
import axios from "axios";
import { AOCParams, Problem, Route } from "../src/types";
import postTest from "../src/routes/testroute";

function isProblem(problem: string): problem is Problem {
  return /^\d+-\d+$/.test(problem);
}

describe("Server", () => {
  let server: Server;
  let driver: Driver;
  let testProblem: Problem;
  beforeAll(() => {
    return new Promise(async (resolve, reject) => {
      dotenv.config();
      const envTestProblem = process.env.TEST_PROBLEM;
      if (!envTestProblem || !isProblem(envTestProblem)) {
        testProblem = "2019-1" as const;
      } else {
        testProblem = envTestProblem;
      }
      server = new Server();
      const session = process.env.SESSION_COOKIE;
      if (!session) throw new Error("Missing session cookie");
      driver = new Driver(session);
      server.setRoutes([
        getIsUp(driver) as Route<AOCParams>,
        get(driver) as Route<AOCParams>,
        postTest(driver) as Route<AOCParams>,
      ]);
      await server.start();
      await driver.setUpDriver().catch((err) => {
        console.error(err);
        reject(err);
      });
      resolve(void 0);
    });
  }, 10000);

  afterAll(() => {
    driver.close();
    return server.stop();
  }, 10000);

  test("isup", async () => {
    const response = await axios.get("http://localhost:3000/isup");
    expect(response.status).toBe(200);
    expect(await response.data).toBe("ok");
  }, 10000);

  test("get", async () => {
    const [year, day] = testProblem.split("-").map((x) => parseInt(x));
    const response = await axios.get(`http://localhost:3000/getproblemdescription/${year}/${day}`).catch((err) => {
      console.log(err);
      return err.response;
    });
    expect(response.status).toBe(200);
    const text = await response.data;
    expect(text).toContain("Day 1");
  }, 10000);

  test("test", async () => {
    const [year, day] = testProblem.split("-").map((x) => parseInt(x));
    const part = 1;
    const solution = "test";
    const body = { year, day, part, solution };
    const response = await axios
      .post(`http://localhost:3000/test/${year}/${day}/${part}`, body)
      .catch((err) => {
        console.log(err);
        return err.response;
      });
    expect(response.status).toBe(200);
    const boolRes = await response.data;
    expect(boolRes).toBe(false);
  }, 10000);
});
