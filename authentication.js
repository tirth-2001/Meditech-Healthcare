const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal2');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');
const signOut = document.querySelector('.sign-out');
// toggle auth modals
cbody.innerHTML="";
authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'));
  });
});

// register form
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = registerForm.email.value;
  const password = registerForm.password.value;
    
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      
      console.log(Message+" messages");

    })
    .catch(error => {
      registerForm.querySelector('.error').textContent = error.message;
    });
});

// login form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  cbody.innerHTML="";
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user => {
      colle.innerHTML="";
      console.log('logged in', user);
      loginForm.reset();
    })
    .catch(error => {
      loginForm.querySelector('.error').textContent = error.message;
    });
});

// sign out
signOut.addEventListener('click', () => {
    cbody.innerHTML="";
  firebase.auth().signOut()
    .then(() => {colle.innerHTML="";console.log('signed out')});
});

// auth listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    authWrapper.classList.remove('open');
    authModals.forEach(modal => modal.classList.remove('active'));
  } else {
    authWrapper.classList.add('open');
    authModals[0].classList.add('active');
  }
});