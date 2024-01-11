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
  
  const url = 'signup.html'; 

  // Navigate to the specified URL
  window.location.href = url;
});


// JavaScript to open another HTML page when the "Get started" link is clicked
document.getElementById('get_started').addEventListener('click', function (event) {
  event.preventDefault();  

  // Specify the URL of the HTML page you want to open
  const newPageUrl = 'signup.html';

  // Redirect the user to the new HTML page
   window.location.href = newPageUrl;
});


document.addEventListener('DOMContentLoaded', function () {
  const toastLiveExample = document.getElementById('liveToast');
  const toastBootstrap = new bootstrap.Toast(toastLiveExample);

  const readMoreBtn = document.getElementById('readMoreBtn');
  if (readMoreBtn) {
    readMoreBtn.addEventListener('click', () => {
      toggle('myModal1', 'blur-container'); // Assuming 'blur-container' is the correct ID
      toastBootstrap.show();
    });
  }
});

function toggle(modalId, blurContainerId) {
  var modal = document.getElementById(modalId);
  var blurContainer = document.getElementById(blurContainerId);

  // Get the computed style of the modal
  var computedStyle = window.getComputedStyle(modal);

  modal.style.display = (computedStyle.display === 'none' || computedStyle.display === '') ? 'block' : 'none';

  // Apply or remove blur class based on the modal's display
  if (blurContainer) {
    blurContainer.classList.toggle('blur-background', modal.style.display === 'block');
  }
}


// JavaScript function to scroll to the top of the page
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Show/hide scroll-to-top button based on scroll position
window.onscroll = function () {
  var scrollButton = document.querySelector('.scroll-to-top');
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollButton.style.display = 'block';
  } else {
    scrollButton.style.display = 'none';
  }
};