import { Chart } from "./chart";

export class LineChart extends Chart {
    public property: any;//
    public chartDataType: any;//
    public chartName: any;//
    public chartType: any;//
    public chartLabelColor: any;
    public sequenceNumber: any;
    public chartColor: any[];//
    public chartLabel: any[];//
    public chartData: any[];//
    public legend: boolean;

    constructor(data: any) {
        super(data.property);
        this.property = super.addChartOptions();

        if ((data.chartDataType == 'summary') && (data.chartType == 'line')) {
            this.legend = false;
        } else {
            this.legend = super.isLegend(data.property);
        }
        this.chartDataType = data.chartDataType;
        this.chartName = data.chartName;
        this.chartType = data.chartType;
        this.sequenceNumber = data.sequenceNumber;

        if (data.chartData.X[0].chartColor != undefined) {
            this.chartLabelColor = data.chartData.X[0].chartColor;
        }

        let labelColor_1 = [], chartColor_1 = [], LabelArray = [], DataSetArray = [];
        if (data.chartDataType == 'summary') {
            for (let labels of data.chartData.X) {
                labelColor_1.push(labels.chartColor);
            }
        } else {
            for (let labels of data.chartData.Y) {
                labelColor_1.push(labels.chartColor);
            }
        }

        for (let colors of labelColor_1) {
            let color = Object();
            if (data.chartType === 'line') {
                color.backgroundColor = "transparent";
                color.borderColor = colors;
            } else {
                color.backgroundColor = colors;
                color.borderColor = colors;
            }
            chartColor_1.push(color);
        }
        this.chartColor = chartColor_1;

        if (data.chartDataType == 'summary') {
            if (data.chartType == 'line') {
                let lineChartData = [];
                for (let key of data.chartData.X) {
                    for (let labels of Object.keys(data.reportData)) {
                        if (data.reportData[labels].headers == key.columnName) {
                            lineChartData.push(data.reportData[labels].value);
                            LabelArray.push(key.labelName);
                            break;
                        }
                    }
                }

                let datasetObject = Object();
                datasetObject.data = lineChartData.map(e => e);
                datasetObject.label = 'calculation';
                DataSetArray.push(datasetObject);
            } else {
                for (let key of data.chartData.X) {
                    let datasetObject = Object();
                    datasetObject.data = [];
                    for (let labels of Object.keys(data.reportData)) {
                        if (data.reportData[labels].headers == key.columnName) {
                            datasetObject.data.push(data.reportData[labels].value);
                            datasetObject.label = key.labelName;
                            LabelArray.push(key.labelName);
                            break;
                        }
                    }
                    DataSetArray.push(datasetObject);
                }
            }
        } else {
            for (let labels of Object.keys(data.reportData)) {
                LabelArray.push(data.reportData[labels].EndTime);
            }

            this.chartLabel = LabelArray.map(e => e);
            for (let key of data.chartData.Y) {
                let datasetObject = Object();
                datasetObject.data = [];
                datasetObject.label = key.labelName;
                let columnName = key.columnName;
                for (let labels of Object.keys(data.reportData)) {
                    for (let rowdata of Object.keys(data.reportData[labels])) {
                        if (columnName == rowdata) {
                            datasetObject.data.push(data.reportData[labels][columnName]);
                        }
                    }
                }
                DataSetArray.push(datasetObject);
            }
        }

        this.chartData = DataSetArray.map(e => e);
        this.chartLabel = LabelArray.map(e => e);
    }
}
