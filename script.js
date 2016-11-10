var data =  JSON.parse(localStorage.getItem("data"));
var session =  localStorage.getItem("session");

firebase.initializeApp({
    apiKey: "AIzaSyCXwc3XvYI9xBAtS_srMi9Shy5r3SDg4hE",
    authDomain: "hc4-assignment2.firebaseapp.com",
    databaseURL: "https://hc4-assignment2.firebaseio.com",
    storageBucket: "hc4-assignment2.appspot.com",
    messagingSenderId: "0",
});

var database = firebase.database().ref('data/');

database.on('value', function(snapshot) {
  console.log('fetching new data:');
  console.log(snapshot.val());
  localStorage.setItem("data", JSON.stringify(snapshot.val()));
  data = snapshot.val();
});

var enterPinState = false;
var accNumber = '';
var pinNumber = '';

function enterNumber(number){
    clearNotif();
    if(enterPinState){
        if(pinNumber.length < 4){
            pinNumber+=number+'';
            $( ".pin-number").val(pinNumber);
        }
    }
    else{
        if(accNumber.length < 19){
            accNumber+=number+'';
            if(accNumber.length==4 || accNumber.length==9 || accNumber.length==14){
                accNumber+='-'
            }
            $( ".account-number").val(accNumber);
        }
    }
}

function deleteAccountNumber(){
    clearNotif();
    if(enterPinState){
        $( ".pin-number").val(pinNumber.substring(0, pinNumber.length - 1));
        pinNumber = pinNumber.substring(0, pinNumber.length - 1);
    }
    else{
        var lastchar = accNumber.substring(accNumber.length - 1);
        if(lastchar=='-'){
            $( ".account-number").val(accNumber.substring(0, accNumber.length - 2));
            accNumber = accNumber.substring(0, accNumber.length - 2);
        }
        else{
            $( ".account-number").val(accNumber.substring(0, accNumber.length - 1));
            accNumber = accNumber.substring(0, accNumber.length - 1);
        } 
    }  
}

function onClickContinue(){
    if(accNumber == ''){
        pushNotif('You must enter an account number');
    }
    else if(accNumber.length < 19){
        pushErrorNotif('Account number must be 16 digits');
    }
    else if(accNumber.length == 19 && accountNumberValid(accNumber)){
        enterPinState = true;
        $(".login-header-titles").css("display", "none");
        $(".login-header-titles-2").css("display", "block");
        $(".account-number").css("display", "none");
        $(".pin-number").css("display", "block");
        $(".continue-button-2").css("display", "none");
        $(".login-button").css("display", "inline-block");
        $(".back-button").css("display", "inline-block");
    }
    else{
        pushErrorNotif('Account number is invalid');
    }
    
}

function onClickCancel(){
    $( ".pin-number").val('');
    $( ".account-number").val('');
    accNumber = '';
    pinNumber = '';
    enterPinState = false;
    $(".login-header-titles").css("display", "block");
    $(".login-header-titles-2").css("display", "none");
    $(".account-number").css("display", "block");
    $(".pin-number").css("display", "none");
    $(".continue-button").css("display", "inline-block");
    $(".login-button").css("display", "none");
    $(".back-button").css("display", "none");
}

function onClickLogin(){
    if(pinNumber == ''){
        pushNotif('You must enter a pin number');
    }
    else if(getAccount(accNumber, pinNumber) != null){
        localStorage.setItem("session", accNumber);
        pushSuccessNotif('Success! Loading...');
        setTimeout(function(){
            window.location.href = 'menu.html';
        }, 2000);
    }
    else{
        pushErrorNotif('Invalid Pin Number');
        pinNumber = '';
        $( ".pin-number").val('');
    }
}

function logout(){
    localStorage.removeItem('session');
    pushNotif('Logging out...');
    setTimeout(function(){
        window.location.href = 'index.html';
    }, 2000);
}


function pushNotif(msg){
    $(".error-text").text('');
    $(".top-banner").css("background-color", "#dbdbdb");
    $(".error-text").append(msg);
}

function pushSuccessNotif(msg){
    $(".error-text").text('');
    $(".top-banner").css("background-color", "#a2f88d");
    $(".error-text").append(msg);
}

function pushErrorNotif(msg){
    $(".error-text").text('');
    $(".top-banner").css("background-color", "#f88d8d");
    $(".error-text").append(msg);
}

function clearNotif(){
    $(".top-banner").css("background-color", "#fff");
    $(".error-text").text('');
}

function accountNumberValid(accNumber){
    if(data){
        for(var i = 0; i<data.accounts.length; i++){
            if(data.accounts[i].number==accNumber){
                return true;
            }
            if(i==data.accounts.length-1){
                return false;
            }
        }
    }
    else{
        return false;
    }
}
function getAccountIndex(accNumber){
    if(data){
        for(var i = 0; i<data.accounts.length; i++){
            if(data.accounts[i].number==accNumber){
                return i;
            }
            if(i==data.accounts.length-1){
                return null;
            }
        }
    }
    else{
        return null;
    }
}
function getAccountData(accNumber){
    if(data){
        for(var i = 0; i<data.accounts.length; i++){
            if(data.accounts[i].number==accNumber){
                return data.accounts[i];
            }
            if(i==data.accounts.length-1){
                return null;
            }
        }
    }
    else{
        return null;
    }
}

