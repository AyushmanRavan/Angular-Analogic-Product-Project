import { Chart } from "./chart";

export class PieChart extends Chart {
    public property: any;//
    public chartDataType: any;
    public chartName: any;
    public chartType: any;//
    public sequenceNumber: any;
    public chartColor: any[];//
    public chartLabel: any[];//
    public chartData: any[];//
    public legend: boolean;

    constructor(data: any) {
        super(data.property);
        this.property = super.addChartOptions();
        this.legend = super.isLegend(data.property);
        this.chartDataType = data.chartDataType;
        this.chartName = data.chartName;
        this.chartType = data.chartType;
        this.sequenceNumber = data.sequenceNumber;
        let colors = [], chartLabel_1 = [], chartData_1 = [];

        for (let yParameter of data.chartData.Y) {

            for (let graphData of Object.keys(data.reportData)) {

                if (data.reportData[graphData].headers === yParameter.columnName) {

                    colors.push(yParameter.chartColor)
                    chartLabel_1.push(yParameter.labelName)
                    chartData_1.push(parseInt(data.reportData[graphData].value, 10))
                    break;

                }
            }
        }
        this.chartData = chartData_1;
        this.chartLabel = chartLabel_1;
        // this.chartColor['backgroundColor'] = colors;
        this.chartColor = [{ backgroundColor: colors }];

    }

}
