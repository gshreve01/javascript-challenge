// from data.js
var tableData = data;
var selectedDate = "";
var selectedShape = "";
var selectedState = "";
var selectedCity = "";
var selectedCountry = "";
var itemCollectionCheck = [];

var formIsValid = true;


// Filtering
//----------------------------------------------------

// Master Filter
function filterEvents(event) {
    //console.log("filterEvents event", event);
    result = true;

    if (selectedDate) {
        result = DateFilter(event);
    }

    if (result && selectedShape) {
        result = ShapeFilter(event);
    }

    if (result && selectedState) {
        result = StateFilter(event);
    }

    if (result && selectedCity) {
        result = CityFilter(event);
    }

    if (result && selectedCountry) {
        result = CountryFilter(event);
    }

    //console.log("filterEvents result", result);
    return result;
}

// Date Filter
function DateFilter(event) {
    return event.datetime == selectedDate;
}

// Shape Filter
function ShapeFilter(event) {
    // console.log("filterSelectedShape", selectedShape);
    return selectedShape.includes(event.shape);
}

// State Filter
function StateFilter(event) {
    return event.state == selectedState;
}

// city Filter
function CityFilter(event) {
    return event.city == selectedCity;
}
// country Filter
function CountryFilter(event) {
    return event.country == selectedCountry;
}

//----------------------------------------------------

// Validation
//------------------------------------------

function CheckFormValidity() {
    formIsValid = CheckDateIsValid();
    console.log("formIsValid", formIsValid);

    if (formIsValid) {
        button.classed("invalid", false);

    }
    else {
        console.log("Setting button to invalid");
        button.classed("invalid", true);
    }
}

function CheckDateIsValid() {
    selectedDate = dateInput.property("value");
    console.log("CheckDateIsValid", selectedDate);
    if (!IsValidDate(selectedDate)) {
        alert(`Provided date ${selectedDate} is not valid.  Please correct the value.`);
        selectedDate = "";
        return false;
    }
    return true;
}

// Date Validation
// The below function was copied from:
// https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript/49178339
//------------------------------------------------------------------------------------------



