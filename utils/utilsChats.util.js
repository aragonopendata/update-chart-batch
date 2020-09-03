var api = require('../apiCalls/apiCalls');
var lib = require('./lib');

module.exports = {
  // Update the Chart of VIRTUOSO
  virtuosoReloadChart: function (dataProcess, ids) {
    api.getPackageVIRTUOSO([dataProcess.dataset]).then(function (data) {
      if (data.statusCode) {
        console.log("Get Package Info VIRTUOSO error");
        console.log("Dataset: " + dataProcess.dataset);
        console.log("Note: Maybe the dataset don't exist");
        var nextId = require('./loadMore');
        nextId(ids);
      } else {
        let headerTable = [];
        const dataTable = [];

        virtuosoPInitialTable(data, headerTable, dataTable);
        headerTable = data.head.vars;

        prepareAndSave(dataProcess, headerTable, dataTable, ids);
      }
    });
  },
  // Update the Chart of URL
  urlReloadChart: function (dataProcess, ids) {
    api.getPackageURL(dataProcess.dataset).then(function (data) {
      if (data.statusCode) {
        console.log("Get Package Info URL error");
        console.log("Dataset: " + dataProcess.dataset);
        console.log("Note: Maybe the dataset don't exist");
        var nextId = require('./loadMore');
        nextId(ids);;
      } else {
        let headerTable = [];
        let dataTable = [];
        if (data.result.length !== 0) {
          if (data.result[0].format === 'PX') {
            const resultado = lib.parsePXFile(data.result[0].data);
            headerTable = resultado[0];
            dataTable = resultado[1];
          } else if (data.result[0].format === 'CSV') {
            const resultado = lib.parseCSVFile(data.result[0].data, 0);
            headerTable = resultado[0];
            dataTable = resultado[1];
          }
          prepareAndSave(dataProcess, headerTable, dataTable, ids);
        }
      }
    });
  },
  // Update the Chart of the gaodc
  gaodcReloadChart: function (dataProcess, ids) {
    api.getPackageGAODC(Number(dataProcess.dataset)).then(function (dataTable) {
      if (dataTable.statusCode) {
        console.log("Get Package Info gaodc error");
        console.log("Dataset: " + dataProcess.dataset);
        console.log("Note: Maybe the dataset don't exist");
        var nextId = require('./loadMore');
        nextId(ids);
      } else {
        const headerTable = dataTable[0];
        dataTable.splice(0, 1);
        prepareAndSave(dataProcess, headerTable, dataTable, ids);
      }
    });
  },
  // Update the Chart of the CKAN
  ckanReloadChart: function (dataProcess, ids) {
    api.getPackageCKAN(dataProcess).then(function (data) {
      if (data.statusCode) {
        console.log("Get Resource CKAN error");
        console.log("Dataset: " + data.dataset);
        console.log("Note: Maybe the dataset don't exist");
        var nextId = require('./loadMore');
        nextId(ids);
      } else {
        let headerTable;
        let dataTable;
        if (data.result.length !== 0) {
          data.result.forEach((element, index) => {
            if (index === 0) {
              headerTable = [];
              dataTable = [];
            }

            if (element.format === 'PX') {
              const result = parsePXFile(element.data);
              headerTable = result[0];
              dataTable = result[1];
            } else if (element.format === 'CSV') {
              const result = lib.parseCSVFile(element.data, index);
              headerTable = result[0];
              dataTable = dataTable.concat(result[1]);
            }
          });
          prepareAndSave(dataProcess, headerTable, dataTable, ids);
        }
      }
    });
  }
}

// Prepare the initial table of the virtuoso
function virtuosoPInitialTable(virtuosoData, headerTable, dataTable) {
  headerTable = virtuosoData.head.vars;
  virtuosoData.results.bindings.forEach(element => {
    const aux2 = [];
    headerTable.forEach(elementHeader => {
      aux2.push(element[elementHeader].value);
    });
    dataTable.push(aux2);
  });
}

