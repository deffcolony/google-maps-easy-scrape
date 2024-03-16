// var rows = table.querySelectorAll('tr');

// for (var i = 0; i < rows.length; i++) {
//     var row = [], cols = rows[i].querySelectorAll('td, th');
    
//     for (var j = 0; j < cols.length; j++) {
//         row.push('"' + cols[j].innerText + '"');
//     }
//     csv.push(row.join(','));
// }
function tableToCsv(table) {
    var csv = [];

    // create the header
    var header = [];
    Object.keys(table[0]).forEach(function(key) {
        header.push('"' + key + '"');
    });
    csv.push(header.join(','));

    console.log("before" ,table);

    for (var i = 0; i < table.length; i++) {
        var row = [], cols = table[i];
        console.log("cols", cols);

        Object.keys(cols).forEach(function(key) {
            console.log("key", key);
            console.log("cols[key]", cols[key]);
            row.push('"' + cols[key] + '"');
        });

        // for (var j = 0; j < cols.length; j++) {
        //     console.log("cols[j]", cols[j]);
        //     row.push('"' + cols[j] + '"');
        // }
        csv.push(row.join(','));
    }

    console.log("after" ,csv);
    return csv.join('\n');
}

const downloadAsCVS = (data, filename) => {
    var csv = tableToCsv(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
}