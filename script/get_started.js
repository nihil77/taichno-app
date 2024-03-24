
document.getElementById('next').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').appendChild(lists[0]);
}
document.getElementById('prev').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').prepend(lists[lists.length - 1]);
}


// Function to open another HTML page and set the panel-heading
function openAnotherPage(buttonId) {
    // Get the button element
    const button = document.getElementById(buttonId);
  
    // Add a click event listener to the button
    button.addEventListener('click', function () {
      // Get the classname of the clicked button
      const className = button.getAttribute('data-class');
  
      // Replace 'pose.html' with the actual HTML page you want to open
      window.location.href = `pose.html?className=${className}`;
    });
}

// Call the function for each "Try Now" button
openAnotherPage('tryNowButton1');
openAnotherPage('tryNowButton2');
openAnotherPage('tryNowButton3');
openAnotherPage('tryNowButton4');
openAnotherPage('tryNowButton5');
openAnotherPage('tryNowButton6');
openAnotherPage('tryNowButton7');
openAnotherPage('tryNowButton8');


// Function to go back to the previous HTML page or navigate to another HTML page
function goBack(destinationURL) {
  if (destinationURL) {
      // Navigate to the specified destination URL
      window.location.href = destinationURL;
  } else {
      // Go back to the previous page in the browser's history
      window.history.back();
  }
}

