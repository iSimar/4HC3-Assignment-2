var accNumber = '';

function enterNumber(number){
    if(accNumber.length < 20){
        accNumber+=number+'';
        if(accNumber.length==4 || accNumber.length==9 || accNumber.length==14){
            accNumber+='-'
        }
        $( ".account-number").val(accNumber);
    }
}

function deleteAccountNumber(){
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