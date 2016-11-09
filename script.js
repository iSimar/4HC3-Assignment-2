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

var accNumber = '';

function enterNumber(number){
    clearNotif();
    if(accNumber.length < 19){
        accNumber+=number+'';
        if(accNumber.length==4 || accNumber.length==9 || accNumber.length==14){
            accNumber+='-'
        }
        $( ".account-number").val(accNumber);
    }
}

function deleteAccountNumber(){
    clearNotif();
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

function onClickLogin(){
    if(accNumber == ''){
        pushNotif('You must enter an account number');
    }
    else if(getAccount(accNumber) != null){
        localStorage.setItem("session", accNumber);
        pushSuccessNotif('Success! Loading...');
        setTimeout(function(){
            window.location.href = 'menu.html';
        }, 2000);
    }
    else{
        pushErrorNotif('Invalid Account Number');
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

function getAccount(number){
    if(data){
        for(var i = 0; i<data.accounts.length; i++){
            if(data.accounts[i].number==number){
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

$( document ).ready(function() {
    if(session){
        $( ".menu-content" ).css("display", "block");
    }
    else{
        $( ".login-content" ).css("display", "block");
    }
});