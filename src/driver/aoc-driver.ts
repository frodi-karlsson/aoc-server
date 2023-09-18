import { AoCDriver, Problem, ProblemData } from "../types";
import chromedriver from "chromedriver";
import {
  Builder,
  By,
  Capabilities,
  Locator,
  WebDriver,
  WebElement,
  until,
} from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

export class Driver implements AoCDriver {
  sessionCookie: string;
  driver: WebDriver | undefined;

  constructor(sessionCookie: string) {
    this.sessionCookie = sessionCookie;
  }

  async waitForElem(locator: Locator, timeout: number) {
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const el = await driver.findElement(locator);
    await driver.wait(until.elementIsVisible(el), timeout);
    if (!el) throw new Error("Element not found");
    return el;
  }

  async close() {
    await this.driver?.close();
    await this.driver?.quit();
    chromedriver.stop();
  }

  async setUpDriver() {
    const screen = {
      width: 640,
      height: 480,
    };

    chromedriver.start();
    this.driver = await new Builder()
      .forBrowser("chrome")
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(new chrome.Options().headless().windowSize(screen))
      .build();
    await this.navigateToUrl("https://adventofcode.com");
    await this.waitForElem({ tagName: "body" }, 10000);
  }

  async getParent(webElement: WebElement) {
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const parent = await driver
      .executeScript<WebElement>("return arguments[0].parentNode", webElement)
      .catch((err) => {
        console.error(
          "Failed to find parent for element",
          webElement,
          "with error",
          err
        );
        throw new Error("Failed to find parent");
      });
    return parent;
  }

  async getChildren(webElement: WebElement) {
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const children = webElement.findElements(By.xpath("./*")).catch((err) => {
      console.error(
        "Failed to find children for element",
        webElement,
        "with error",
        err
      );
      return [];
    });
    return children;
  }

  async findTestSolution(part: number) {
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const codes = await driver.findElements({ tagName: "code" }).catch(() => {
      return [];
    });
    const ems = (
      await Promise.all(
        codes.map(async (code) => {
          const em = await code.findElement({ tagName: "em" }).catch(() => {
            return undefined;
          });
          return em;
        })
      )
    ).filter((em) => em !== undefined) as WebElement[];
    if (ems.length === 0) return undefined;
    else if (ems.length === 1) return await ems[0].getText();
    else if (part === 1) return await ems[0].getText();
    else if (part === 2) return await ems[1].getText();
    else return undefined;
  }

  async navigateToInput(problem: Problem) {
    const [year, day] = problem.split("-").map(Number);
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    await this.navigateToUrl(url);
  }

  async getInput(problem: Problem) {
    await this.navigateToInput(problem);
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const pre = await driver.findElement({ tagName: "pre" });
    const input = await pre.getText();
    await this.navigateToProblem(problem);
    if (Array.isArray(input)) return input.join();
    return input;
  }

  async handleProblemOne(
    bothPres: string[][],
    problem: Problem
  ): Promise<ProblemData> {
    const pres = bothPres[0];
    let test: string | undefined;
    if (pres.length === 0)
      throw new Error("No pre elements found for problem one");
    if (pres.length === 1) {
      console.warn("Found more than one pre element for problem one");
      console.warn("Using first pre element");
      test = pres[0];
    }
    if (!test) throw new Error("No test found for problem one");
    const testSolution = await this.findTestSolution(1);
    if (!testSolution)
      throw new Error("No test solution found for problem one");
    const input = await this.getInput(problem);
    if (!input) throw new Error("No input found for problem one");
    return { test, testSolution, input };
  }

  async handleProblemTwo(
    bothPres: string[][],
    problem: Problem
  ): Promise<ProblemData | undefined> {
    console.log("handling problem two");
    console.log("pres found");
    let test: string;
    let pres: string[];
    if (bothPres.length === 1) {
      console.warn("Only one set of pre elements found");
      console.warn("Using pre elements for problem one");
      pres = bothPres[0];
      if (pres === undefined)
        throw new Error("No pre elements found for problem one");
      test = pres[0];
    } else if (bothPres.length === 2) {
      pres = bothPres[1];
      test = pres[0];
    } else {
      throw new Error(
        "More or less than two pre elements found :" + bothPres.length
      );
    }
    const testSolution = await this.findTestSolution(2);
    console.log("test solution found:", testSolution);
    const input = await this.getInput(problem);
    console.log("input found:", input);
    if (!test || !testSolution || !input) return undefined;
    return { test, testSolution, input };
  }

  async handleUnlockedProblemPres(
    pres: string[][],
    problem: Problem
  ): Promise<ProblemData[]> {
    const problemData: ProblemData[] = [];
    console.log("pres", pres);
    const problemOneData = await this.handleProblemOne(pres, problem);
    const problemTwoData = await this.handleProblemTwo(pres, problem);
    problemData.push(problemOneData);
    if (problemTwoData) problemData.push(problemTwoData);
    return problemData;
  }

  async getHeaders() {
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const headers = await driver.findElements({ tagName: "h2" });
    return headers;
  }

