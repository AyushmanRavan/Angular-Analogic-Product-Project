import { Chart } from "./chart";

export class GuageChart extends Chart {
    public property: any;
    public chartDataType: any;
    public chartName: any;
    public chartType: any;
    public sequenceNumber: any;
    public chartColor: any[];
    public chartLabel: any[];
    public value: any;
    public compareProperty: any;

    constructor(data: any) {
        super(data.property);
        this.property = super.addChartOptions();
        this.chartDataType = data.chartDataType;
        this.chartName = data.chartName;
        this.chartType = data.chartType;
        this.sequenceNumber = data.sequenceNumber;

        let colors = [], chartData_1 = [];
        if (data.chartData.Y.length != 0) {
            for (let key of Object.keys(data.reportData)) {
                for (let search of data.chartData.Y) {
                    if (data.reportData[key].headers === search.columnName) {
                        if (search.chartColor) {
                            colors.push(search.chartColor);
                        }
                        chartData_1.push(search.labelName);
                        this.value = data.reportData[key].value;
                    }
                }
            }
        }

        this.chartColor = colors;
        this.chartLabel = chartData_1;

        this.compareProperty = {
            type: "semi", label: "Speed", append: "km/hr", min: 0, max: 100, cap: 'round',
            thick: 15, size: 200
        }
    }

}
