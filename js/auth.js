// setup materialize components
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});


let userData = () => { return firebase.auth().currentUser; };
//alert(`User Data Function : ${firebase.auth().currentUser}`)
// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    // db.collection('doctors').doc(user.uid).onSnapshot(snapshot => {
    //
    //   // setupGuides(snapshot.docs);
    //   // setupUI(user);
    //   console.log("Logged In User (auth.js) : " + user.email + ' '+ snapshot.data().name);
    //   // pData(user);
    //   // const user_cred = user;
    //   //showData(user);
    //   //profile(user);
    //
    // });
    //let userData = () => { return firebase.auth().currentUser; };
    //alert("userData Function called : " + userData().uid);
    //console.log(`User Data Alert : ${auth.currentUser.email}`);
    //console.log("Logged In User (auth.js) : " + user.email );
    db.doc(`doctors/${user.uid}`).onSnapshot(snap => { console.log("Logged In User (auth.js) : " + user.email + ' ' +snap.data().name);

    });

  } else {
    document.body.style.backgroundColor = "grey";
    // setupUI();
    // setupGuides([]);
  }
});


// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const name = signupForm['signup-name'].value;

  //alert("Signup Email : "+email);

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log("Sign Up User : "+cred.user.email);
    db.collection('doctors').doc(cred.user.uid).set({
      email: signupForm['signup-email'].value,
      name : signupForm['signup-name'].value
    });
    signupForm.reset();
    window.location = 'user.html';

  }).catch((err) => {toastr.error('', `${err.message}`, {timeOut: 1400, closeButton : false, progressBar : true})});

});






// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  //alert("Login Email : "+email);

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    console.log(cred);
    loginForm.reset();
    window.location='user.html';
    // const modal = document.querySelector('#modal-login');
    // M.Modal.getInstance(modal).close();
    // loginForm.reset();
  }).catch((err) => {toastr.error('', `${err.message}`, {timeOut: 1400, closeButton : false, progressBar : true})});

});

// forgot password
const forgotForm = document.querySelector('#forgot-form');
forgotForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const forgotEmail = forgotForm['forgot-email'].value;

  //alert("Forgot Email : "+ forgotEmail);

  // close the create modal & reset form


  auth.sendPasswordResetEmail(forgotEmail).then(function() {
       alert(`Passowrd Reset Link Sent to : ${forgotEmail}`);
       const modal = document.querySelector('#forgotPassModal');
       M.Modal.getInstance(modal).close();
       forgotForm.reset();
     }).catch(function(error) {
       toastr.error('', `${error.message}`, {timeOut: 1400, closeButton : false, progressBar : true})
       // alert(error.message);
       // console.log(error.message);
     });

});


// logout
const logout1 = document.querySelector('#logout-1');
logout1.addEventListener('click', (e) => {
  e.preventDefault();
  alert(`Logged Out User : ${auth.currentUser.email}`);
  auth.signOut();
});
const logout2 = document.querySelector('#logout-2');
logout2.addEventListener('click', (e) => {
  e.preventDefault();
  alert(`Logged Out User : ${auth.currentUser.email}`);
  auth.signOut();
});
