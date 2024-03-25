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
   

    if (contentId === 'homeContent') {
        homeContent.style.display = 'block';
        myProfileContent.style.display = 'none';
    } else if (contentId === 'myProfileContent') {
        homeContent.style.display = 'none';
        myProfileContent.style.display = 'block';
    } else if (contentId == 'myKnowledgeNest') {
      homeContent.style.display = 'none';
      myProfileContent.style.display = 'none';
    }

}


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

  document.getElementById("uploadVideo").addEventListener("click", function() {
	document.getElementById("fileUpload").click();
});

// VIDEO UPLOAD
document.getElementById('fileUpload').addEventListener('change', function(e) {
    const fileList = e.target.files;
    const uploadedVideoContainer = document.getElementById('uploadedVideoContainer');
    
    if (fileList.length > 0) {
        const file = fileList[0];
        
        // Clear existing content in uploadedVideoContainer
        uploadedVideoContainer.innerHTML = '';
        
        // Create a video element
        const videoElement = document.createElement('video');
        videoElement.controls = true;
        videoElement.width = 640;
        videoElement.height = 360;
        
        // Create a source element and set its src attribute
        const sourceElement = document.createElement('source');
        sourceElement.src = URL.createObjectURL(file);
        sourceElement.type = file.type;
        
        // Append the source element to the video element
        videoElement.appendChild(sourceElement);
        
        // Append the video element to the uploadedVideoContainer
        uploadedVideoContainer.appendChild(videoElement);
        
        // Update placeholder text
        uploadedVideoContainer.querySelector('h4').style.display = 'none';
    } else {
        // If no file selected, display a message
        uploadedVideoContainer.innerHTML = '<h4>No video uploaded</h4>';
    }
});


// JavaScript code
document.addEventListener('DOMContentLoaded', function () {
    // Get the number of completed and total activities
    var completedActivities = document.querySelectorAll('.todo-list .completed').length;
    var totalActivities = document.querySelectorAll('.todo-list li').length;

    // Calculate the percentage of completed activities
    var completedPercentage = (completedActivities / totalActivities) * 100;

    // Get the canvas element for user activities chart
    var ctxActivities = document.getElementById('userActivitiesChart').getContext('2d');

    // Create the pie chart for user activities
    var activitiesChart = new Chart(ctxActivities, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                label: 'Activity Completion',
                data: [completedPercentage, 100 - completedPercentage],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)', // Blue for completed
                    'rgba(255, 99, 132, 0.6)'  // Red for remaining
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: '#333',
                    fontSize: 14
                }
            },
            title: {
                display: true,
                text: 'Activity Completion',
                fontSize: 18,
                fontColor: '#333'
            }
        }
    });

    // Sample data for stance activities
    var stanceActivitiesData = [20, 35, 40, 45, 55, 60, 70, 80]; // Example data

    // Get the canvas element for stance activities chart
    var ctxStanceActivities = document.getElementById('userStanceActivitiesChart').getContext('2d');

    // Create the bar chart for stance activities
    var stanceActivitiesChart = new Chart(ctxStanceActivities, {
        type: 'bar',
        data: {
            labels: ['Stance 1', 'Stance 2', 'Stance 3', 'Stance 4', 'Stance 5', 'Stance 6', 'Stance 7', 'Stance 8'],
            datasets: [{
                label: 'Stance Activities',
                data: stanceActivitiesData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green color
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#333' // Adjust font color
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#333' // Adjust font color
                    }
                }]
            },
            title: {
                display: true,
                text: 'Stance Activities',
                fontSize: 18,
                fontColor: '#333'
            }
        }
    });
});

