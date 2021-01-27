export interface Product {
  startDate?: string;
  endDate?: string;
  averagePerHrsProduction: number;
  perHrsTotalProduction: number;
  perHrsGoodProduction: number;
  perHrsRejectProduction: number;
}

export interface Alarm {
  alarmName: string;
  alarmIntime: string;
  alarmOntime: string;
  dateTime?: string;
}

export interface Machine {
  start_time: string;
  end_time: string;
  status?: string;
  datedifference: number;
  machine_name?: string;
  reason: string;
}

export interface Utility {
  startTime: string;
  endTime: string;
}

export class Report {
  plant: string = 'Mumbai';
  department: string = 'Production';
  machine: string = 'Pakona 58 Head 1';
  interval: number;
  type: string = 'production';
  from: string;
  to: string;

  constructor(from) {
    this.from = from;
  }

}


export class AssemblyReport {
  plant: string = 'Mumbai';
  department: string = 'Production';
  machine: string = 'Pakona 58 Head 1';
  type: string = 'ShiftWise';
  from: string;
  to: string;
  shift: string;

  constructor(from) {
    this.from = from;
  }

}
