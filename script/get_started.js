
document.getElementById('next').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').appendChild(lists[0]);
}
document.getElementById('prev').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').prepend(lists[lists.length - 1]);
}

// Add event listeners for each button
// Add if the user click another stances
for (let i = 1; i <= 8; i++) {
    const tryNowButton = document.getElementById(`tryNowButton${i}`);
  
    tryNowButton.addEventListener("click", function () {
      // Redirect to the video feed page with a specific identifier
      window.location.href = `http://127.0.0.1:5000?buttonId=${i}`; // Modify the URL as needed
    });
  }
  
  function startFlaskApp(buttonId) {
    // Send a GET request to start the Flask app with the specific button identifier
    fetch(`/start_flask_app?buttonId=${buttonId}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Flask app started successfully.");
        } else {
          console.error("Failed to start Flask app.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  