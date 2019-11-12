import { Bin } from "d3-array";

export default interface Region {
  name: string;
  timings: any[];
  health: any[];
  histogram: Bin<number, number>[];
}
