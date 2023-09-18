import axios from "axios";

export class APIClient {
  private static serverUrl = "http://localhost:3000";

  constructor(private year: number, private day: number) {}

  private static test(
    year: number,
    day: number,
    part: number,
    solution: string
  ) {
    const url = `${this.serverUrl}/test/${year}/${day}/${part}`;
    const data = {
      solution,
    };
    return axios.post(url, data);
  }

  private static submit(
    year: number,
    day: number,
    part: number,
    solution: string
  ) {
    const url = `${this.serverUrl}/submit/${year}/${day}/${part}`;
    const data = {
      solution,
    };
    return axios.post(url, data);
  }

  private static getProblemDescription(year: number, day: number) {
    const url = `${this.serverUrl}/getproblemdescription/${year}/${day}`;
    return axios.get(url);
  }

  private static getProblemData(year: number, day: number) {
    const url = `${this.serverUrl}/problemdata/${year}/${day}`;
    return axios.get(url);
  }

  public test(part: number, solution: string) {
    return APIClient.test(this.year, this.day, part, solution);
  }

  public submit(part: number, solution: string) {
    return APIClient.submit(this.year, this.day, part, solution);
  }

  public getProblemDescription() {
    return APIClient.getProblemDescription(this.year, this.day);
  }

  public getProblemData() {
    return APIClient.getProblemData(this.year, this.day);
  }
}
