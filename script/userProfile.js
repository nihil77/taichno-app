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



const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})



if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})


const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

// MY PROFILE
function switchToContent(contentId) {
    const homeContent = document.getElementById('homeContent');
    const myProfileContent = document.getElementById('myProfileContent');
    const myInformationContent = document.getElementById('myInformationContent');
    const myHelpSupportContent = document.getElementById('myHelpSupportContent');

    if (contentId === 'homeContent') {
        homeContent.style.display = 'block';
        myProfileContent.style.display = 'none';
        myInformationContent.style.display = 'none';
        myHelpSupportContent.style.display = 'none';
    } else if (contentId === 'myProfileContent') {
        homeContent.style.display = 'none';
        myProfileContent.style.display = 'block';
        myInformationContent.style.display = 'none';
        myHelpSupportContent.style.display = 'none';
    } else if (contentId === 'myInformationContent') {
        homeContent.style.display = 'none';
        myProfileContent.style.display = 'none';
        myInformationContent.style.display = 'block';
        myHelpSupportContent.style.display = 'none';
    } else if (contentId === 'myHelpSupportContent') {
        homeContent.style.display = 'none';
        myProfileContent.style.display = 'none';
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
        
            // If user confirms, redirect to the home screen (replace with your actual URL)
            window.location.href = "Home.html";

    });
       
});

  