// Process to update the chart
function prepareAndSave(dataProcess, headerTable, dataTable, ids) {
  let dataSelected = [];
  let dataGroup = [];
  let checkedData = [];
  if (dataProcess.isMap) {
    checkedData = dataProcess.columnsLabel.concat(
      dataProcess.columnsDescription
    );
    checkedData = checkedData.concat(dataProcess.columnsData);
  } else {
    checkedData = dataProcess.columnsLabel.concat(dataProcess.columnsData);
  }

  if (dataProcess.sortOrder !== -2) {
    dataTable = dataTable.sort(
      lib.Comparator(
        headerTable.findIndex(element => element === dataProcess.fieldOrder),
        dataProcess.sortOrder
      )
    );
  }
  // Preparing the initial table with the correct columns and order
  checkedData.forEach(element => {
    const i = headerTable.indexOf(element);
    const groupIndex = headerTable.indexOf(dataProcess.groupRow);

    const auxArray = [];
    const auxArrayGroup = [];
    for (let index = 0; index < dataTable.length; index++) {
      auxArray.push(dataTable[index][i]);

      if (groupIndex != -1) {
        auxArrayGroup.push(dataTable[index][groupIndex]);
      }
    }
    dataSelected.push(auxArray);
    dataGroup = auxArrayGroup;
  });

  // Prepare the two arrays of data
  // Labels Array and the Data array with the Legend
  let chartLabels = dataSelected[0];
  dataSelected.splice(0, 1);

  let chartDescription = [];
  if (dataProcess.isMap) {
    dataProcess.columnsDescription.forEach(element => {
      if (chartDescription.length === 0) {
        chartDescription = dataSelected[0];
        dataSelected.splice(0, 1);
      } else {
        const aux = dataSelected[0];
        chartDescription.forEach((elemento, index) => {
          chartDescription[index] = elemento + ' - ' + aux[index];
        });
        dataSelected.splice(0, 1);
      }
    });
  }


  if (!dataProcess.groupRow) {
    dataSelected.forEach((element, index) => {
      dataSelected[index] = {
        data: dataSelected[index],
        label: dataProcess.legend[index].label
      };
    });
  } else {

    let groupedData = {};
    dataGroup.forEach((element, i) => {
      //Join group
      if (!groupedData[element])
        groupedData[element] = [];
      //This is done to take care that the function removeDuplicates dont delete duplicate data of other group
      for (let x = groupedData[element].length; x < i; x++) {
        groupedData[element].push("0");
      };
      groupedData[element].push(dataSelected[0][i]);
    });
    dataSelected = [];
    for (const key in groupedData) {
      dataSelected.push({
        data: groupedData[key],
        label: key
      });
    }
  }


  let chartData = dataSelected;

  let chartNumber;
  if (dataProcess.chartType === 'number') {
    let aux = 0;
    chartNumber = dataProcess.numberchart;
    switch (dataProcess.numberchart.numberOption) {
      case '0':
        chartNumber.number = chartLabels[chartLabels.length - 1] || '0';
        break;
      case '1':
        chartLabels.forEach(element => {
          aux = aux + Number(element);
        });
        chartNumber.number = aux.toString();
        break;
      case '2':
        chartLabels.forEach(element => {
          aux = aux + Number(element);
        });
        chartNumber.number = (aux / chartLabels.length).toFixed(2).toString();
        break;
    }
  }

  // Delete duplicate values
  if (!dataProcess.isMap) {
    //removeDuplicates(chartLabels, chartData);
    const resultado = lib.removeDuplicates(chartLabels, chartData);
    chartData = resultado[1];
    if (dataProcess.topRows != -1 && dataProcess.topRows != null && dataProcess.topRows != 0) {
      chartLabels = chartLabels.splice(0, dataProcess.topRows);
      chartData = chartData.splice(0, dataProcess.topRows);
    }
  } else {
    let index = 0;
    do {
      let i = index + 1;
      while (i < chartLabels.length) {
        if (
          chartLabels[index] === chartLabels[i] &&
          chartData[0].data[index] === chartData[0].data[i]
        ) {
          chartLabels.splice(i, 1);
          chartData[0].data.splice(i, 1);
          if (chartDescription && chartDescription.length !== 0) {
            chartDescription[index] =
              chartDescription[index] + ' ' + chartDescription[i];
            chartDescription.splice(i, 1);
          }
          i--;
        }
        i++;
      }
      index++;
    } while (index < chartLabels.length);
  }
  // Update the chart with the new data

  api.saveGraph(
    dataProcess.chartDataId,
    dataProcess.chartType,
    dataProcess.isMap,
    chartLabels,
    chartNumber,
    chartData,
    chartDescription,
    dataProcess.title,
    dataProcess.widthGraph
  ).then(function (dataLink) {
    if (dataLink.statusCode) {
      console.log("Save Graph error");
    } else {
      api.saveProcess(
        dataProcess.id,
        dataProcess.typeOfData,
        dataProcess.url,
        dataProcess.dataset,
        dataProcess.ckanDataset,
        dataProcess.chartType,
        dataProcess.isMap,
        chartNumber,
        dataProcess.columnsLabel,
        dataProcess.columnsData,
        dataProcess.columnsDescription,
        dataProcess.fieldOrder,
        dataProcess.sortOrder,
        dataProcess.title,
        dataProcess.legend,
        dataProcess.widthGraph,
        dataLink.id,
        dataProcess.topRows,
        dataProcess.groupRow,
        dataProcess.axisXActivator
      ).then(function (results) {
        if (results.statusCode) {
          console.log("Save Process error");
        } else {
          console.log("DONE");
          if(ids.length == 0){
            console.log("Finish");
          }else{
            var nextId = require('./loadMore');
            nextId(ids);
          }
        }
      });
    }
  });
}