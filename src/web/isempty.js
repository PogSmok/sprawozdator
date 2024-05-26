function checkEmptyFields() {
    var inputs = document.querySelectorAll('input[type="text"]');
    var isEmpty = false;

    inputs.forEach(function(input) {
        if (input.value.trim() === '') {
            isEmpty = true;
            return;
        }
    });

    if (isEmpty) {
        alert('Nie wszystkie pola zostały wypełnione!');
    } 
}