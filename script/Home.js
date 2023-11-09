// Select The Elements
var toggle_btn;
var big_wrapper;
var hamburger_menu;

function declare() {
  toggle_btn = document.querySelector(".toggle-btn");
  big_wrapper = document.querySelector(".big-wrapper");
  hamburger_menu = document.querySelector(".hamburger-menu");
}

const main = document.querySelector("main");

declare();

let dark = false;

function toggleAnimation() {
  // Clone the wrapper
  dark = !dark;
  let clone = big_wrapper.cloneNode(true);
  if (dark) {
    clone.classList.remove("light");
    clone.classList.add("dark");
  } else {
    clone.classList.remove("dark");
    clone.classList.add("light");
  }
  clone.classList.add("copy");
  main.appendChild(clone);

  document.body.classList.add("stop-scrolling");

  clone.addEventListener("animationend", () => {
    document.body.classList.remove("stop-scrolling");
    big_wrapper.remove();
    clone.classList.remove("copy");
    // Reset Variables
    declare();
    events();
  });
}

// Get the link element by its ID
const signupLink = document.getElementById('signupLink');
const get_started = document.getElementById('get_startetd');

// Add a click event listener to the link
signupLink.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default behavior (navigating to the href)
  
  // Define the URL you want to navigate to
  const url = 'signup.html'; // Replace with your desired URL

  // Navigate to the specified URL
  window.location.href = url;
});


// JavaScript to open another HTML page when the "Get started" link is clicked
document.getElementById('get_started').addEventListener('click', function (event) {
  event.preventDefault();  // Prevent the default behavior of the link (i.e., navigating to #)

  // Specify the URL of the HTML page you want to open
  const newPageUrl = 'signup.html';

  // Redirect the user to the new HTML page
  window.location.href = newPageUrl;
});
