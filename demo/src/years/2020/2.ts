import { SolverPart } from "../../solver";

export class PartOne extends SolverPart {
    async run(input: string): Promise<string | null> {
      const lines = input.split("\n");
      return lines
        .map((x) => x.trim())
        .filter((x) => x.length > 0)
        .map((x) => x.split(": "))
        .map(([policy, password]) => {
          const [range, letter] = policy.split(" ");
          const [min, max] = range.split("-").map((x) => parseInt(x));
          const count = password.split("").filter((x) => x === letter).length;
          return count >= min && count <= max;
        })
        .filter((x) => x).length.toString();
    }
  }

  export class PartTwo extends SolverPart {
    async run(input: string): Promise<string | null> {
      const lines = input.split("\n");
      return lines
        .map((x) => x.trim())
        .filter((x) => x.length > 0)
        .map((x) => x.split(": "))
        .map(([policy, password]) => {
          const [range, letter] = policy.split(" ");
          const [first, second] = range.split("-").map((x) => parseInt(x));
          return (password[first - 1] === letter) !== (password[second - 1] === letter);
        })
        .filter((x) => x).length.toString();
    }
  }
