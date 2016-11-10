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
        $(".continue-button").css("display", "none");
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

// TODO: DEPOSIT PAGE FUNCTIONS
function depositCash(){
    // count (simulated) cash and open a pop-up that lets user confirm whether value is correct
    // update session total deposit amount
}

function depositCheque(){
    // count (simulated) money in cheque and open a pop-up that lets user confirm whether value is correct
    // update session total deposit amount
}

function depositTotal(){
    // if savings is chosen, update data "savings" value with total deposit amount
    // if chequing is chosen, update data "balance" value with total deposit amount
}

// SIDEBAR
function sidebar() {
    var x = document.getElementById("sidebar");
    x.innerHTML = "<a class=\"mainmenu-button w-button\" href=\"menu.html\">Main Menu</a>" + 
                "<a class=\"withdraw-button w-button\" href=\"withdraw.html\">Withdraw</a>" +
                "<a class=\"deposit-button w-button\" href=\"#\">Deposit</a>" + 
                "<a class=\"transfer-button w-button\" href=\"transfer.html\">Transfer</a>" +
                "<a class=\"fastcash-button w-button\" href=\"fastcash.html\">$100 Fast Cash</a>" +
                "<a class=\"logout-button w-button\" href=\"#\" onclick=\"logout()\">Logout</a>";
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