function getAccount(accNumber, pinNumber){
    if(data){
        for(var i = 0; i<data.accounts.length; i++){
            if(data.accounts[i].number==accNumber){
                if(data.accounts[i].pin==pinNumber){
                    return data.accounts[i];
                }
                else{
                    return null;
                }
            }
            if(i==data.accounts.length-1){
                return null;
            }
        }
    }
    else{
        return null;
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

// MODAL
function modal(question,y,n,fy,fn) {
    var x = document.getElementById("myModal");
    
    if(y == "") ystr = "";
    else ystr = "<span class=\"yes\" onclick=\"" + fy + "\">" + y + "</span>";
    
    if(n == "") nstr = "";
    else nstr = "<span class=\"no\" onclick=\"" + fn + "\">" + n + "</span>" ;
    
    x.innerHTML = "<div class=\"modal-content\">" +
                nstr +
                ystr +
                "<div id=\"qc\"><p id=\"question\">" + question + "</p></div>" +
                "</div>";
}

function depositCash(){
    // Get the modal
    var m = document.getElementById('myModal');

    pushNotif("Insert cash into slot within 10 seconds.");
    
    setTimeout(function(){
        clearNotif();
        modal("Counted cash. Is the deposit amount correct?","Yes","No","deposityes()","depositno()");
        m.style.display = "block";
    },5000);

    var yes = document.getElementsByClassName("yes")[0];
    var no = document.getElementsByClassName("no")[0];
}

function deposityes() {
    setTimeout(function(){
        modal("Deposit request accepted. Processing...","","","","");
    }, 1000);
    setTimeout(function(){
        modal("Deposit successful","","","","");
    }, 3000);
    setTimeout(function(){
    window.location.href = 'receipt.html';
    }, 5000);
}

function depositno() {
        var m = document.getElementById('myModal');
        setTimeout(function(){
            clearNotif();
            modal("Amount not correct. Please take your item from the dispenser.","","","","");
        }, 2000);
        m.style.display = "none";
}

function depositCheque(){
    // Get the modal
    var m = document.getElementById('myModal');

    pushNotif("Insert cheque into slot within 10 seconds.");
    
    setTimeout(function(){
        clearNotif();
        modal("Scanned cheque. Is the deposit amount correct?","Yes","No","deposityes()","depositno()");
        m.style.display = "block";
    },5000);

    var yes = document.getElementsByClassName("yes")[0];
    var no = document.getElementsByClassName("no")[0];
}

function depositTotal(){
    // if savings is chosen, update data "savings" value with total deposit amount
    // if chequing is chosen, update data "chequing" value with total deposit amount
}

// FASTCASH
function fastcash() {
    // Get the modal
    modal("Withdraw $100 from Chequing account?","Yes","No","","");

    var m = document.getElementById('myModal');

    m.style.display = "block";

    var no = document.getElementsByClassName("no")[0];
    var yes = document.getElementsByClassName("yes")[0];

    // When the user clicks on NO, disregard fastcash
    no.onclick = function() {
        m.style.display = "none";
        pushNotif("Fast cash cancelled");
        setTimeout(function(){
            clearNotif();
        }, 2000);
    }

    // When the user clicks on YES
    yes.onclick = function() {
        //pushNotif("Withdrawing $100 from Chequing Account...");
        setTimeout(function(){
            modal("Fast cash request accepted. Processing...","","","","");
        }, 2000);
        setTimeout(function(){
            modal("Fast cash processing successful","","","","");
        }, 4000);
        setTimeout(function(){
            window.location.href = 'receipt.html';
        }, 8000);
    }
}

function confirmNavigate(url) {

    modal("Are you sure you want to leave this page? Information you entered will be lost.",1,1);

    var m = document.getElementById('myModal');

    m.style.display = "block";

    var no = document.getElementsByClassName("no")[0];
    var yes = document.getElementsByClassName("yes")[0];

    // When the user clicks on NO, disregard navigation
    no.onclick = function() {
        m.style.display = "none";
        pushNotif("Page navigation cancelled");
        setTimeout(function(){
            clearNotif();
        }, 5000);
    }

    // When the user clicks on YES
    yes.onclick = function() {
        m.style.display = "none";
        pushNotif("Navigate confirmed. Redirecting...");
        setTimeout(function(){
            clearNotif();
        }, 5000);
    }
}

// ACCOUNTSELECTOR
function accountselector() {
    var x = document.getElementById("accountselector");
    var accountData = getAccountData(session);
    x.innerHTML = "<div class=\"select-account\">"+
                  "  <form data-name=\"withdraw-form\" data-redirect=\"#\" redirect=\"#\">"+
                  "          <select class=\"select-account-dropdown\" data-name=\"select-account\" name=\"select-account\" onchange=\"unhideContinue();\">"+
                  "              <option value=\"\">Select account...</option>"+
                  "              <option value=\"chequing\">Chequing ($"+numberWithCommas(accountData.chequing)+")<span class=\"chequing-option-amount\"></span></option>"+
                  "              <option value=\"savings\">Savings ($"+numberWithCommas(accountData.savings)+")<span class=\"savings-option-amount\"></span></option>"+
                  "          </select>"+
                  "  </form>"+
                  " </div>";
}

// SIDEBAR
function sidebar() {
    var x = document.getElementById("sidebar");
    x.innerHTML = "<a class=\"mainmenu-button w-button\" href=\"menu.html\">Main Menu</a>" + 
                "<a class=\"balance-button w-button\" href=\"balance.html\">Check Balance</a>" +
                "<a class=\"withdraw-button w-button w-button\" href=\"withdraw.html\" onclick=\"confirmNavigate(\"withdraw.html\")\">Withdraw</a>" +
                "<a class=\"deposit-button w-button\" href=\"deposit.html\" onclick=\"confirmNavigate(\"deposit.html\")\">Deposit</a>" +
                "<a class=\"transfer-button w-button w-button\" href=\"transfer.html\" onclick=\"confirmNavigate(\"transfer.html\")\">Transfer</a>" +
                "<a class=\"fastcash-button w-button\" href=\"#\" onclick=\"fastcash()\">$100 Fast Cash</a>" +
                "<a class=\"logout-button w-button\" href=\"#\" onclick=\"logout()\">Logout</a>";
}

// NAV-BUTTONS
function navButtons() {
    var x = document.getElementById("nav-buttons-deposit");
    if(typeof(x) != 'undefined' && x != null) {
        x.innerHTML = "<input class=\"cancel-button\" type=\"button\" value=\"Cancel\" onclick=\"window.location=\'index.html\';\">" +
                  "<input class=\"continue-button\" type=\"button\" value=\"Continue\" onclick=\"depositTotal()\">";
        return;
    }
    x = document.getElementById("nav-buttons-index");
    if(typeof(x) != 'undefined' && x != null) {
        x.innerHTML = "<input class=\"cancel-button\" type=\"button\" value=\"Cancel\" onclick=\"window.location=\'index.html\';\">" +
                  "<input class=\"continue-button\" type=\"button\" value=\"Continue\" onclick=\"depositTotal()\">";
        return;
    }
    x = document.getElementById("nav-buttons-balance");
    if(typeof(x) != 'undefined' && x != null) {
        x.innerHTML = "<input class=\"cancel-button\" type=\"button\" value=\"Back\" onclick=\"window.location=\'menu.html\';\">";
        return;
    }
    x = document.getElementById("nav-buttons-transfer");
    if(typeof(x) != 'undefined' && x != null) {
        x.innerHTML = "<input class=\"cancel-button\" type=\"button\" value=\"Cancel\" onclick=\"window.location=\'index.html\';\">" +
                  "<input class=\"continue-button\" type=\"button\" value=\"Continue\" onclick=\"depositTotal()\">";
        return;
    }
    x = document.getElementById("nav-buttons-withdraw");
    if(typeof(x) != 'undefined' && x != null) {
        x.innerHTML = "<input class=\"cancel-button\" type=\"button\" value=\"Cancel\" onclick=\"onBackFromOther()\">" +
                  "<input class=\"continue-button\" type=\"button\" value=\"Continue\" onclick=\"onSelectAmountButton(parseInt(otherAmount))\">";
                return;
    }
    x = document.getElementById("nav-buttons-receipt");
    if(typeof(x) != 'undefined' && x != null) {
        x.innerHTML = "<input class=\"cancel-button\" type=\"button\" value=\"Cancel\" onclick=\"onCancel()\">" +
                  "<input class=\"continue-button\" type=\"button\" value=\"Continue\" onclick=\"onSelectAmountButton(parseInt(otherAmount))\">";
        return;
    }
}

function hideContinue() {
    var x = document.getElementsByClassName("continue-button");
    x[0].disabled = true;
}

function unhideContinue() {
    var x = document.getElementsByClassName("continue-button");
    x[0].disabled = false;
    x[0].style.display = "inline-block";
}

function addMoney(accountNumber, account, amount){
   pushSuccessNotif('Processing transaction...');
   var newData = getAccountData(accountNumber);
   newData[account] += amount;
   firebase.database().ref('data/accounts/' + getAccountIndex(accountNumber)).set(newData);
   setTimeout(function(){clearNotif()}, 2000);
}

$( document ).ready(function() {
    if(session){
        $( ".menu-content" ).css("display", "block");
        $( ".name-here" ).html(getAccountData(session).name);
    }
    else{
        $( ".login-content" ).css("display", "block");
    }
});
