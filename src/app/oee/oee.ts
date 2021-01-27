export class Oee {
    oee:number;
}

export interface OeeGuage {
    overallpercentage: number;
    productionPercentage: number;
    availablityPercentage: number;
    qualityPercentage: number;
  }
   
export interface OeeSummary
{
        on_time: number;
        good_part: number;
        bad_part: number;
        total_production: number;
        production: number;
        ppm: number;
        actual_ppm:number;
        start_time: string;
        end_time: string;
        machine_name: string;
        type: string;
       
}


