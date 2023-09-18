export abstract class SolverPart {
  protected input;
  protected testInput;
  protected testSolution;

  constructor(problemData: { input: string; test: string; testSolution: string }) {
    this.input = problemData.input;
    this.testInput = problemData.test;
    this.testSolution = problemData.testSolution;
  }

  abstract run(input: string): Promise<string | null>;
  public async test(
    expectedResults?: string | null
  ): Promise<{ result: boolean; message: string }> {
    const solution = await this.run(this.testInput);
    if (solution === null) {
      return {
        result: false,
        message: "No solution",
      };
    }
    const expectedResultsExist =
      expectedResults !== undefined && expectedResults !== null;
    let correct = false;
    if (expectedResultsExist) {
      correct = solution === expectedResults.toString();
    } else {
      correct = solution === this.testSolution;
    }

    return {
      result: correct,
      message: `Expected: ${
        expectedResultsExist ? expectedResults : this.testSolution
      }, got: ${solution}`,
    };
  }

  public async solve(): Promise<{ result: boolean; message: string }> {
    const solution = await this.run(this.input);
    if (solution === null) {
      return {
        result: false,
        message: "No solution",
      };
    }
    return {
      result: true,
      message: solution,
    };
  }
}

export class Solver {
  constructor(private parts: SolverPart[]) {}

  public async test(
    expectedResults?: (string | null | undefined)[]
  ): Promise<{ result: boolean; message: string }[]> {
    return Promise.all(
      this.parts.map(async (x, i) => x.test(expectedResults?.[i]))
    );
  }

  public async solve(): Promise<{ result: boolean; message: string }[]> {
    return Promise.all(this.parts.map(async (x) => x.solve()));
  }
}
