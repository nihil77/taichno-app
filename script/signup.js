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
    const name = user.name; // Replace with the actual user's name
    const email = user.email; // Use the email from the user object

    // Construct the URL with user data as parameters
    const userProfileUrl = `userProfile.html?name=${name}&email=${email}`;

    console.log("User logged in:", user);
    
    // Redirect the user to the user profile page with parameters
    window.location.href = userProfileUrl;
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
}

function hideErrorSignUpMessage() {
  const errorMessageElement = document.getElementById('error-message-signup');
  errorMessageElement.textContent = '';
  errorMessageElement.style.display = 'none'; // Hide the error message
  errorMessageElement.style.color = 'red';
}

// Sign-up Form
const signUpForm = document.querySelector('.sign-up-form');
const nameInput = signUpForm.querySelector('input[type="text"]');
const emailInput = signUpForm.querySelector('input[type="email"]');
const passwordInput = signUpForm.querySelector('input[type="password"]');

signUpForm.addEventListener('submit', function (event) {
  event.preventDefault();

  hideErrorSignUpMessage(); // Clear any previous error message

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);

      // Redirect the user to the user profile page with parameters
      window.location.href = "signup.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      displayErrorSignUpMessage("An error occurred. Please try again later.");
    });
});


// Listen for the browser's back button event
window.addEventListener('popstate', function(event) {
  if (event.state != null) {
    window.location.href = 'Home.html'; 
  }
});

// Push a state to the browser's history to enable the popstate event
history.pushState({}, '');

