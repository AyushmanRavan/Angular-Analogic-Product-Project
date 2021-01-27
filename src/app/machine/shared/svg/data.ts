import { Xaxis } from "./xaxis";

export var xAxis = {
  values: (width: number, hours: number = 8) => {
    return {
      first: _getHours(width, hours),
      second: _getHours(width, hours, 8),
      third: _getHours(width, hours, 16)
    };
  }
};

function _getHours(w, n, init = 0) {
  let per = w / n;
  return Array.from(new Array(n), (x, i) => {
    return {
      time: `${i + init}:00`,
      pos: {
        x: i * per,
        y: 100
      }
    };
  });
}
