const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

// MY PROFILE switch To content
function switchToContent(contentId) {
    const homeContent = document.getElementById('homeContent');
    const myProfileContent = document.getElementById('myProfileContent');
    const myInformationContent = document.getElementById('myInformationContent');
    const myHelpSupportContent = document.getElementById('myHelpSupportContent');
    const mymyKnowledgeNest = document.getElementById('myKnowledgeNest');

    if (contentId === 'homeContent') {
        homeContent.style.display = 'block';
        myProfileContent.style.display = 'none';
        mymyKnowledgeNest.style.display = 'none';
        myInformationContent.style.display = 'none';
        myHelpSupportContent.style.display = 'none';
    } else if (contentId === 'myProfileContent') {
        homeContent.style.display = 'none';
        myProfileContent.style.display = 'block';
        mymyKnowledgeNest.style.display = 'none';
        myInformationContent.style.display = 'none';
        myHelpSupportContent.style.display = 'none';
    } else if (contentId == 'myKnowledgeNest') {
      homeContent.style.display = 'none';
      myProfileContent.style.display = 'none';
      mymyKnowledgeNest.style.display = 'block';
      myInformationContent.style.display = 'none';
      myHelpSupportContent.style.display = 'none';
    }
    else if (contentId === 'myInformationContent') {
        homeContent.style.display = 'none';
        myProfileContent.style.display = 'none';
        mymyKnowledgeNest.style.display = 'none';
        myInformationContent.style.display = 'block';
        myHelpSupportContent.style.display = 'none';
    } else if (contentId === 'myHelpSupportContent') {
        homeContent.style.display = 'none';
        myProfileContent.style.display = 'none';
        mymyKnowledgeNest.style.display = 'none';
        myInformationContent.style.display = 'none';
        myHelpSupportContent.style.display = 'block';
    } 
}

// Get the parameters from the URL
const params = new URLSearchParams(window.location.search);
const email = params.get("email");

// Extract the username from the email
const emailParts = email.split("@");
let username = emailParts[0];

// Capitalize the first letter of the username
username = username.charAt(0).toUpperCase() + username.slice(1);

// Display the user data
const nameDisplay = document.getElementById("user-name-display");
const emailDisplay = document.getElementById("user-email-display");

nameDisplay.textContent = username;
emailDisplay.textContent = email;

// Array of predefined quotes or statements
const bioQuotes = [
    "Live life to the fullest.",
    "In every difficulty, there's an opportunity.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Dream big and dare to fail.",
    "The journey of a thousand miles begins with one step.",
    "Believe you can and you're halfway there.",
    "Your time is limited, don't waste it living someone else's life.",
    "The future belongs to those who believe in the beauty of their dreams."
  ];
  
  // Function to generate a random bio quote
  function generateRandomBioQuote() {
    const randomIndex = Math.floor(Math.random() * bioQuotes.length);
    return bioQuotes[randomIndex];
  }
  
  // Example usage to generate a random bio quote
  const randomBioQuote = generateRandomBioQuote();
  
  // Display the generated bio quote
  const bioDisplay = document.getElementById("user-bio-display");
  bioDisplay.textContent = randomBioQuote;


  // User Logout
document.addEventListener("DOMContentLoaded", function() {
  // Get the "Logout" link element
  const logoutLink = document.querySelector(".logout-link a");

  // Add a click event listener to the "Logout" link
  logoutLink.addEventListener("click", function(event) {
      event.preventDefault(); // Prevent the default link behavior

      // If user confirms, redirect to the home screen
      if (confirm("Are you sure you want to log out?")) {
          // Clear all activity or perform necessary logout actions
          
          // Manipulate browser history to clear previous pages
          history.pushState(null, null, "signup.html");
          
          // Redirect to the home screen
          window.location.href = "signup.html";
      }
  });
});


document.addEventListener("DOMContentLoaded", function() {
  // Get the parameters from the URL
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  // Extract the username from the email
  const emailParts = email.split("@");
  let username = emailParts[0];

  // Capitalize the first letter of the username
  username = username.charAt(0).toUpperCase() + username.slice(1);

  // Display the user data including background color
  const nameDisplay = document.getElementById("user-name-display");
  const emailDisplay = document.getElementById("user-email-display");

  nameDisplay.textContent = username;
  emailDisplay.textContent = email;

  // Apply green background color to user name if the user's name is 'John'
  if (username === 'John') {
      nameDisplay.style.backgroundColor = 'var(--green)';
  }

  // Define the completion status for each stance based on the user
  let completionStatus = {};
  if (username === 'John') {
      completionStatus = {
          "Horse Stance": 100,
          "Bow-Arrow": 100,
          "Sitting on Crossed Legs": 100,
          "Four-Six": 100,
          "Tame the Tiger": 0,
          "False Stance": 0,
          "Golden Rooster Stance": 0,
          "Squat Stance": 0

      };
  } else {
      completionStatus = {
          "Horse Stance": 0,
          "Bow-Arrow": 0,
          "Sitting on Crossed Legs": 0,
          "Four-Six": 0,
          "Tame the Tiger": 0,
          "False Stance": 0,
          "Golden Rooster Stance": 0,
          "Squat Stance": 0
      };
  }

  // Get all todo items
  const todoItems = document.querySelectorAll(".todo-list li");

  // Loop through each todo item
  todoItems.forEach(item => {
      // Get the name of the stance from the todo item
      const stanceName = item.querySelector("p").textContent;

      // Find the corresponding completion percentage
      const percentage = completionStatus[stanceName];

      // Update the progress bar with the calculated percentage
      const progressBar = item.querySelector(".progress-bar .percentage");
      progressBar.textContent = `${percentage}%`;
      progressBar.style.width = `${percentage}%`;

      // Update the class of the todo item based on completion status
      if (percentage === 100) {
          item.classList.add("completed");
          item.classList.remove("not-completed");
      } else {
          item.classList.add("not-completed");
          item.classList.remove("completed");
      }

      // Apply background color to todo items if the user is 'John'
      if (username === 'John' && percentage === 100) {
          item.style.backgroundColor = 'var(--green)';
      }
  });
});


function toggleAccordion(element) {
    var accordionContent = element.nextElementSibling;
    if (accordionContent.style.display === "none") {
        accordionContent.style.display = "block";
    } else {
        accordionContent.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Get all the <td> elements containing the date
    const dateCells = document.querySelectorAll("tbody td:nth-child(2)");

    // Get today's date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const currentDate = `${dd}-${mm}-${yyyy}`;

    // Update each date cell with today's date
    dateCells.forEach(cell => {
      cell.textContent = currentDate;
    });
  });