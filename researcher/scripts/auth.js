var googleSignIn = document.querySelector('#googleSignIn');
var icon_telephone = document.querySelector('#icon_telephone');
var verify = document.querySelector('#verify');
var formVerify = document.querySelector('#form');

// window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
//   'size': 'invisible',
//   'callback': function(response) {
//     // reCAPTCHA solved, allow signInWithPhoneNumber.
//     onSignInSubmit();
//     console.log("captcha verified");
//   }
// });


window.onload=function () {
  render();
};
function render() {
    window.recaptchaVerifier=new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  'size': 'invisible' });
    recaptchaVerifier.render();
    // console.log("captcha rendered");
}

auth.onAuthStateChanged(user => {
  if(user){
    console.log("Logged In User (researcher auth.js): "+user.uid);
  }

  else{
    console.log("No user logged in");
  }
})


googleSignIn.addEventListener('click', (e) => {
  var provider = new firebase.auth.GoogleAuthProvider();
    //Login with popup window
    firebase.auth().signInWithPopup(provider).then(function () {
        //code executes after successful login

        window.location="researcher.html";
    }).catch((err) => {
      toastr.error('', `${err.message}`, {timeOut: 1400, closeButton : false, progressBar : true})
      // alert(err.message);
    });
})

function toogleCard() {
    // alert("toogle Card called");
    let maincard = document.getElementById('mainCard');
    let otpcard = document.getElementById('otpCard');
    let number = document.getElementById('icon_telephone').value;
    console.log(number);
    if (otpcard.classList.contains('isOpen') === false) {
      // console.log("inside if 1");
        if (number == "" || number == null) {
            M.toast({
                html: 'Enter a Valid Number!',
                classes: "errorMsg"
            })
            return;
        }
        if (number.length != 10) {
            M.toast({
                html: 'Number must be a 10 digit number!',
                classes: "errorMsg"
            })
            return;
        }
        var mobile = "+91"+number;
        firebase.auth().signInWithPhoneNumber(mobile,window.recaptchaVerifier).then(function (confirmationResult) {
        //s is in lowercase
        window.confirmationResult=confirmationResult;
        coderesult=confirmationResult;
        // console.log(coderesult);
        console.log("message sent");
        // alert("Message sent");
        }).catch(function (error) {
        alert(error.message);
        });
    }
    // else {
      otpcard.classList.toggle('isOpen');
      document.getElementById('otpNumber').innerHTML = "+91 " + number;
    // }

}

var verifycode = document.querySelector('#verifycode');
verifycode.addEventListener('click', (e) => {
  e.preventDefault();
  // alert("verifycode clicked");

  var n1 = formVerify['n1'].value;
  var n2 = formVerify['n2'].value;
  var n3 = formVerify['n3'].value;
  var n4 = formVerify['n4'].value;
  var n5 = formVerify['n5'].value;
  var n6 = formVerify['n6'].value;

  var code = n1+n2+n3+n4+n5+n6;
  // var code = Number(code);
  console.log("Entered Code : "+code);

  coderesult.confirm(code).then(function (result) {
      window.location = 'researcher.html';
      // alert("Successfully registered");
      // var user=result.user;
      // console.log(user);
  }).catch(function (error) {
      alert(error.message);
  });
})

//
// function codeverify(el) {
//     el.preventDefault();
//     var n1 = formVerify['n1'].value;
//     var n2 = formVerify['n2'].value;
//     var n3 = formVerify['n3'].value;
//     var n4 = formVerify['n4'].value;
//     var n5 = formVerify['n5'].value;
//     var n6 = formVerify['n6'].value;
//
//     var code = n1+n2+n3+n4+n5+n6;
//     // var code = Number(code);
//     console.log("Entered Code : "+code);
//     // console.log(typeof code);
//
//     // var code=document.getElementById('verificationCode').value;
//     coderesult.confirm(code).then(function (result) {
//         window.location = 'researcher.html';
//         // alert("Successfully registered");
//         // var user=result.user;
//         // console.log(user);
//     }).catch(function (error) {
//         alert(error.message);
//     });
// }
