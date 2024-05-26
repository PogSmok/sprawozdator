function generateTable1(){

    var tableContainer = document.getElementById('table-container');
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');


    var headerRow = document.createElement('tr');
    var headers = ['x<sub>i</sub>', 'Zmienna losowa suma oczek z 6 kostek x<sub>i</sub>', 'Po każdym rzucie wstawić "I" we właściwym wierszu', 'Liczba wyników n<sub>i</sub>'];
    headers.forEach(function(header) {
        var th = document.createElement('th');
        th.innerHTML = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    for (var i = 1; i <= 31; i++) {
        var row = document.createElement('tr');

        // xi column
        var cell1 = document.createElement('td');
        cell1.innerText = i;
        row.appendChild(cell1);

        // Zmienna losowa suma oczek column
        var cell2 = document.createElement('td');
        cell2.innerText = i + 5;
        row.appendChild(cell2);

        // Wyniki
        var cell3 = document.createElement('td');
        var input1 = document.createElement('input');
        input1.type = 'text';
        input1.id = 'result-' + i;
        input1.placeholder = 'Wynik';
        cell3.appendChild(input1);
        row.appendChild(cell3);

        // Liczba wyników 
        var cell4 = document.createElement('td');
        var input2 = document.createElement('input');
        input2.type = 'text';
        input2.id = 'result-' + i + '-2';
        input2.placeholder = 'Wynik';
        cell4.appendChild(input2);
        row.appendChild(cell4);
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);

}

function generateTable46() {
    const Lm = [];
    const records = [];
    var tableContainer = document.getElementById('table-container');
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    var headerRow = document.createElement('tr');
    var headers = ['l.p.', 'L[m]', ' ', ' ', ' ', ' ', ' '];
    headers.forEach(function(headerText, index) {
        var th = document.createElement('th');
        if (headerText.trim() === '') {
            var input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Długość wahadła';
            input.addEventListener('change', function(event) {
                Lm[index] = event.target.value;
            });
            th.appendChild(input);
        } else {
            th.innerHTML = headerText;
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    for (var i = 1; i <= 12; i++) {
        var row = document.createElement('tr');

        var cell1 = document.createElement('td');
        cell1.innerText = i;
        row.appendChild(cell1);

        if (i === 1) {
            var cell2 = document.createElement('td');
            cell2.innerText = 't[s]';
            cell2.rowSpan = 12;
            row.appendChild(cell2);
        }

        for (var j = 0; j < 5; j++) {
            var cell = document.createElement('td');
            var input = document.createElement('input');
            input.type = 'text';
            input.id = 'result-' + (i * 5 + j);
            input.placeholder = 'Wynik';
            input.addEventListener('change', function(event) {
                records.push(event.target.value);
            });
            cell.appendChild(input);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