  async getUnlockedProblemPres(problem: Problem) {
    await this.navigateToProblem(problem);
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const headers = await this.getHeaders();
    const unlockedProblems = await Promise.all(
      headers.map(async (header) => {
        const parent = await this.getParent(header);
        const presChildren = await parent
          .findElements({ tagName: "pre" })
          .then(async (pres) => {
            return Promise.all(
              pres.map(async (pre) => {
                return await pre.getText().catch(() => {
                  return undefined;
                });
              })
            );
          })
          .catch(() => {
            return [];
          });
        return presChildren.filter((pre) => pre !== undefined) as string[];
      })
    );
    return unlockedProblems;
  }

  async getProblemData(problem: Problem) {
    await this.navigateToProblem(problem);
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const unlockedProblems = await this.getUnlockedProblemPres(problem);
    console.log("number of unlocked problems", unlockedProblems.length);
    const problemData = await this.handleUnlockedProblemPres(
      unlockedProblems.filter((problem) => problem.length > 0),
      problem
    );
    return problemData;
  }

  async navigateToUrl(url: string) {
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    driver.get(url);
    const cookies = await driver.manage().getCookies();
    if (cookies.length === 0) {
      const cookie = {
        name: "session",
        value: this.sessionCookie,
        domain: "adventofcode.com",
      };
      driver.manage().addCookie(cookie);
    }
    await this.waitForElem({ tagName: "body" }, 10000);
  }

  async navigateToProblem(problem: Problem) {
    console.log("navigating to problem", problem);
    const [year, day] = problem.split("-").map(Number);
    const url = `https://adventofcode.com/${year}/day/${day}`;
    await this.navigateToUrl(url);
  }

  async getSubmitStatus() {
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const status = await driver.findElement({ tagName: "p" });
    const statusText = await status.getText();
    if (statusText.includes("not the right answer")) {
      return false;
    } else if (statusText.includes("That's the right answer")) {
      return true;
    } else if (statusText.includes("You gave an answer too recently")) {
      return null;
    }
  }

  async submit(
    problem: Problem,
    part: number,
    solution: string
  ): Promise<{ result: boolean; message: string }> {
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    await this.navigateToProblem(problem);
    const unlocked = await this.getHeaders();
    if (part === 2 && unlocked.length === 1) {
      return { result: false, message: "Part 2 not unlocked" };
    } else if (part === 1 && unlocked.length === 2) {
      return { result: false, message: "Part 1 already solved" };
    } else {
      console.log("Part", part, "unlocked and not solved yet");
    }
    const input = await driver.findElement({ name: "answer" }).catch((err) => {
      return undefined;
    });
    if (!input) {
      return {
        result: false,
        message: "No input found. Maybe you already solved this problem?",
      };
    }
    await input.sendKeys(solution);
    const submit = await driver.findElement(
      By.xpath("//input[@type='submit']")
    );
    await submit.click();
    await this.waitForElem({ tagName: "p" }, 10000);
    const status = await this.getSubmitStatus();
    if (status === true) {
      console.log("Correct answer");
      return { result: true, message: "Correct answer" };
    } else if (status === false) {
      console.log("Incorrect answer");
      return { result: false, message: "Incorrect answer" };
    } else {
      console.log("Answer submitted too recently");
      return {
        result: false,
        message: "Answer submitted too recently",
      };
    }
  }

  async test(
    problem: Problem,
    part: number,
    solution: string
  ): Promise<{ result: boolean; message: string }> {
    await this.navigateToProblem(problem);
    const problemData = await this.getProblemData(problem);
    if (part === 2 && problemData.length === 1) {
      return { result: false, message: "Part 2 not unlocked" };
    }
    const { testSolution } = problemData[part - 1];
    if (solution === testSolution) {
      console.log("Test passed");
      return { result: true, message: "Test passed" };
    } else {
      console.log("Test failed");
      console.log(`Expected ${testSolution}, got ${solution}`);
      return {
        result: false,
        message: `Test failed, expected ${testSolution}, got ${solution}`,
      };
    }
  }

  async get(problem: Problem): Promise<string> {
    await this.navigateToProblem(problem);
    const driver = this.driver;
    if (!driver) throw new Error("Driver not initialized");
    const headers = await driver
      .findElements({ tagName: "h2" })
      .catch((err) => {
        console.error(err);
        throw new Error("Failed to find headers");
      });
    const allProblems = await Promise.all(
      headers.map(async (header) => {
        const parent = await this.getParent(header);
        const children = await this.getChildren(parent);
        const pres = Promise.all(
          children.map(async (child) => {
            const tagName = await child.getTagName();
            if (tagName !== "pre") {
              return child;
            }
          })
        );
        const elems = (await pres).filter(
          (pre) => pre !== undefined
        ) as WebElement[];
        let str = "";
        if (elems.length === 0) {
          throw new Error("No pre elements found");
        }
        for (const elem of elems) {
          str += (await elem.getText()) + "\n";
        }
        return str;
      })
    );
    if (allProblems.length === 1) {
      return allProblems[0];
    } else {
      return allProblems.join("\nProblem 2:\n");
    }
  }
}
