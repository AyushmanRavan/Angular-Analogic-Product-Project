export class Chart {

    property: string;

    constructor(property: string) {
        this.property = property;
    }

    isLegend(property): boolean {
        if (!!property) {
            let details = JSON.parse(property);
            for (var key in details) {
                var fields = key.split('_');
                if (fields[0] === "display" && fields[1] === "legend") {
                    return details[key];
                }
            }
        }
        return false;
    }

    addChartOptions() {
        if (!!this.property) {
            let PieChartOptions = {}, legend = {}, elements = {}, legendLabel = {},
                layout = {}, title = {}, animation = {}, tooltips = {},
                elementsPoint = {}, elementsLine = {}, elementsRectangle = {}, elementsArc = {};
            let details = JSON.parse(this.property);
            for (var key in details) {
                var fields = key.split('_');
                if (fields[0] === "display" && fields[1] === "legend") {
                    continue;
                }

                switch (fields[1]) {
                    case 'legend':
                        legend[fields[0]] = details[key];
                        break;
                    case 'legendLabel':
                        legendLabel[fields[0]] = details[key];
                        break;
                    case 'layout':
                        layout[fields[0]] = details[key];
                        break;
                    case 'title':
                        title[fields[0]] = details[key];
                        break;
                    case 'animation':
                        animation[fields[0]] = details[key];
                        break;
                    case 'toolTip':
                        tooltips[fields[0]] = details[key];
                        break;

                    case 'elementsPoint':
                        elementsPoint[fields[0]] = details[key];
                        break;

                    case 'elementsLine':
                        elementsLine[fields[0]] = details[key];
                        break;

                    case 'elementsRectangle':
                        elementsRectangle[fields[0]] = details[key];
                        break;

                    case 'elementsArc':
                        elementsArc[fields[0]] = details[key];
                        break;
                }
            }

            // if (!this.isEmptyObject(legendLabel)) {
            //     legend["labels"] = { ...legendLabel };
            // }
            legend = this.copyObjectData(legend, legendLabel, "labels");

            // if (!this.isEmptyObject(layout)) {
            //     legend["layout"] = { ...layout };
            // }
            legend = this.copyObjectData(legend, layout, "layout");

            // if (!this.isEmptyObject(title)) {
            //     legend["title"] = { ...title };
            // }
            legend = this.copyObjectData(legend, title, "title");

            // if (!this.isEmptyObject(animation)) {
            //     legend["animation"] = { ...animation };
            // }
            legend = this.copyObjectData(legend, animation, "animation");

            // if (!this.isEmptyObject(tooltips)) {
            //     legend["tooltips"] = { ...tooltips };
            // }
            legend = this.copyObjectData(legend, tooltips, "tooltips");


            ////////////////////
            // if (!this.isEmptyObject(elementsArc)) {
            //     legend["arc"] = { ...elementsArc };
            // }
            elements = this.copyObjectData(elements, elementsArc, "arc");

            // if (!this.isEmptyObject(elementsRectangle)) {
            //     legend["rectangle"] = { ...elementsRectangle };
            // }
            elements = this.copyObjectData(elements, elementsRectangle, "rectangle");

            // if (!this.isEmptyObject(elementsLine)) {
            //     legend["line"] = { ...elementsLine };
            // }
            elements = this.copyObjectData(elements, elementsLine, "line");

            // if (!this.isEmptyObject(elementsPoint)) {
            //     legend["point"] = { ...elementsPoint };
            // }
            elements = this.copyObjectData(elements, elementsPoint, "point");

            // if (!this.isEmptyObject(elements)) {
            //     legend["elements"] = { ...elements };
            // }
            legend = this.copyObjectData(legend, elements, "elements");

            // if (!this.isEmptyObject(legend)) {
            //     PieChartOptions["legend"] = { ...legend };
            // }
            PieChartOptions = this.copyObjectData(PieChartOptions, legend, "legend");

            return PieChartOptions;
        }
    }


    isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }


    copyObjectData(parentObject, childObject, childKey) {

        if (!this.isEmptyObject(childObject)) {
            parentObject[childKey] = { ...childObject };
        }
        return parentObject;

    }


}
