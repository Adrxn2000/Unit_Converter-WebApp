document.addEventListener("DOMContentLoaded", function (){
// fix active tab highlighting
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
    if(tab.getAttribute("href") === currentPage) {
        tab.classList.add("active");
    }
});


// Get the form and result elements
const form = document.querySelector("form");
const resultDisplay = document.querySelector("h2");
const resetButton = document.querySelector('button[type="reset"]');

    // Handle form submission
form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    const value = parseFloat(document.querySelector('input[name="value"]').value);
    const unitFrom = document.querySelector('select[name="unit_from"]').value;
    const unitTo = document.querySelector('select[name="unit_to"]').value;

    if (isNaN(value)) {
        resultDisplay.textContent = "Please enter a valid number.";
        return;
    }

    const result = convertUnit(value, unitFrom, unitTo);
    resultDisplay.textContent = `${value} ${getUnitFullName(unitFrom)} = ${result} ${getUnitFullName(unitTo)}`;

    
});

// Handle reset button click
resetButton.addEventListener("click", function () {
  form.reset();
    resultDisplay.textContent = ""; // Clear the result display
});

});

//Get the full name of the unit
function getUnitFullName(unit) {
    const unitNames = {
        // Length units
        "m": "meters",
        "cm": "centimeters",
        "mm": "millimeters",
        "km": "kilometers",
        "ft": "feet",
        "in": "inches",
        "yd": "yards",
        "mi": "miles",
        "g": "grams",
        "kg": "kilograms",
        "mg": "milligrams",
        "lb": "pounds",
        "oz": "ounces",

         // Weight units
         'mg': "Milligrams",
         "g": 'Grams',
         'kg': 'Kilograms',
         'oz': 'Ounces',
         'lb': 'Pounds',
         // Temperature units
         'C': 'Celsius',
         'F': 'Fahrenheit',
         'K': 'Kelvin'
    };
    return unitNames[unit] || unit;
}

// Convert the value from one unit to another
function convertUnit(value, unitFrom, unitTo) {
    //if the units are the same, return the value
    if (unitFrom === unitTo) {
        return value;
    }

    //Handle temperature conversion
    if(['C', 'F', 'K'].includes(unitFrom) && ['C', 'F', 'K'].includes(unitTo)) {
        return convertTemperature(value, unitFrom, unitTo);
    }

    //convert to base unit
    let valueInBaseUnit = convertToBaseUnit(value, unitFrom);

    //convert from base unit to target unit
    return convertFromBaseUnit(valueInBaseUnit, unitTo);

}

// Convert the value to the base unit (meters for length, grams for weight, Celsius for temperature)
function convertToBaseUnit(value, unit){
    // Length conversions (base unit: meters)
        const lengthConversions = {
            'mm':value => value * 0.001,
            'cm': value => value * 0.01,
            'm': value => value,
            'km': value => value * 1000,
            'ft': value => value * 0.3048,
            'in': value => value * 0.0254,
            'yd': value => value * 0.9144,
            'mi': value => value * 1609.34,
        };
    // Weight conversions (base unit: grams)
        const weightConversions = {
            'mg': value => value * 0.001,
            'g': value => value,
            'kg': value => value * 1000,
            'oz': value => value * 28.3495,
            'lb': value => value * 453.592,
        };

        if(unit in lengthConversions) {
            return lengthConversions[unit](value);

        }else if(unit in weightConversions) {
            return weightConversions[unit](value);
        }

        return value; 
    }

    //convert from base unit to target unit
function convertFromBaseUnit(value, unit) {
        // Length conversions (base unit: meters)
        const lengthConversions = {
            'mm': value => value / 0.001,
            'cm': value => value / 0.01,
            'm': value => value,
            'km': value => value / 1000,
            'ft': value => value / 0.3048,
            'in': value => value / 0.0254,
            'yd': value => value / 0.9144,
            'mi': value => value / 1609.34,
        };

        // Weight conversions (base unit: grams)
        const weightConversions = {
            'mg': value => value / 0.001,
            'g': value => value,
            'kg': value => value / 1000,
            'oz': value => value / 28.3495,
            'lb': value => value / 453.592,
        };

        if(unit in lengthConversions) {
            return lengthConversions[unit](value);
        }
        else if(unit in weightConversions) {
            return weightConversions[unit](value);
        }
        return value;

    }

    //Handle temperature conversion
    function convertTemperature(value, unitFrom, unitTo) {
        // Convert to Celsius first
        let celcius;
        switch (unitFrom) {
            case 'C':
                celcius = value;
                break;
            case 'F':
                celcius = (value - 32) * 5 / 9;
                break;
            case 'K':
                celcius = value - 273.15;
                break;
            default:
                return value; // If the unit is not recognized, return the original value
        }

        // Convert from Celsius to the target unit
        switch (unitTo) {
            case 'C':
                return celcius;
            case 'F':
                return (celcius * 9 / 5) + 32;
            case 'K':
                return celcius + 273.15;
            default:
                return value; // If the unit is not recognized, return the original value
        }
    }

    // Round results to 4 decimal  places for cleamer display
    function roundResult(value) {
        return Math.round(value * 10000) / 10000;
    }

    