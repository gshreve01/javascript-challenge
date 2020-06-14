// from data.js
var tableData = data;
var selectedDate = "";


// Filtering
//----------------------------------------------------

// Master Filter
function filterEvents(event) {
    console.log("filterEvents event", event);
    result = true;
    
    if (selectedDate) {
        result = DateFilter(event);
    }

    console.log("filterEvents result", result);
    return result;
}

// Date Filter
function DateFilter(event) {
    return event.datetime == selectedDate;
}

//----------------------------------------------------

// Validation
//------------------------------------------
function IsValidDate(datetime) {
    return true;
}

//------------------------------------------


// Event Handling Setup
//------------------------------------------

// Setup Form submit
var form = d3.select("#form");
console.log("form", form);
form.on("submit",runFormSearch);

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
dateInput.on("change", function() {
    console.log("Entering dateInput on change event");
    selectedDate = dateInput.property("value");
    console.log("selectedDate", selectedDate);
    if (!IsValidDate(selectedDate))
    {
        alert(`Provided date ${selectedDate} is not valid.  Value will be cleared.`);
        selectedDate = "";
    }
});


//------------------------------------------

// Load Data Methods
//---------------------------------------------------

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

    console.log("selectedDate", selectedDate);

    filteredEvents = filteredEvents.filter(filterEvents);

    LoadData(filteredEvents);
}

//---------------------------------------------------

console.log("Running search");
runSearch(false);