export class Quality{
    on_time: number;
    good_part: number;
    bad_part: number;
    total_production:number;
    production: number;
    ppm: number;
    actual_ppm: number;
    overallpercentage: number;
    start_time:Date = new Date();
    end_time: Date = new Date();
    machine_name: string;
    type: string;
    productionPercentage: number;
    availablityPercentage: number;
    qualityPercentage: number;
    expectedProduction: number;
    mtbf: number;
    mttr: number;
}
   