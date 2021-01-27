export type Xaxis = {
  first: bar[];
  second: bar[];
  third: bar[];
};

type bar = {
  time: string;
  pos: {
    x: number;
    y?: number;
  };
};
