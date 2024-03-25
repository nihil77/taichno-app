const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");


inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value !== "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

function moveSlider() {
  let index = this.dataset.value;

  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  this.classList.add("active");
}

bullets.forEach((bullet) => {
  bullet.addEventListener("click", moveSlider);
});


// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnWbrjWukZRLmPF6uWqR4Wo_3m-rtz2hI",
  authDomain: "web-tai-6ebaa.firebaseapp.com",
  databaseURL: "https://web-tai-6ebaa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web-tai-6ebaa",
  storageBucket: "web-tai-6ebaa.appspot.com",
  messagingSenderId: "149766567228",
  appId: "1:149766567228:web:202ecd644d35a3c251da39"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth()

// Function to handle displaying error messages
function displayErrorMessage(message) {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = 'block'; // Display the error message
}

// Function to clear the error message
function clearErrorMessage() {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = '';
  errorMessageElement.style.display = 'none'; // Hide the error message
  errorMessageElement.style.color = 'red';
}

// Sign-in Form
const signInForm = document.querySelector('.sign-in-form');
const emailLoginInput = signInForm.querySelector('input[type="email"]');
const passwordLoginInput = signInForm.querySelector('input[type="password"]');

// Save user input to localStorage on form submission
signInForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  // Get user input
  const email = emailLoginInput.value;
  const password = passwordLoginInput.value;

  // Save user input to localStorage
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userPassword', password);

});

// Add event listeners to clear the error message when input fields receive focus
emailLoginInput.addEventListener('focus', clearErrorMessage);
passwordLoginInput.addEventListener('focus', clearErrorMessage);

signInForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = emailLoginInput.value;
  const password = passwordLoginInput.value;

  auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          const user = userCredential.user;

          // Check if the email is admin's email
          if (email === "taichno@tai.com") {
              // Redirect the admin to a different HTML page
              window.location.href = "userAdmin.html";
          } else {
              const name = user.name; // Replace with the actual user's name
              const userEmail = user.email; // Use the email from the user object

              // Construct the URL with user data as parameters
              const userProfileUrl = `userProfile.html?name=${name}&email=${userEmail}`;

              console.log("User logged in:", user);

              // Redirect the user to the user profile page with parameters
              window.location.href = userProfileUrl;
          }
      })
      .catch((error) => {
          console.error("Error:", error);
          displayErrorMessage("Invalid email or password. Please try again.");
      });
});



// SIGN UP FORM

// Function to handle displaying and hiding the error message
function displayErrorSignUpMessage(message) {
  const errorMessageElement = document.getElementById('error-message-signup');
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = 'block'; // Show the error message
  errorMessageElement.style.color = 'red';

  // Clear form fields on error
  nameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';
  confirmPasswordInput.value = '';
}

function hideErrorSignUpMessage() {
  const errorMessageElement = document.getElementById('error-message-signup');
  errorMessageElement.textContent = '';
  errorMessageElement.style.display = 'none'; // Hide the error message
}

const signUpForm = document.querySelector('.sign-up-form');
const nameInput = signUpForm.querySelector('input[type="text"]');
const emailInput = signUpForm.querySelector('input[type="email"]');
const passwordInput = signUpForm.querySelector('input[type="password"]');
const confirmPasswordInput = signUpForm.querySelector('#confirmPasswordInput');

// Event listener to hide error message when user starts typing
nameInput.addEventListener('input', hideErrorSignUpMessage);
emailInput.addEventListener('input', hideErrorSignUpMessage);
passwordInput.addEventListener('input', hideErrorSignUpMessage);
confirmPasswordInput.addEventListener('input', hideErrorSignUpMessage);

// Event listener to toggle password visibility when focused
//passwordInput.addEventListener('focus', function () {
  //passwordInput.type = 'text';
//});

// Event listener to reset password input type after typing
//passwordInput.addEventListener('blur', function () {
 // passwordInput.type = 'password';
//});

signUpForm.addEventListener('submit', function (event) {
  event.preventDefault();

  hideErrorSignUpMessage(); // Clear any previous error message

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // check the passwords match
  if (password !== confirmPassword) {
    displayErrorSignUpMessage("Passwords do not match.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);

      // Redirect the user to the user profile page with parameters
      window.location.href = "signup.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      displayErrorSignUpMessage("An error occurred. Try again.");
    });
});


// Listen for the browser's back button event
window.addEventListener('popstate', function(event) {
  if (event.state != null) {
    window.location.href = 'index.html'; 
  }
});

// Push a state to the browser's history to enable the popstate event
history.pushState({}, '');

