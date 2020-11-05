function triggerModalAlert(msg) {
    var modal = document.getElementById("modalId");
    var okBtn = document.getElementById("okBtn");
    var modalText = document.getElementById("modalText");

    modal.style.display = "block";
    modalText.innerHTML = msg;

    okBtn.onclick = function() {
        modal.style.display = "none";
    }
}

function reloadPageOnButtonTrigger(button) {
    var btn = document.getElementById(button);
    btn.onclick = function() {
        location.reload();
    }
}

function validateAccountName() {
    var accountName = document.getElementById("acct_name").value;
    var msg = "";
    if(accountName.length < 5) {
        msg = "Account name must be a minimum of 5 characters.";
        document.getElementById("accountNameError").innerHTML = msg;
        return [false, msg];
    }
    else {
        document.getElementById("accountNameError").innerHTML = '';
    }
    return [true, msg];
}

function validateEmail() {
    var email = document.getElementById("email").value;
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var msg = "";
    if(!email.match(emailRegex)) {
        msg = "Invalid email address.";
        document.getElementById("emailError").innerHTML = msg;
        return [false, msg];
    }
    else {
        document.getElementById("emailError").innerHTML = '';
    }
    return [true, msg];
}

function validateName(nameType) {
    var name = document.getElementById(nameType).value;
    var alphaRegex = /^[a-zA-Z]+$/;
    var msg = "";
    if(!name.match(alphaRegex)) {
        msg = "Name should contain only characters.";
        document.getElementById(nameType+"Error").innerHTML = msg;
        return [false, msg];
    }
    else {
        document.getElementById(nameType+"Error").innerHTML = '';
    }
    return [true, msg];
}

function validatePhoneNumber() {
    var phone = document.getElementById("phone").value;
    var phoneRegex = /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/;
    var msg = "";
    if(!phone.match(phoneRegex)) {
        msg = "Invalid phone number. Format: XXX-XXX-XXXX";
        document.getElementById("phoneError").innerHTML = msg;
        return [false, msg];
    }
    else {
        document.getElementById("phoneError").innerHTML = '';
    }
    return [true, msg];
}

function validatePassword() {
    var password = document.getElementById("passwd").value;
    var passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$/;
    var msg = "";
    if(!password.match(passwordRegex)) {
        msg = "Password must be a minimum of 12 characters and contain at least: <br>\u2022 1 character (a-zA-Z)<br>\u2022 1 number (0-9)<br>\u2022 1 special character (!@#$%^&*)";
        document.getElementById("passwdError").innerHTML = msg;
        return [false, msg];
    }
    else {
        document.getElementById("passwdError").innerHTML = '';
    }
    return [true, msg];
}

function confirmPassword() {
    var password = document.getElementById("passwd").value;
    var confirmPassword = document.getElementById("cfmpasswd").value;
    var msg = "";
    if(password != confirmPassword) {
        msg = "Passwords do not match.";
        document.getElementById("cfmpasswdError").innerHTML = msg;
        return [false, msg];
    }
    else {
        document.getElementById("cfmpasswdError").innerHTML = '';
    }
    return [true, msg];
}

function validateBeforeSubmission() {
    var msg = "";
    var validity;
    var validAccountName = validateAccountName();
    var validEmail = validateEmail();
    var validFirst = validateName("first");
    var validLast = validateName("last");
    var validPhone = validatePhoneNumber();
    var validPasswd = validatePassword();
    var confirmPasswd = confirmPassword();
    
    if(!validAccountName[0]) {
        msg = validAccountName[1];
        validity = false;
    }
    else if(!validEmail[0]) {
        msg = validEmail[1];
        validity = false;
    }
    else if(!validFirst[0]) {
        msg = validFirst[1];
        validity = false;
    }
    else if(!validLast[0]) {
        msg = validLast[1];
        validity = false;
    }
    else if(!validPhone[0]) {
        msg = validPhone[1];
        validity = false;
    }
    else if(!validPasswd[0]) {
        msg = validPasswd[1];
        validity = false;
    }
    else if(!confirmPasswd[0]) {
        msg = confirmPasswd[1];
        validity = false;
    }
    else {
        validity = true;
    }
    return [validity, msg];
}

function makeRegistrationRequest() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://wrcc.dri.edu/pass', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var acct_name = document.getElementById('acct_name').value,
        email = document.getElementById('email').value,
        first = document.getElementById('first').value,
        last = document.getElementById('last').value;
        phone = document.getElementById('phone').value;
        passwd = document.getElementById('passwd').value;

    var validSubmission = validateBeforeSubmission();
    if(!validSubmission[0]) {
        triggerModalAlert(validSubmission[1]);
    }
    else {
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var response = JSON.parse(xhr.response);
                if(response.status == "ERR") {
                    triggerModalAlert("Account creation unsuccessful. " + response.msg);
                    reloadPageOnButtonTrigger("okBtn");
                }
                else if(response.status == "OK") {
                    triggerModalAlert("Account created successfully. " + response.msg + "<br>\u2022 Session ID: " + response.session_id + "<br>\u2022 Timeout: " + response.timeout);
                    reloadPageOnButtonTrigger("okBtn");
                }
            }
        }  
    }
    
    var registrationInformation = JSON.stringify({"session_id": "",
                                                  "svc": "acct",
                                                  "subsvc": "acct_create",
                                                  "acct_name": acct_name,
                                                  "email": email,
                                                  "first": first,
                                                  "last": last,
                                                  "phone": phone,
                                                  "passwd": passwd})

    xhr.send(registrationInformation);
}