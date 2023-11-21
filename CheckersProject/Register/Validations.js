const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 15

const MIN_EMAIL_LENGTH = 6;

const MIN_ATSIGN_INDEX = 2;

const firstNameBox = document.getElementById("fname");
const lastNameBox = document.getElementById("lname");
const emailBox = document.getElementById("email");

const firstNameErrors = document.getElementById("fname-errors");
const lastNameErrors = document.getElementById("lname-errors");
const emailErrors = document.getElementById("email-errors");


/**
 * Checks if the form is valid
 */
function checkForm() {
    var AreNamesValid = validateName();
    var IsEmailValid = validateEmail();

    return (AreNamesValid && IsEmailValid);
}


/**
 * Resets the error boxes
 */
function resetErorrBoxes() {
    firstNameErrors.innerHTML = "";
    lastNameErrors.innerHTML = "";
    emailErrors.innerHTML = "";
}


/**
 * Adds an error to the given error box
 * @param {HTMLElement} errorBox - The error box to add the error message
 * @param {string} error         - The error message to add to the error box
 */
function addBoxError(errorBox, error) {
    errorBox.innerHTML += "* " + error + "<br>";
}


/**
 * Validates the first and last name
 * @returns {boolean} - True if both names are valid, False otherwise
 */
function validateName() {
    var isFirstNameValid = true;
    var isLastNameValid = true;

    // Validating first name length
    if ((firstNameBox.value.length < MIN_NAME_LENGTH) || (firstNameBox.value.length > MAX_NAME_LENGTH)) {
        firstNameBox.value = "";
        addBoxError(firstNameErrors, "First name must be between " + MIN_NAME_LENGTH + " and " + MAX_NAME_LENGTH + " characters");
        isFirstNameValid = false;
    }

    // validating last name length
    if ((lastNameBox.value.length < MIN_NAME_LENGTH) || (lastNameBox.value.length > MAX_NAME_LENGTH)) {
        lastNameBox.value = "";
        addBoxError(lastNameErrors, "Last name must be between " + MIN_NAME_LENGTH + " and " + MAX_NAME_LENGTH + " characters");
        isLastNameValid = false;
    }

    return (isFirstNameValid && isLastNameValid);
}


/**
 * Validates the email address
 * @returns {boolean} - True if email address is valid, False otherwise
 */
function validateEmail() {
    var areCharactersValid = true;
    var isEmailLengthValid = true;
    var isAtSignValid = true;
    var isDotValid = true;

    // Validating email characters
    var invalidCharacters = "!\"#$%& \'()*+,/:;<=>?[\\]^_`{|}";
    for (var i = 0; i < invalidCharacters.length; i++) {
        if (emailBox.value.indexOf(invalidCharacters[i]) != -1) {
            addBoxError(emailErrors, "Email contains invalid characters characters");
            areCharactersValid = false;
            break;
        }
    }

    // Validating email length
    if (emailBox.value.length < MIN_EMAIL_LENGTH) {
        addBoxError(emailErrors, "Email must be at least 6 characters");
        isEmailLengthValid = false;
    }

    // Validating the '@' sign
    if (emailBox.value.indexOf("@") == -1) {
        addBoxError(emailErrors, "Email must contain '@'");
        isAtSignValid = false;
    }
    else {
        if (emailBox.value.indexOf("@") != emailBox.value.lastIndexOf("@")) {
            addBoxError(emailErrors, "Email must contain only one '@'");
            isAtSignValid = false;
        }
        if ((emailBox.value.indexOf("@") < MIN_ATSIGN_INDEX) || (emailBox.value.indexOf("@") == emailBox.value.length - 1)) {
            addBoxError(emailErrors, "At sign cannot be used in the first two or last characters of an email address")
            isAtSignValid = false;
        }
    }

    // Validating the '.' sign
    if (emailBox.value.indexOf(".") == -1) {
        addBoxError(emailErrors, "Email must contain '.'");
        isDotValid = false;
    }
    else {
        if ((emailBox.value.indexOf(".") - emailBox.value.indexOf("@") <= 2) && (emailBox.value.indexOf(".") - emailBox.value.indexOf("@") >= -2)) {
            addBoxError(emailErrors, "Dot must be at least two characters away from '@'");
            isDotValid = false;
        }
        if ((emailBox.value.indexOf(".") == emailBox.value.length - 1) || (emailBox.value.indexOf(".") == 0)) {
            addBoxError(emailErrors, "Dot cannot be the first or last character of an email address");
            isDotValid = false;
        }

        // Checking if there are multiple dots in a row in the email address
        var emailAddress = emailBox.value;
        for (var i = 0; i < emailAddress.length - 1; i++) {
            if (emailAddress[i] == '.' && emailAddress[i + 1] == '.') {
                addBoxError(emailErrors, "Dots cannot apear one after another");
                isDotValid = false;
                break;
            }
        }
    }

    return (areCharactersValid && isEmailLengthValid && isAtSignValid && isDotValid);
}