function IsValidDate(dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

function LookupState(stateAbbr) {
    stateDictionary = {stateAbbr : stateAbbr};
    stateDictionary.state = all_states[stateAbbr.toUpperCase()];
    console.log("stateDictionary", stateDictionary);
    return stateDictionary;
}

//------------------------------------------
// Sort functions
function StateSort(a, b) {
    // console.log("a,b", a, b);
    var result = 0;
    if (a.state < b.state) 
        result = -1;
    else if (a.state > b.state)
        result = 1;
    // console.log("result", result);
    return result;
}

function CitySort(a, b) {
    // console.log("a,b", a, b);
    var result = 0;
    if (a.city < b.city) 
        result = -1;
    else if (a.city > b.city)
        result = 1;
    // console.log("result", result);
    return result;
}
//------------------------------------------


// Event Handling Setup
//------------------------------------------

// Setup Form submit
var form = d3.select("#form");
console.log("form", form);
form.on("submit", runFormSearch);

// Setup the button
var button = d3.select("#filter-btn");
console.log("button", button);
button.on("click", runFormSearch);

//------------------------------------------

// On Change Events Setup
//------------------------------------------

// Date
var dateInput = d3.select("#datetime");
console.log("dateInput", dateInput);
dateInput.on("change", function () {
    console.log("Entering dateInput on change event");
    CheckFormValidity();
});

// Shape
var shapeSelect = d3.select("#shape");
shapeSelect.on("change", function () {
    console.log("Entering shapeSelect on change event");
    selectedShape = Array.from(this.options) // create an array from the htmlCollection
        .filter(function (option) { return option.selected })  // filter for selected values
        .map(function (option) { return option.value; }); // return a new array with the selected values
    console.log("selectedShape", selectedShape);
});

// Add the distinct shapes to the drop down
var allShapes = tableData.map(event => event.shape);
console.log("allShapes", allShapes);
itemCollectionCheck = [];
var uniqueShapes = allShapes.filter(function (shape) {
    if (!itemCollectionCheck.includes(shape)) {
        itemCollectionCheck.push(shape);
        return true;
    }
    else {
        return false;
    }
});
console.log("uniqueShapes", uniqueShapes);

var options = shapeSelect.selectAll("option").data(uniqueShapes).enter().append("option")
    .text(function (d) { return d; })
    .attr("value", function (d) { return d });

console.log("shapeSelect", shapeSelect);

// State
var stateSelect = d3.select("#state");
stateSelect.on("change", function () {
    console.log("Entering stateSelect on change event");
    selectedState = stateSelect.property("value");
    console.log("selectedState", selectedState);
    selectedCity = "";
    LoadCityDropDownOptions(selectedState);
});

// Add the distinct states to the drop down
var allStates = tableData.map(event => event.state);
console.log("allStates", allStates);
itemCollectionCheck = [];
var uniqueStates = allStates.filter(function (state) {
    if (!itemCollectionCheck.includes(state)) {
        itemCollectionCheck.push(state);
        return true;
    }
    else {
        return false;
    }
});

uniqueStatesWithName = uniqueStates.map(LookupState);
uniqueStatesWithName.unshift({stateAbbr: "", state: ""});

uniqueStatesWithName = uniqueStatesWithName.sort(StateSort);
console.log("uniqueStatesWithName", uniqueStatesWithName);

options = stateSelect.selectAll("option").data(uniqueStatesWithName).enter().append("option")
    .text(function (d) { return d.state; })
    .attr("value", function (d) { return d.stateAbbr });

console.log("stateSelect", stateSelect);

// City
var citySelect = d3.select("#city");
citySelect.on("change", function () {
    console.log("Entering citySelect on change event");
    selectedCity = citySelect.property("value");
    console.log("selectedCity", selectedCity);
});

// Find the distinct cities for the drop down
var allCities = tableData.map(function (event) { return { city: event.city, state: event.state, } });
console.log("allCities", allCities);
itemCollectionCheck = [];
var uniqueCities = allCities.filter(function (cityState) {
    if (itemCollectionCheck.some(e => (e.city == cityState.city) && (e.state == cityState.state))) {
        return false;
    }
    else {
        itemCollectionCheck.push(cityState);
        return true;
    }
});

console.log("uniqueCities", uniqueCities);

// Country
var countrySelect = d3.select("#country");
countrySelect.on("change", function () {
    console.log("Entering countrySelect on change event");
    selectedCountry = countrySelect.property("value");
    console.log("selectedCountry", selectedCountry);
});

// Add the distinct countries to the drop down
var allCountries = tableData.map(event => event.country);
console.log("allCountries", allCountries);
itemCollectionCheck = [];
var uniqueCountries = allCountries.filter(function (country) {
    if (!itemCollectionCheck.includes(country)) {
        itemCollectionCheck.push(country);
        return true;
    }
    else {
        return false;
    }
});
uniqueCountries.unshift("");
console.log("uniqueCountries", uniqueCountries);

options = countrySelect.selectAll("option").data(uniqueCountries).enter().append("option")
    .text(function (d) { return d; })
    .attr("value", function (d) { return d });

console.log("countrySelect", countrySelect);

//------------------------------------------

// Load Data Methods
//---------------------------------------------------

function LoadCityDropDownOptions(state) {
    console.log("LoadCityDropDownOptions");
    console.log("state", state);
    var filteredCities = uniqueCities.filter(cityState => cityState.state == state);
    filteredCities.unshift("");
    filteredCities = filteredCities.sort(CitySort);
    console.log("filteredCities", filteredCities);
    citySelect.selectAll("option").remove();
    options = citySelect.selectAll("option").data(filteredCities).enter().append("option")
        .text(function (d) { return d.city; })
        .attr("value", function (d) { return d.city });
}

function LoadData(events) {
    // clear out current data under tbody
    var tbody = d3.select(".table-data")
    tbody.selectAll("tr").remove();
    events.forEach((event) => {
        var row = tbody.append("tr");
        Object.values(event).forEach((value) => {
            var td = row.append("td");
            td.text(value);
        });
    });
}

function runFormSearch() {
    runSearch(true);
}

function runSearch(keepFormData) {
    console.log("running search");

    // keep the form from resetting
    console.log("keepFormData", keepFormData);
    if (keepFormData) {
        d3.event.preventDefault();
    }

    var filteredEvents = tableData;

    // Verify form is valid
    if (formIsValid) {
        filteredEvents = filteredEvents.filter(filterEvents);
    }
    else {
        console.log("Form is invalid. Can't Search", selectedDate);
        filteredEvents = [];
    }

    LoadData(filteredEvents);
}

//---------------------------------------------------

console.log("Running search");
//runSearch(false);