
function ToggleDarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

function loadSubpage(id) {
        
    document.querySelectorAll('[id^="subpage"]').forEach(element => {
            element.style.display = 'none';
    });
    
        
    const subpage = document.getElementById(`subpage-${id}`);
    if (subpage) {
        subpage.style.display = 'block';
    } else {
        console.error(`Subpage with ID ${id} not found.`);
    }
}

let selectedValue = "";

document.getElementById("nameNumberSelects").addEventListener('input', function() {
    var val = this.value;
    
    var options = document.querySelector('datalist').options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].value === val) {
        
            console.log(val);
            
            selectedValue = val;
            clearTable();
            window[`generateTable${val}`]();
            break;
        }
    }
});

function downloadPDF(){
    console.log(selectedValue);
    if(selectedValue){
        window.open(`C:\\flutterapps\\apka\\sprawozdator-reports-list\\reports\\LabFizCw${selectedValue}.pdf`, '_blank');
    } else {
        alert('Nie wybrano pliku');
    }
}

function clearTable() {
    var tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = ''; 
}
    

