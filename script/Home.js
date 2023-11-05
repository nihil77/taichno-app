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

function events() {
  toggle_btn.addEventListener("click", toggleAnimation);
  hamburger_menu.addEventListener("click", () => {
    big_wrapper.classList.toggle("active");
  });
}

events();

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


const getStartedLink = document.getElementById('get_started'); // Correct the element ID

getStartedLink.addEventListener('click', function (event){
  event.preventDefault(); 

  const url = 'realtime.html'; // Replace with your desired URL

  window.location.href = url;
});
