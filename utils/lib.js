module.exports = {

  removeDuplicates: function (chartLabels, chartData) {
    const duplicates = chartLabels.filter(function (value, index, self) {
      return self.indexOf(value) !== index;
    });
    const unique = chartLabels.filter((v, i, a) => a.indexOf(v) === i);

    // Test if the data is a string and if it is, transform the array into number of ones
    chartData.forEach(element => {
      if (typeOfArray(element.data) === 'String') {
        const aux = Array.from(new Array(element.data.length), (val, index) => 1);
        element.data = aux;
      }
    });

    // Delete duplicates and sum their numeric info
    duplicates.forEach(element => {
      const findFirst = chartLabels.indexOf(element);
      for (let i = findFirst + 1; i < chartLabels.length; i++) {
        if (element === chartLabels[i]) {
          // Duplicate Data
          chartData.forEach((d, index) => {
            d.data[findFirst] = Number(d.data[findFirst]);
            if (d.data[i])
              d.data[findFirst] += Number(d.data[i])
            d.data.splice(i, 1);
          });
          chartLabels.splice(i, 1);
        }
      }
    });

    chartData.forEach((d, index) => {
      d.data.forEach((element, index) => {
        if (element % 1 != 0) {
          d.data[index] = Number(element).toFixed(2);
        }
      });
    });

    return [unique, chartData];
  },

  Comparator: function (index, order) {
    return function (a, b) {
      if (!isNaN(Number(a[index])) && !isNaN(Number(b[index]))) {
        if (order === 1) {
          return a[index] - b[index];
        } else {
          return b[index] - a[index];
        }
      }
      if (a[index] < b[index]) {
        return order === 1 ? 1 : -1;
      }
      if (a[index] > b[index]) {
        return order === 1 ? -1 : 1;
      }
      return 0;
    };
  },
  parseCSVFile: function (data, index) {
    const keys = [];
    for (const key in data[0]) {
      if (key) {
        keys.push(key);
      }
    }
    const rows = [];
    data.forEach(element => {
      const aux = [];
      for (const key in element) {
        if (key) {
          aux.push(element[key]);
        }
      }
      rows.push(aux);
    });

    return [keys, rows];
  },

  parsePXFile: function (data) {
    let headersNames = [];
    const headersOrder = [];
    let labelsNames = [];
    const values = [];
    let dataTable = [];
    let headerTable = [];
    let parse = 'init';
    data = data.replace(/\s+/g, ' ').trim();

    // Prepare the Headers Names
    parse = data.match(/HEADING=[.\s\S]*?;/);
    parse = parse[0]
      .split('=')
      .pop()
      .slice(0, -1);
    headersNames = parse
      .replace(/",\s?\S?"/g, '"############"')
      .split('############');
    headersNames.forEach((element, index) => {
      headersNames[index] = element.replace(/"/g, '').replace(/^\s+/g, '');
    });

    // Prepare the Headers Names of the labels/stub
    parse = data.match(/STUB=[.\s\S]*?;/);
    parse = parse[0]
      .split('=')
      .pop()
      .slice(0, -1);
    labelsNames = parse
      .replace(/",\s?\S?"/g, '"############"')
      .split('############');
    labelsNames.forEach((element, index) => {
      labelsNames[index] = element.replace(/"/g, '').replace(/^\s+/g, '');
    });

    // GET all Headers AND Descriptions of the px file
    while (parse != null) {
      parse = data.match(/VALUES\(.*?\)=[.\s\S]*?";/);
      if (parse != null) {
        parse = parse[0].slice(7, -1);
        let aux3 = parse.match(/[.\s\S]*?\)/).toString();
        aux3 = aux3.slice(0, aux3.length - 1);
        aux3 = aux3.replace(/"/g, '').replace(/^\s+/g, '');
        headersOrder.push(aux3);
        parse = parse
          .split('=')
          .pop()
          .slice(0, -1);

        const aux2 = parse
          .replace(/",\s?\S?"/g, '"############"')
          .split('############');
        aux2.forEach((element, index) => {
          aux2[index] = element.replace(/"/g, '').replace(/^\s+/g, '');
        });
        values.push(aux2);

        data = data.split(parse).pop();
      }
    }

    // Prepare Table Data
    parse = data.match(/DATA=[.\s\S]*?;/);
    parse = parse[0]
      .split('= ')
      .pop()
      .slice(0, -1);
    const auxDataTable2 = parse.split(' ');

    auxDataTable2.forEach((element, index) => {
      if (element === '"."') {
        auxDataTable2[index] = null;
      }
    });

    const auxDataTable = auxDataTable2.map(function (x) {
      const n = parseInt(x, 10);
      if (isNaN(n)) {
        return null;
      } else {
        return n;
      }
    });

    ///////////////////////////////////////////////////////////
    // Duplicate arrays to match the superior headers and add that header

    // Get the headers array pointers
    const pointersHeaders = [];

    headersNames.reverse().forEach(element => {
      const indexHeader = headersOrder.findIndex(dato => dato === element);

      pointersHeaders.push(values[indexHeader]);
    });

    pointersHeaders.reverse().forEach((element, index) => {
      if (index + 1 < pointersHeaders.length) {
        const clone = pointersHeaders[index + 1].slice(0);
        element.forEach((e, index2) => {
          if (index2 === 0) {
            pointersHeaders[index + 1] = [];
          }
          pointersHeaders[index + 1] = pointersHeaders[index + 1].concat(
            clone.map(z => e + ' ' + z)
          );
        });
      }
    });
    headerTable = pointersHeaders[pointersHeaders.length - 1];
    ///////////////////////////////////////////////////////////

    // Indicate where to cut on the array and create the respective chucks
    dataTable = chuck(auxDataTable, headerTable.length);
    if (
      dataTable[dataTable.length - 1][0] == null &&
      dataTable[dataTable.length - 1].length <= 1
    ) {
      dataTable.pop();
    }

    ///////////////////////////////////////////////////////////
    // Prepare the Labels/STUB

    // Get the labels array pointers
    const pointersLabels = [];
    const indexLabels = [];

    labelsNames.forEach(element => {
      const indexHeader = headersOrder.findIndex(dato => dato === element);

      pointersLabels.push(values[indexHeader]);
      indexLabels.push(indexHeader);
    });

    pointersLabels.forEach((element, index) => {
      if (index + 1 < pointersLabels.length) {
        const auxiliar = [];
        element.forEach(e => {
          for (let i = 0; i < pointersLabels[index + 1].length; i++) {
            auxiliar.push(e);
          }
        });
        pointersLabels[index] = auxiliar;
      } else {
        const clone = element.slice(0);
        let auxiliar = [];
        for (
          let indice = 0;
          indice < Math.floor(dataTable.length / clone.length);
          indice++
        ) {
          auxiliar = auxiliar.concat(clone);
        }
        pointersLabels[index] = auxiliar;
      }
    });

    indexLabels.reverse();

    // Add the ROW labels to the table
    pointersLabels.reverse().forEach((element, index) => {
      headerTable.unshift(labelsNames[indexLabels[index]]);
      element.forEach((e, i) => {
        if (dataTable[i] !== undefined) {
          dataTable[i].unshift(e);
        }
      });
    });

    ///////////////////////////////////////////////////////////

    return [headerTable, dataTable];
  }
}

// split array into chucks of the size parameter
function chuck(array, size) {
  const results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
}

function typeOfArray(array) {
  let exit = true;
  let newIndex = 0;

  do {
    exit = false;
    if (
      isNaN(array[newIndex]) &&
      array[newIndex] !== undefined &&
      array[newIndex] != null
    ) {
      exit = true;
      return 'String';
    } else {
      newIndex++;
      if (newIndex >= array.length) {
        exit = true;
        return 'Number';
      }
    }
  } while (!exit);
  return undefined;
}

