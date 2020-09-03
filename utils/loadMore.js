var utilsCharts = require('./utilsChats.util');
var api = require('../apiCalls/apiCalls');

function nextId(ids){
    if(ids.length != 0){
        var id = ids[0]
        ids.shift();
        api.getProcess(id).then(function (results) {
            if (results.statusCode) {
                console.log("Get Process error");
                nextId(ids);
            } else {
                console.log(results.typeOfData);
                if (results.typeOfData === 'CKAN') {
                    utilsCharts.ckanReloadChart(results, ids);
                } else if (results.typeOfData === 'GAODC') {
                    utilsCharts.gaodcReloadChart(results, ids);
                } else if (results.typeOfData === 'URL') {
                    utilsCharts.urlReloadChart(results, ids);
                } else if (results.typeOfData === 'SPARQL') {
                    utilsCharts.virtuosoReloadChart(results, ids);
                }
            }
        });
    }
}

module.exports = nextId