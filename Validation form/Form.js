const form = document.getElementById("registration-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("password2");
form.addEventListener("submit", function(event){
event.preventDefault();
const isrequiredvalid = checkRequired([username , email , password , confirmPassword]);
let isformvalid = isrequiredvalid;


if(isrequiredvalid){
  const isusernamevalid = checkLength(username , 4 ,16);
  const isemailvalid = checkEmail (email);
  const ispasswordvalid = checkLength(password , 6 ,25);
  const isconfirmPasswordvalid = checkpasswordsmatch(password,confirmPassword);
      isformvalid = isusernamevalid && isemailvalid && ispasswordvalid && isconfirmPasswordvalid;
}


  if (isformvalid) {
    alert("Successfully registerd👋!");
    form.reset();
    document.querySelectorAll(".form-group").forEach((group) => {
      group.className = "form-group";
    });
  }
  });
function checkLength(input , min , max){
  if(input.value.length < min){
    showError(input, `${formatValidName(input)} must be at least ${min} characters.`)
  return false;
  } else if (input.value.length > max) {
    showError(input, `${formatValidName(input)} must be less than ${max} characters.`);
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}


function checkEmail(email){
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(emailregex.test(email.value.trim())){
    showSuccess(email);
    return true;
  } else{
    showError(email, "Email not valid");
    return false;
  }
}

function checkpasswordsmatch(pass1, pass2){
  if (pass1.value !== pass2.value ){
    showError(pass2, "passwords not matched");
    return false;
  } return true;
}

function formatValidName(input){
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}
function checkRequired(inputArray) {
  let isValid = true;

  inputArray.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${formatValidName(input)} is required`);
      isValid = false;
    } else {
      showSuccess(input);
    }
  });

  return isValid;
}

function showError(input, message) {
  const formGroup = input.parentElement;
  formGroup.className = "form-group error";
  const small = formGroup.querySelector("small");
  small.innerText = message;
}

function showSuccess(input) {
  const formGroup = input.parentElement;
  formGroup.className = "form-group success";
}