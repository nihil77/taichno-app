document.addEventListener('DOMContentLoaded', () => {
  const video5 = document.createElement('video');
  video5.autoplay = true;
  video5.className = 'input_video5';

  const out5 = document.getElementsByClassName('output5')[0];
  const controlsElement5 = document.getElementsByClassName('control5')[0];
  const canvasCtx5 = out5.getContext('2d');

  const fpsControl = new FPS();

  const spinner = document.querySelector('.loading');

  // Show the loading spinner
  function showLoadingSpinner() {
    spinner.style.display = 'block';
  }

  // Hide the loading spinner
  function hideLoadingSpinner() {
    spinner.style.display = 'none';
  }

  // Simulate loading data
  function loadData() {
    showLoadingSpinner();

    setTimeout(function() {
      hideLoadingSpinner();
    }, 2000); 
  }

  loadData();

  // Function to calculate color based on depth
  function zColor(data) {
    const z = clamp(data.from.z + 0.5, 0, 1);
    return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
  }


  const TOLERANCE = 0.3; // tolerance value
  
  // Function to validate Horse Stance
  function validateHorseStance(poseLandmarks, image) {
    // Check if poseLandmarks object is provided
    if (!poseLandmarks) {
        return false; // Pose landmarks are not available
    }

    // Check if key landmarks are present in the poseLandmarks object
    if (
        !('LEFT_SHOULDER' in poseLandmarks) ||
        !('RIGHT_SHOULDER' in poseLandmarks) ||
        !('LEFT_HIP' in poseLandmarks) ||
        !('RIGHT_HIP' in poseLandmarks) ||
        !('LEFT_KNEE' in poseLandmarks) ||
        !('RIGHT_KNEE' in poseLandmarks) ||
        !('LEFT_ANKLE' in poseLandmarks) ||
        !('RIGHT_ANKLE' in poseLandmarks)
    ) {
        return true; // Some landmarks are missing
    }

    // Check if knees are bent
    const isKneesBent = poseLandmarks.LEFT_KNEE.y < poseLandmarks.LEFT_HIP.y &&
        poseLandmarks.RIGHT_KNEE.y < poseLandmarks.RIGHT_HIP.y;

    // Check if feet and hip alignment is maintained
    const isFootAndHipAligned = Math.abs(poseLandmarks.LEFT_ANKLE.x - poseLandmarks.LEFT_HIP.x) < TOLERANCE &&
        Math.abs(poseLandmarks.RIGHT_ANKLE.x - poseLandmarks.RIGHT_HIP.x) < TOLERANCE;

    // Validate horse stance based on bent knees and foot/hip alignment
    const isHorseStance = isKneesBent && isFootAndHipAligned;

    // Optional: Perform additional validation using image analysis
    const isHorseStanceFromImage = analyzeImageForHorseStance(image);

    // If either validation method confirms horse stance, return true
    return isHorseStance || isHorseStanceFromImage;
}

// Function to perform image analysis for horse stance validation
async function analyzeImageForHorseStance(image) {
  // Load the MobileNet model
  const model = await mobilenet.load();

  // Classify the image
  const predictions = await model.classify(image);

  // Check if any prediction indicates a horse stance
  for (const prediction of predictions) {
      if (prediction.className.toLowerCase().includes('horse stance')) {
          return true; // Horse stance detected
      }
  }

  return false; // Horse stance not detected
}

// Function to handle pose results
function onResultsPose(results) {
  document.body.classList.add('loaded');
  fpsControl.tick();

  console.log(results.poseLandmarks); // Log poseLandmarks for debugging

  canvasCtx5.save();
  canvasCtx5.clearRect(0, 0, out5.width, out5.height);
  canvasCtx5.drawImage(
    results.image,
    0,
    0,
    out5.width,
    out5.height
  );

  // Check if the detected pose corresponds to any of the selected stances
  let isCorrectStance = false;

  // Check if poseLandmarks is undefined or null
  if (!results.poseLandmarks) {
    isCorrectStance = false; // Pose landmarks are not available
    // Show detection modal
    showDetectionModal();
  } else {
    // Validate horse stance
    isCorrectStance = validateHorseStance(results.poseLandmarks, results.image);
    //showCorrectStanceModal();
  }

  // Set the color for connectors and landmarks based on correctness of stance
  let lineColor, landmarkColor;
  if (isCorrectStance) {
    lineColor = 'green'; // Correct stance color
    landmarkColor = zColor; // Correct stance color
  } else {
    lineColor = 'red'; // Incorrect stance color
    landmarkColor = zColor; // Use zColor for incorrect stance
  }

  // Draw connectors with the determined color
  drawConnectors(
    canvasCtx5,
    results.poseLandmarks,
    POSE_CONNECTIONS,
    { color: lineColor }
  );

  // Draw landmarks with the determined color
  drawLandmarks(
    canvasCtx5,
    Object.values(POSE_LANDMARKS_LEFT).map(
      (index) => results.poseLandmarks[index]
    ),
    { color: landmarkColor, fillColor: '#00FF00' } // Use green color for correct pose
  );

  drawLandmarks(
    canvasCtx5,
    Object.values(POSE_LANDMARKS_RIGHT).map(
      (index) => results.poseLandmarks[index]
    ),
    { color: landmarkColor, fillColor: '#00FF00' } // Use green color for correct pose
  );

  drawLandmarks(
    canvasCtx5,
    Object.values(POSE_LANDMARKS_NEUTRAL).map(
      (index) => results.poseLandmarks[index]
    ),
    { color: landmarkColor, fillColor: '#00FF00' } // Use green color for correct pose
  );

  canvasCtx5.restore();
}

let isDetectionModalClosed = false; // Flag variable to track if detection modal is closed

// Function to show the detection modal
function showDetectionModal() {
  const modal = document.getElementById('myModal');
  if (!isDetectionModalClosed) {
    modal.classList.add('is-active');
    setTimeout(() => {
      modal.classList.remove('is-active');
    }, 100000); // 1 minute in milliseconds
  }
}

// Function to show the correct stance modal
function showCorrectStanceModal() {
  const modal = document.getElementById('correctStanceModal');
  modal.classList.add('is-active');
  setTimeout(() => {
    modal.classList.remove('is-active');
  }, 3000); // Hide modal after 3 seconds
}

// Function to close the modal when clicking on the close button
document.querySelectorAll('.modal-close').forEach(function (element) {
  element.addEventListener('click', function () {
    const modal = this.closest('.modal');
    modal.classList.remove('is-active');
    if (modal.id === 'myModal') {
      //isDetectionModalClosed = true;
    }
  });
});

  // Function to set guide text
  function setGuideText(text, steps, landmarksDetected) {
    // Set the guide text
    const guidedText = document.querySelector('.guided-text');
    guidedText.querySelector('small').textContent = text;

    // Set the ordered list for steps
    const ol = document.createElement('ol');
    steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.textContent = step;
        if (landmarksDetected && landmarksDetected[index]) {
            // If landmarks are detected for this step, set the color to green
            li.style.color = 'green';
        }
        ol.appendChild(li);
    });

    // Clear any existing steps
    const existingOl = guidedText.querySelector('ol');
    if (existingOl) {
        existingOl.remove();
    }

    // Append the new ordered list
    guidedText.appendChild(ol);
  }


  // Get the query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const className = urlParams.get('className');

  // Set the panel-heading text
  const panelHeading = document.querySelector('.panel-heading');
  panelHeading.textContent = `Guide Image ${className}`;

  // Set the image source
  const guideImage = document.querySelector('.guide-image');

  // Define an object to map class names to image source paths and guide texts
  const classGuideMap = {
    'Horse Stance (Ma Bu)': {
      src: 'img/1.png',
      alt: 'Guide Image 1',
      text: 'Follow these for Horse Stance.',
      steps: [
        'Step 1: Stand with feet shoulder-width apart, toes forward, back straight.',
        'Step 2: Bend knees, lowering thighs parallel to ground.',
        'Step 3: Ensure knees aligned with toes, weight evenly distributed.',
        'Step 4: Maintain position, engage core muscles, breathe steadily.',
        'Step 5: Straighten legs, return to starting position.',
      ]
        },
    'Bow-Arrow Stance (Gong JianBu)': {
      src: 'img/2.png',
      alt: 'Guide Image 2',
      text: 'Follow these for Bow-Arrow Stance.',
      steps: [
        'Step 1: Stand with feet shoulder-width apart, toes pointing forward.',
        'Step 2: Extend arms forward, palms facing down, as if holding a bow and arrow.',
        'Step 3: Bend knees slightly, keeping back straight and core engaged.',
        'Step 4: Lower body into a stable stance, aligning knees with feet.',
        'Step 5: Focus on maintaining balance and stability, breathe steadily.',
      ]
        },
    'Sitting on Crossed Legs Stance (Zuo Pan Bu)': {
      src: 'img/3.png',
      alt: 'Guide Image 3',
      text: 'Follow these for Sitting on Crossed Legs Stance.',
      steps: [
        'Step 1: Sit on the ground with legs extended in front of you.',
        'Step 2: Cross one leg over the other at the knees, keeping back straight.',
        'Step 3: Place hands on knees or floor for support, if needed.',
        'Step 4: Relax shoulders and lengthen the spine, maintaining good posture.',
        'Step 5: Breathe deeply and evenly, focusing on relaxation and balance.',
      ]
        },
    'Four-Six Stance (Si Liu Bu)': {
      src: 'img/4.png',
      alt: 'Guide Image 4',
      text: 'Follow these for Four-Six Stance.',
      steps: [
        'Step 1: Stand with feet shoulder-width apart and arms relaxed at sides.',
        'Step 2: Bend knees slightly while keeping back straight and chest lifted.',
        'Step 3: Shift weight onto balls of feet while maintaining balance.',
        'Step 4: Lower hips down and back as if sitting into a chair, thighs parallel to the ground.',
        'Step 5: Keep knees aligned over ankles, not extending past toes.',
      ]
    },
    'Tame the Tiger Stance (Fu Hu Bu)': {
      src: 'img/5.png',
      alt: 'Guide Image 5',
      text: 'Follow these for Tame the Tiger Stance.',
      steps: [
        'Step 1: Begin in a standing position with feet hip-width apart and arms relaxed at sides.',
        'Step 2: Shift weight onto one leg while lifting the opposite foot off the ground.',
        'Step 3: Bend the knee of the lifted leg and bring it towards the chest.',
        'Step 4: Hold the lifted foot with one or both hands, finding balance.',
        'Step 5: Keep the standing leg slightly bent for stability and support.',
      ]
    },
    'False Stance (Xuan Ji Bu or Xu Bu)': {
      src: 'img/6.png',
      alt: 'Guide Image 6',
      text: 'Follow these for False Stance.',
      steps: [
        'Step 1: Start in a standing position with feet shoulder-width apart',
        'Step 2: Shift weight onto one foot while lifting the opposite foot off the ground.',
        'Step 3: Bend the knee of the lifted leg and bring it towards the chest.',
        'Step 4: Keep the standing leg slightly bent for stability and support.',
        'Step 5: Engage the core muscles to maintain balance and control.',
      ]
    },
    'Golden Rooster Standing on One Leg Stance (Jin Gi Du Li)': {
      src: 'img/7.png',
      alt: 'Guide Image 7',
      text: 'Follow these for Golden Rooster Standing on One Leg Stance.',
      steps: [
        'Step 1: Begin in a standing position with feet hip-width apart and arms relaxed at sides.',
        'Step 2: Shift weight onto one leg while keeping the other foot firmly planted on the ground.',
        'Step 3: Engage the core muscles to stabilize the body and maintain balance.',
        'Step 4: Bend the knee of the supporting leg slightly, maintaining a stable stance.',
        'Step 5: Lift the opposite leg off the ground, bringing the knee towards the chest.',
      ]
    },
    'Squat Stance (Zuo Dun)': {
      src: 'img/8.png',
      alt: 'Guide Image 8',
      text: 'Follow these for Squat Stance.',
      steps: [
        'Step 1: Begin in a standing position with feet shoulder-width apart and arms relaxed at sides.',
        'Step 2: Engage the core muscles and shift hips back as if sitting into a chair, bending knees.',
        'Step 3: Lower the body down, keeping the chest lifted and back straight, as if sitting back.',
        'Step 4: Lower until thighs are parallel to the ground or as low as comfortable, keeping heels down.',
        'Step 5: Keep knees aligned with toes and avoid letting them extend beyond toes.',
      ]
    }
  };

  // Set image source, alt text, and guide text based on className
  const guideInfo = classGuideMap[className];
  if (guideInfo) {
    guideImage.src = guideInfo.src;
    guideImage.alt = guideInfo.alt;
    setGuideText(guideInfo.text, guideInfo.steps);
  }


    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
      },
    });
    pose.onResults(onResultsPose);

    const camera = new Camera(video5, {
      onFrame: async () => {
        await pose.send({ image: video5 });
      },
      width: 480,
      height: 480,
    });
    camera.start();

    new ControlPanel(controlsElement5, {
      selfieMode: true,
      upperBodyOnly: false,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    })
      .add([
        new StaticText({ title: 'MediaPipe Pose' }),
        fpsControl,
        new Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
        new Toggle({ title: 'Upper-body Only', field: 'upperBodyOnly' }),
        new Toggle({ title: 'Smooth Landmarks', field: 'smoothLandmarks' }),
        new Slider({
          title: 'Min Detection Confidence',
          field: 'minDetectionConfidence',
          range: [0, 1],
          step: 0.01,
        }),
        new Slider({
          title: 'Min Tracking Confidence',
          field: 'minTrackingConfidence',
          range: [0, 1],
          step: 0.01,
        }),
      ])
      .on((options) => {
        video5.classList.toggle('selfie', options.selfieMode);
        pose.setOptions(options);
      });

    // Toggle navbar burger icon
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    if ($navbarBurgers.length > 0) {
      $navbarBurgers.forEach(function ($el) {
        $el.addEventListener('click', function () {
          var target = $el.dataset.target;
          var $target = document.getElementById(target);
          $el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    }
});