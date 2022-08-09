
function displayUI() {
    $.ajax({
        type: 'GET',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function (itemsArray) {
            // at least three rows added inside #vendingMachine dynamically when script loads
            displayItems(itemsArray);
            // relies on existence of three rows inside #vendingMachine to append 1 input/output group inside of each row
            insertInputsOutputs();
        },
        error: function () {
        }
    });
}

function getVendItems() {
    $.ajax({
        type: 'GET',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function (itemsArray) {
            // update only the items when we try to make a purchase 
            displayItems(itemsArray);
        },
        error: function () {
        }
    });
}

function addDollar() {
    addAmount(1.00);
}

function addQuarter() {
    addAmount(0.25);
}

function addDime() {
    addAmount(0.10);
}

function addNickel() {
    addAmount(0.05);
}

function addAmount(value) {
    let newValue = parseFloat($('#coinDisplay').val()) + value;
    // correct for bad javascript math
    newValue = Math.round(newValue * 100) / 100;
    $('#coinDisplay').val(newValue);
}

function makeSelection(itemId) {
    $('#messageDisplay').val("");
    $('#changeDisplay').val("");
    $('#itemDisplay').val(itemId);
}

function makePurchase() {
    let deposit = $('#coinDisplay').val();
    let selection = $('#itemDisplay').val();
    if ($('#coinDisplay').val() == "0.00") {
        $('#messageDisplay').val("Please make a deposit");
        return;
    } else if ($('#itemDisplay').val() == ""){
        $('#messageDisplay').val("Please make a selection");
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/money/' + deposit + '/item/' + selection,
        success: function (changeObj) {
            getChange(changeObj);
            $('#messageDisplay').val("Thank you!!!");
            getVendItems();
        },
        error: function (response) {
            let message = JSON.parse(response.responseText).message;
            $('#messageDisplay').val(message);
            getVendItems();
        }
    });
}

function getChange(changeObj) {
    if (!changeObj) {
        changeObj = createChangeObj();
    }

    let changeString = "";

    for (coin in changeObj) {
        if (changeObj[coin] > 0) {
            changeString += coin + ": " + changeObj[coin] + "\n";
        }
    }

    $('#changeDisplay').val(changeString);
    $('#coinDisplay').val("0.00");
    $('#itemDisplay').val("");
    $('#messageDisplay').val("");
}

function createChangeObj() {
    let deposit = parseFloat($('#coinDisplay').val());
    let changeObj = {};
    let numQuarters = Math.floor(deposit / 0.25);
    changeObj['quarters'] = numQuarters;
    deposit = deposit % 0.25;
    let numDimes = Math.floor(deposit / 0.10);
    changeObj['dimes'] = numDimes;
    deposit = deposit % 0.10;
    // correct for bad javascript math
    deposit = Math.round(deposit * 100) / 100;
    let numNickels = Math.floor(deposit / 0.05);
    changeObj['nickels'] = numNickels;
    deposit = deposit % 0.05;
    let numPennies = Math.floor(deposit / 0.01);
    changeObj['pennies'] = numPennies;
    return changeObj;
}

