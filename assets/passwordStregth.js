var upperCase = "AĄBCĆDEĘFGHIJKLŁMNOÓPQRSŚTUVWXYZŻŹ";
var lowerCase = "aąbcćdeęfghijklłmnoópqrsśtuvwxyzźż";
var number = "0123456789";
var specialCharacters = "!@#$%^&*?_~"


function checkPassword() {
    var nScore = 0;

    // Length
    if (password.length < 5) {
        nScore += 5;
    } else if (password.length > 4 && password.length < 8) {
        nScore += 10;
    } else if (password.length > 7) {
        nScore += 25;
    }
    // Letters
    var nUpperCount = countContain(password, upperCase);
    var nLowerCount = countContain(password, lowerCase);
    var nLowerUpperCount = nUpperCount + nLowerCount;
    // all lower case or all upper case
    if ((nUpperCount == 0 && nLowerCount != 0) || (nLowerCount == 0 && nUpperCount != 0)) {
        nScore += 10;
    }
    // both
    else if (nUpperCount != 0 && nLowerCount != 0) {
        nScore += 20;
    }

    // Numbers
    var nNumberCount = countContain(password, number);
    if (nNumberCount == 1) {
        nScore += 10;
    }
    if (nNumberCount >= 3) {
        nScore += 20;
    }

    // Characters
    var nCharacterCount = countContain(password, specialCharacters);
    if (nCharacterCount == 1) {
        nScore += 10;
    }
    if (nCharacterCount > 1) {
        nScore += 25;
    }

    // Bonus
    // letters and numbers
    if (nNumberCount != 0 && nLowerUpperCount != 0) {
        nScore += 2;
    }
    // letters, numbers & characters
    if (nNumberCount != 0 && nLowerUpperCount != 0 && nCharacterCount != 0) {
        nScore += 3;
    }
    // both case case letters, numbers, and characters
    if (nNumberCount != 0 && nUpperCount != 0 && nLowerCount != 0 && nCharacterCount != 0) {
        nScore += 5;
    }
    return nScore;
}



function runPassword(password, strFieldID) {
    // Checkpassword
    var nScore = checkPassword(password);


    // Get controls
    var ctlBar = document.getElementById(strFieldID + "_bar");
    var ctlText = document.getElementById(strFieldID + "_text");
    if (!ctlBar || !ctlText)
        return;

    // Set new width
    ctlBar.style.width = (nScore * 1.25 > 100) ? 100 : nScore * 1.25 + "%";

    // Color and text
    // -- Very Secure
    /*if (nScore >= 90)
    {
        var strText = "Very Secure";
        var strColor = "#0ca908";
    }
    // -- Secure
    else if (nScore >= 80)
    {
        var strText = "Secure";
        vstrColor = "#7ff67c";
    }
    // -- Very Strong
    else
    */
    if (nScore >= 80) {
        var strText = "Very Strong";
        var strColor = "#008000";
    }
    // -- Strong
    else if (nScore >= 60) {
        var strText = "Strong";
        var strColor = "#006000";
    }
    // -- Average
    else if (nScore >= 40) {
        var strText = "Average";
        var strColor = "#e3cb00";
    }
    // -- Weak
    else if (nScore >= 20) {
        var strText = "Weak";
        var strColor = "#Fe3d1a";
    }
    // -- Very Weak
    else {
        var strText = "Very Weak";
        var strColor = "#e71a1a";
    }

    if (password.length == 0) {
        ctlBar.style.backgroundColor = "";
        ctlText.innerHTML = "";
    } else {
        ctlBar.style.backgroundColor = strColor;
        ctlText.innerHTML = strText;
    }
}

// Checks a string for a list of characters
function countContain(password, strCheck) {
    var nCount = 0;
    for (i = 0; i < password.length; i++) {
        if (strCheck.indexOf(strPassword.charAt(i)) > -1) {
            nCount++;
        }
    }
    return nCount;
}
