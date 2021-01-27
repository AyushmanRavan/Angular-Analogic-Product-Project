export interface Availability
{
  onTimeInMinutes: number;
  offTimeInMinutes: number;
  idleTimeInMinutes: number;
}

export interface Availability1 {
  planedBreaks: number;
  unPlanedBreaks: number;
}