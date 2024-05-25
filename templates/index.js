function GetUserPDF() {
    var pdf = document.getElementById('myfile');
    // now we have to read the pdf
}

function ToggleDarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

function populateDropdown(data) {
    const select = document.getElementById('nameNumberSelect');
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.text= item.name;
        select.appendChild(option);
    });
}

fetch('report.json')
    .then(response => response.json()) 
    .then(data => populateDropdown(data)) 
    .catch(error => console.error('Error fetching JSON:', error)); 