function insertInputsOutputs() {
    // function relies on the existence of rows inside #vendingMachine container, this is why we call displayItems first
    let rows = $('#vendingMachine').children();
    let coinInputTitle = "<h3> Total $ In </h3>";
    let coinDisplay = "<input id='coinDisplay' type='text' disabled>"
    let dollarButton = "<button onclick='addDollar()' class='btn btn-primary'>Add Dollar</button>";
    let quarterButton = "<button onclick='addQuarter()' class='btn  btn-primary'>Add Quarter</button>";
    let dimeButton = "<button onclick='addDime()' class='btn  btn-primary' >Add Dime</button>";
    let nickelButton = "<button onclick='addNickel()' class='btn  btn-primary'>Add Nickel</button>";


    let coinInput = "<div class='col-3'>" +
                        "<div class='row mb-2'>" +
                            "<div class='col'>" +
                                coinInputTitle + "</div>" + "</div>" +
                        "<div class='row mb-2'>" +
                            "<div class='col'>" +
                                coinDisplay + "</div>" + "</div>" +
                        "<div class='row mb-2'>" +
                            "<div class='col-6'>" +
                                dollarButton + "</div>" +
                            "<div class='col-6'>" +
                                quarterButton + "</div>" + "</div>" +
                        "<div class='row mb-2'>" +
                            "<div class='col-6'>" +
                                dimeButton + "</div>" +
                            "<div class='col-6'>" +
                                nickelButton + "</div>" + "</div>" 
                        + "<hr>" + 
                    "</div>";

    let purchaseInputTitle = "<h3>Messages</h3>";
    let messageDisplay = "<textarea id='messageDisplay' disabled></textarea>";
    let label = "<label for='itemDisplay'>Item:</label>";
    let selectedItemDisplay = "<input type='text' id='itemDisplay' disabled>";
    let purchaseButton = "<button class='btn btn-primary' onclick='makePurchase()'>Make Purchase</button>";

    let purchaseInput = "<div class='col-3'>" +
                            "<div class='row'>" +
                                "<div class='col-1'></div>" +
                                "<div class='col-10'>" +
                                    "<div class='row mb-2'>" +
                                            purchaseInputTitle + "</div>" + 
                                    "<div class='row mb-2'>" +
                                            messageDisplay + "</div>" +
                                    "<div class='row mb-2'>" +
                                        "<div class='col'>" + label + "</div>" +
                                        "<div class='col'>" + 
                                            selectedItemDisplay + "</div>" + "</div>" +
                                    "<div class='row mb-2'>" +
                                        purchaseButton + "</div>" + "</div>" +
                                "<div class='col-1'></div>" +
                            "</div>" +
                            "<hr>" +
                        "</div>";

    let changeOutputTitle = "<h3>Change</h3>";
    let changeOutputDisplay = "<textarea id='changeDisplay' rows='5' disabled></textarea>";
    let changeReturnButton = "<button onclick='getChange()' class='btn btn-primary'>Change Return</button>";

    let changeOutput = "<div class='col-3'>" +
                            "<div class='row mb-2'>" +
                                "<div class='col-2'></div>" +
                                "<div class='col'>" +
                                    changeOutputTitle + "</div>" + 
                                "<div class='col-2'></div>" + "</div>" +
                            "<div class='row mb-2'>" +
                                "<div class='col-2'></div>" +
                                "<div class='col'>" +
                                    changeOutputDisplay + "</div>" +
                                "<div class='col-2'></div>" + "</div>" +
                            "<div class='row mb-2'>" +
                                "<div class='col-2'></div>" +
                                "<div class='col'>" +
                                    changeReturnButton + "</div>" +
                                "<div class='col-2'></div>" + "</div>" +
                        "</div>";

    $(rows[0]).append(coinInput);
    $(rows[1]).append(purchaseInput);
    $(rows[2]).append(changeOutput);

    $('#coinDisplay').val('0.00');

}

function displayItems(itemsArray) {
    let rows = $('#vendingMachine').children();
    let numRows = rows.length;
    let itemRowCount = Math.ceil(itemsArray.length / 3);
    // there should be at least 3 rows (to append input/output groups) with 3 vendItems per row, but could be more rows depending 
    // on how many vendItems we get back from API call
    const rowsRequired = itemRowCount < 3 ? 3 : itemRowCount;

    // add  as many <div class="row"></div> as we need, minimum 3 (to append input/output groups to the first 3 rows)
    while (numRows < rowsRequired) {
        $("#vendingMachine").append("<div class='row mb-2'></div>");
        numRows++;
    }

    let itemContainers = [];
    // create HTML strings for each vendItem card display and put them in an array
    itemsArray.forEach(function (item, index) {
        let container = "<div class='col-3 vendItem mb-3'>" +
            "<div class='card' onclick='makeSelection(" + item.id + ")'>" +
            "<div class='card-title'>" +
            "<p class='itemId' style='text-align: left'>" + item.id + "</p>" +
            "</div>" +
            "<div class='card-body'>" +
            "<h5>" + item.name + "</h5>" +
            "<p>$" + item.price + "</p>" +
            "<p>Quantity left: " + item.quantity + "</p>" +
            "</div>" +
            "</div>" +
            "</div>";
        itemContainers.push(container);
    });

    // add removable columns to keep input/output groups on the right when vendItems are less than 9
    while (itemContainers.length < 9) {
        itemContainers.push("<div class='col-3 vendItem'></div>");
    }
    // remove existing vendItems in case we are refreshing items
    $('.vendItem').remove();

    // the length of this should be at least 3
    rows = $('#vendingMachine').children();

    let rowIndex = 0;
    //  three items (or less if there's only 2 left for example) are taken out of itemContainers array at a time and prepended
    // to each row in reverse order (prepending must be done. in case an input/output group exists in the row, we want to keep it on the right side)
    while (itemContainers.length > 0) {
        let row = $(rows[rowIndex]);
        // max three vendITems per row
        let spliceIndex = itemContainers.length >= 3 ? 3 : itemContainers.length;
        let rowItems = itemContainers.splice(0, spliceIndex);
        for (let i = rowItems.length - 1; i >= 0; i--) {
            row.prepend(rowItems[i]);
        }
        rowIndex++;
    }
}

$(document).ready(function(event) {

    displayUI();

});