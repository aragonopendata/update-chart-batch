const bent = require('bent');
var config = require('../config');

module.exports = {
    listOfCharts: async function () {
        var page = 0
        var sizeDefault = 1000
        var endOfUpdate = false
        var chartIDs = [];
        try {
            while (!endOfUpdate) {
                    console.log(config.urlBackend + config.listCharts_ep + '?page=' + page + '&size=' + sizeDefault + '');
                    const get = bent(config.urlBackend, 'GET', 'json', 200);
                    const response = await get(config.listCharts_ep + '?page=' + page + '&size=' + sizeDefault + '');

                    response.charts.forEach(element => {
                        chartIDs.push(element.id);
                    });
                    page++;
                    if (response.charts.length == 0 || response.charts.length < sizeDefault) {
                        endOfUpdate = true;
                    }
                } 
            }
        catch (err) {
            console.log(err);
            return err;
        }
        //We have to invert the array because when we update the charts the last updated is show the first of the list
        return chartIDs.reverse();
    },
    getProcess: async function (id) {
        var response;
        try {
            const get = bent(config.urlBackend, 'GET', 'json', 200);
            response = await get(config.process_ep + id);
        } catch (err) {
            console.log("Process: " + err);
            return err;
        }
        return response;
    },
    getPackageCKAN: async function (dataProcess) {
        var response;
        try {
            const post = bent(config.urlBackend, 'POST', 'json', 200);
            response = await post(config.resource_ckan_ep, { url: dataProcess.url, format: dataProcess.dataset });
        } catch (err) {
            console.log("CKAN: " + err);
            return err;
        }
        return response;
    },
    getPackageGAODC: async function (data) {
        var response;
        var body = { packages: data }
        try {
            const post = bent(config.urlBackend, 'POST', 'json', 200);
            response = await post(config.resource_gaodc_ep, body);
        } catch (err) {
            console.log("GAODC: " + err);
            return err;
        }
        return response;
    },
    getPackageURL: async function (data) {
        var response;
        
        var body = { packages: data }
        try {
            const post = bent(config.urlBackend, 'POST', 'json', 200);
            response = await post(config.resource_url_ep, body);
        } catch (err) {
            console.log("URL: " + err);
            return err;
        }
        return response;
    },
    getPackageVIRTUOSO: async function (data) {
        var response;
        try {
            const post = bent(config.urlBackend, 'POST', 'json', 200);
            response = await post(config.resource_virtuoso_ep, { packages: data[0] });
        } catch (err) {
            console.log("VIRTUOSO: " + err);
            return err;
        }
        return response;
    },
    saveGraph: async function (id, type, isMap, labels, number, data, descrip, title, width) {
        var body = {
            id: id,
            type: type,
            isMap: isMap,
            labels: labels,
            number: number,
            data: data,
            descriptions: descrip,
            title: title,
            width: width
        }
        var response;
        try {
            const post = bent(config.urlBackend, 'POST', 'json', 200);
            response = await post(config.save_graph_ep, body);
        } catch (err) {
            console.log(err);
            return err;
        }
        return response;
    },
    saveProcess: async function (id, typeOfData, url, dataset, ckanDataset, chartType, isMap, numberchart, columnsLabel,
        columnsData, columnsDescrip, fieldOrder, sortOrder, title, legend, widthGraph,
        chartDataId, topRows, groupRow, axisXActivator) {
        var body = {
            id: id,
            chartDataId: chartDataId,
            url: url,
            typeOfData: typeOfData,
            dataset: dataset,
            ckanDataset: ckanDataset,
            chartType: chartType,
            isMap: isMap,
            numberchart: numberchart,
            columnsLabel: columnsLabel,
            columnsData: columnsData,
            columnsDescription: columnsDescrip,
            fieldOrder: fieldOrder,
            sortOrder: sortOrder,
            title: title,
            legend: legend,
            widthGraph: widthGraph,
            topRows: topRows,
            groupRow: groupRow,
            axisXActivator: axisXActivator
        }
        var response;
        try {
            const post = bent(config.urlBackend, 'POST', 'json', 200);
            response = await post(config.save_process_ep, body);
        } catch (err) {
            console.log(err);
            return err;
        }
        return response;
    }
}
