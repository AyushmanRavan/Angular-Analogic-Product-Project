import { Break } from "./break";

export interface Shift {
  shiftName?: string;
  shiftFrom?: string;
  shiftTo?: string;
  breaks: Break[];
}
