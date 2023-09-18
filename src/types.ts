import { RequestHandler } from "express";

export type Problem = `${number}-${number}` | "latest";
export type Args = {
  sessionCookie?: string;
  problem?: Problem;
};

export interface ProblemRequestParams {
  year: string;
  day: string;
}

export interface ProblemRequestWithPartParams extends ProblemRequestParams {
  part: string;
}

export interface ProblemRequestBodyWithSolution {
  solution: string;
}

export type AOCParams = ProblemRequestParams | ProblemRequestWithPartParams;

export type ExpressRoute<
  Params extends ProblemRequestParams = ProblemRequestParams,
  Body extends void | ProblemRequestBodyWithSolution = void | ProblemRequestBodyWithSolution
> = {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
  handler: RequestHandler<Params, any, Body>;
};

export interface AoCDriver {
  submit(problem: Problem, part: number, solution: string): Promise<{ result: boolean; message: string }>;
  test(problem: Problem, part: number, solution: string): Promise<{ result: boolean; message: string }>;
  get(problem: Problem): Promise<string>;
}

export class Route<
  Params extends ProblemRequestParams = ProblemRequestParams,
  Body extends void | ProblemRequestBodyWithSolution = void | ProblemRequestBodyWithSolution
> {
  route: ExpressRoute<Params, Body>;
  driver: AoCDriver;
  constructor(route: ExpressRoute<Params, Body>, driver: AoCDriver) {
    this.route = route;
    this.driver = driver;
  }
}

export type ProblemData = {
  test: string;
  testSolution: string;
  input: string;
};
