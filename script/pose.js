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

  // Function to validate stance
  function validateHorseStance(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }
  
    // Example: Check the position of key landmarks or angles.
    const leftKnee = poseLandmarks[POSE_LANDMARKS_LEFT.KNEE];
    const rightKnee = poseLandmarks[POSE_LANDMARKS_RIGHT.KNEE];
    const leftAnkle = poseLandmarks[POSE_LANDMARKS_LEFT.ANKLE];
    const rightAnkle = poseLandmarks[POSE_LANDMARKS_RIGHT.ANKLE];
  
    // Check if any of the landmarks are undefined
    if (!leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      return false; // Some landmarks are not available
    }
  
    // Example: Check if knees are lower than ankles (simplified logic)
    return leftKnee.y > leftAnkle.y && rightKnee.y > rightAnkle.y;
  }

    // Function to validate Bow-Arrow Stance (Gong JianBu)
  function validateBowArrowStance(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }

    // Example: Check the position of key landmarks or angles.
    const leftFoot = poseLandmarks[POSE_LANDMARKS_LEFT.FOOT];
    const rightFoot = poseLandmarks[POSE_LANDMARKS_RIGHT.FOOT];
    const leftHip = poseLandmarks[POSE_LANDMARKS_LEFT.HIP];
    const rightHip = poseLandmarks[POSE_LANDMARKS_RIGHT.HIP];
    const leftKnee = poseLandmarks[POSE_LANDMARKS_LEFT.KNEE];
    const rightKnee = poseLandmarks[POSE_LANDMARKS_RIGHT.KNEE];
    
    // Check if any of the landmarks are undefined
    if (!leftFoot || !rightFoot || !leftHip || !rightHip || !leftKnee || !rightKnee) {
      return false; // Some landmarks are not available
    }

    // Example: Check if feet are aligned with the hips and knees are bent
    return (Math.abs(leftFoot.x - rightFoot.x) < TOLERANCE &&
            Math.abs(leftHip.x - rightHip.x) < TOLERANCE &&
            leftKnee.y < leftFoot.y && rightKnee.y < rightFoot.y);
  }

  // Function to validate Sitting on Crossed Legs Stance (Zuo Pan Bu)
  function validateSittingCrossedLegsStance(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }

    // Example: Check the position of key landmarks or angles.
    const leftKnee = poseLandmarks[POSE_LANDMARKS_LEFT.KNEE];
    const rightKnee = poseLandmarks[POSE_LANDMARKS_RIGHT.KNEE];
    const leftHip = poseLandmarks[POSE_LANDMARKS_LEFT.HIP];
    const rightHip = poseLandmarks[POSE_LANDMARKS_RIGHT.HIP];
    const leftAnkle = poseLandmarks[POSE_LANDMARKS_LEFT.ANKLE];
    const rightAnkle = poseLandmarks[POSE_LANDMARKS_RIGHT.ANKLE];
    
    // Check if any of the landmarks are undefined
    if (!leftKnee || !rightKnee || !leftHip || !rightHip || !leftAnkle || !rightAnkle) {
      return false; // Some landmarks are not available
    }

    // Example: Check if knees are aligned with hips and ankles are crossed
    return (Math.abs(leftKnee.x - rightKnee.x) < TOLERANCE &&
            Math.abs(leftHip.x - rightHip.x) < TOLERANCE &&
            leftAnkle.y > leftKnee.y && rightAnkle.y > rightKnee.y);
  }

  // Function to validate Four-Six Stance (Si Liu Bu)
  function validateFourSixStance(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }

    // Example: Check the position of key landmarks.
    const leftKnee = poseLandmarks[POSE_LANDMARKS_LEFT.KNEE];
    const rightKnee = poseLandmarks[POSE_LANDMARKS_RIGHT.KNEE];
    const leftAnkle = poseLandmarks[POSE_LANDMARKS_LEFT.ANKLE];
    const rightAnkle = poseLandmarks[POSE_LANDMARKS_RIGHT.ANKLE];
    const leftHip = poseLandmarks[POSE_LANDMARKS_LEFT.HIP];
    const rightHip = poseLandmarks[POSE_LANDMARKS_RIGHT.HIP];
    const leftShoulder = poseLandmarks[POSE_LANDMARKS_LEFT.SHOULDER];
    const rightShoulder = poseLandmarks[POSE_LANDMARKS_RIGHT.SHOULDER];

    // Check if any of the landmarks are undefined
    if (!leftKnee || !rightKnee || !leftAnkle || !rightAnkle || !leftHip || !rightHip || !leftShoulder || !rightShoulder) {
      return false; // Some landmarks are not available
    }

    // Example: Check if knees are lower than ankles and shoulders are higher than hips
    return (leftKnee.y < leftAnkle.y && rightKnee.y < rightAnkle.y &&
            leftShoulder.y > leftHip.y && rightShoulder.y > rightHip.y);
  }

  // Function to validate Tame the Tiger Stance (Fu Hu Bu)
  function validateTameTheTigerStance(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }

    // Example: Check the position of key landmarks.
    const leftFoot = poseLandmarks[POSE_LANDMARKS_LEFT.FOOT];
    const rightFoot = poseLandmarks[POSE_LANDMARKS_RIGHT.FOOT];
    const leftAnkle = poseLandmarks[POSE_LANDMARKS_LEFT.ANKLE];
    const rightAnkle = poseLandmarks[POSE_LANDMARKS_RIGHT.ANKLE];
    const leftKnee = poseLandmarks[POSE_LANDMARKS_LEFT.KNEE];
    const rightKnee = poseLandmarks[POSE_LANDMARKS_RIGHT.KNEE];
    const leftHip = poseLandmarks[POSE_LANDMARKS_LEFT.HIP];
    const rightHip = poseLandmarks[POSE_LANDMARKS_RIGHT.HIP];

    // Check if any of the landmarks are undefined
    if (!leftFoot || !rightFoot || !leftAnkle || !rightAnkle || !leftKnee || !rightKnee || !leftHip || !rightHip) {
      return false; // Some landmarks are not available
    }

    // Example: Check if knees are lower than hips and ankles are aligned with feet
    return (leftKnee.y < leftHip.y && rightKnee.y < rightHip.y &&
            Math.abs(leftAnkle.y - leftFoot.y) < TOLERANCE &&
            Math.abs(rightAnkle.y - rightFoot.y) < TOLERANCE);
  }

  // Function to validate False Stance (Xuan Ji Bu or Xu Bu)
  function validateFalseStance(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }

    // Example: Check the position of key landmarks.
    const leftFoot = poseLandmarks[POSE_LANDMARKS_LEFT.FOOT];
    const rightFoot = poseLandmarks[POSE_LANDMARKS_RIGHT.FOOT];
    const leftAnkle = poseLandmarks[POSE_LANDMARKS_LEFT.ANKLE];
    const rightAnkle = poseLandmarks[POSE_LANDMARKS_RIGHT.ANKLE];
    const leftKnee = poseLandmarks[POSE_LANDMARKS_LEFT.KNEE];
    const rightKnee = poseLandmarks[POSE_LANDMARKS_RIGHT.KNEE];
    
    // Check if any of the landmarks are undefined
    if (!leftFoot || !rightFoot || !leftAnkle || !rightAnkle || !leftKnee || !rightKnee) {
      return false; // Some landmarks are not available
    }

    // Example: Check if one foot is lifted off the ground and the other foot is firmly planted
    return (leftFoot.y > leftAnkle.y && rightFoot.y > rightAnkle.y &&
            leftKnee.y < leftAnkle.y && rightKnee.y < rightAnkle.y);
  }

  // Function to validate Golden Rooster Standing on One Leg Stance (Jin Gi Du Li)
  function validateGoldenRoosterStance(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }

    // Example: Check the position of key landmarks.
    const leftFoot = poseLandmarks[POSE_LANDMARKS_LEFT.FOOT];
    const rightFoot = poseLandmarks[POSE_LANDMARKS_RIGHT.FOOT];
    const leftAnkle = poseLandmarks[POSE_LANDMARKS_LEFT.ANKLE];
    const rightAnkle = poseLandmarks[POSE_LANDMARKS_RIGHT.ANKLE];
    const leftKnee = poseLandmarks[POSE_LANDMARKS_LEFT.KNEE];
    const rightKnee = poseLandmarks[POSE_LANDMARKS_RIGHT.KNEE];
    const leftHip = poseLandmarks[POSE_LANDMARKS_LEFT.HIP];
    const rightHip = poseLandmarks[POSE_LANDMARKS_RIGHT.HIP];

    // Check if any of the landmarks are undefined
    if (!leftFoot || !rightFoot || !leftAnkle || !rightAnkle || !leftKnee || !rightKnee || !leftHip || !rightHip) {
      return false; // Some landmarks are not available
    }

    // Example: Check if one foot is lifted off the ground and the other foot is firmly planted,
    // and the knee of the lifted leg is close to the hip
    return ((leftFoot.y > leftAnkle.y && rightFoot.y > rightAnkle.y) &&
            (leftKnee.y < leftAnkle.y && rightKnee.y < rightAnkle.y) &&
            (Math.abs(leftHip.x - leftKnee.x) < TOLERANCE || Math.abs(rightHip.x - rightKnee.x) < TOLERANCE));
  }

  // Function to validate Squat Stance (Zuo Dun)
  function validateSquatStance(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }

    // Example: Check the position of key landmarks.
    const leftHip = poseLandmarks[POSE_LANDMARKS_LEFT.HIP];
    const rightHip = poseLandmarks[POSE_LANDMARKS_RIGHT.HIP];
    const leftKnee = poseLandmarks[POSE_LANDMARKS_LEFT.KNEE];
    const rightKnee = poseLandmarks[POSE_LANDMARKS_RIGHT.KNEE];
    const leftAnkle = poseLandmarks[POSE_LANDMARKS_LEFT.ANKLE];
    const rightAnkle = poseLandmarks[POSE_LANDMARKS_RIGHT.ANKLE];
    
    // Check if any of the landmarks are undefined
    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      return false; // Some landmarks are not available
    }

    // Example: Check if knees are bent, and hips are lowered
    return (leftKnee.y < leftHip.y && rightKnee.y < rightHip.y &&
            leftAnkle.y < leftHip.y && rightAnkle.y < rightHip.y);
  }

  // Function to validate if the user is smiling
  function validateSmile(poseLandmarks) {
    // Check if poseLandmarks is undefined or null
    if (!poseLandmarks) {
      return false; // Pose landmarks are not available
    }

    // Example: Check the position of key landmarks to determine if the user is smiling
    const leftEye = poseLandmarks[POSE_LANDMARKS_LEFT.EYE_INNER];
    const rightEye = poseLandmarks[POSE_LANDMARKS_RIGHT.EYE_INNER];
    const mouth = poseLandmarks[POSE_LANDMARKS_NEUTRAL.MOUTH_CENTER];

    // Check if any of the landmarks are undefined
    if (!leftEye || !rightEye || !mouth) {
      return false; // Some landmarks are not available
    }

    // Example: Calculate the distance between eyes and mouth
    const eyeToMouthDistance = Math.abs(leftEye.y - mouth.y) + Math.abs(rightEye.y - mouth.y);

    // Example: Determine if the user is smiling based on the distance threshold
    return eyeToMouthDistance > SMILING_THRESHOLD;
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
  if (className === 'Horse Stance (Ma Bu)') {
    isCorrectStance = validateHorseStance(results.poseLandmarks);
  } else if (className === 'Bow-Arrow Stance (Gong JianBu)') {
    isCorrectStance = validateBowArrowStance(results.poseLandmarks);
  } else if (className === 'Sitting on Crossed Legs Stance (Zuo Pan Bu)') {
    isCorrectStance = validateSittingCrossedLegsStance(results.poseLandmarks);
  } else if (className === 'Four-Six Stance (Si Liu Bu)') {
    isCorrectStance = validateFourSixStance(results.poseLandmarks);
  } else if (className === 'Tame the Tiger Stance (Fu Hu Bu)') {
    isCorrectStance = validateTameTheTigerStance(results.poseLandmarks);
  } else if (className === 'False Stance (Xuan Ji Bu or Xu Bu)') {
    isCorrectStance = validateFalseStance(results.poseLandmarks);
  } else if (className === 'Golden Rooster Standing on One Leg Stance (Jin Gi Du Li)') {
    isCorrectStance = validateGoldenRoosterStance(results.poseLandmarks);
  } else if (className === 'Squat Stance (Zuo Dun)') {
    isCorrectStance = validateSquatStance(results.poseLandmarks);
  }

  // Check if the user is smiling
  const isSmiling = validateSmile(results.poseLandmarks);

  // Define a separate green color for perfect pose
  const perfectPoseColor = 'limegreen';

  // Set the color for connectors and landmarks based on correctness of stance and smiling
  const lineColor = (isCorrectStance && isSmiling) ? perfectPoseColor : 'red';
  const landmarkColor = isCorrectStance ? (isSmiling ? perfectPoseColor : 'green') : zColor;


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
    { color: landmarkColor, fillColor: '#FF0000' }
  );

  drawLandmarks(
    canvasCtx5,
    Object.values(POSE_LANDMARKS_RIGHT).map(
      (index) => results.poseLandmarks[index]
    ),
    { color: landmarkColor, fillColor: '#00FF00' }
  );

  drawLandmarks(
    canvasCtx5,
    Object.values(POSE_LANDMARKS_NEUTRAL).map(
      (index) => results.poseLandmarks[index]
    ),
    { color: landmarkColor, fillColor: '#AAAAAA' }
  );

  canvasCtx5.restore();
}


  // Function to set guide text
  function setGuideText(text, steps) {
    // Set the guide text
    const guidedText = document.querySelector('.guided-text');
    guidedText.querySelector('small').textContent = text;

    // Set the ordered list for steps
    const ol = document.createElement('ol');
    steps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
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

  // Conditionally set the image source based on className
  if (className === 'Horse Stance (Ma Bu)') {
    guideImage.src = 'img/1.png';
    guideImage.alt = 'Guide Image 1';
    setGuideText('Follow these for Horse Stance.', ['Step 1: Instruction for Horse Stance', 'Step 2: Another instruction for Horse Stance']);
  } else if (className === 'Bow-Arrow Stance (Gong JianBu)') {
    guideImage.src = 'img/2.png';
    guideImage.alt = 'Guide Image 2';
    setGuideText('Follow these for Bow-Arrow Stance.', ['Step 1: Instruction for Bow-Arrow Stance', 'Step 2: Another instruction for Bow-Arrow Stance']);
  } else if (className == 'Sitting on Crossed Legs Stance (Zuo Pan Bu)') {
    guideImage.src = 'img/3.png';
    guideImage.alt = 'Guide Image 3';
    setGuideText('Follow these for Sitting on Crossed Legs Stance.', ['Step 1: Instruction for Sitting on Crossed Legs Stance', 'Step 2: Another instruction for Sitting on Crossed Legs Stance']);
  } else if (className == 'Four-Six Stance (Si Liu Bu)') {
    guideImage.src = 'img/4.png';
    guideImage.alt = 'Guide Image 4';
    setGuideText('Follow these for Four-Six Stance.', ['Step 1: Instruction for Sitting on Crossed Legs Stance', 'Step 2: Another instruction for Sitting on Crossed Legs Stance']);
  } else if (className == 'Tame the Tiger Stance (Fu Hu Bu)') {
    guideImage.src = 'img/5.png';
    guideImage.alt = 'Guide Image 5';
    setGuideText('Follow these for Tame the Tiger Stance.', ['Step 1: Instruction for Sitting on Crossed Legs Stance', 'Step 2: Another instruction for Sitting on Crossed Legs Stance']);
  } else if (className == 'False Stance (Xuan Ji Bu or Xu Bu)') {
    guideImage.src = 'img/6.png';
    guideImage.alt = 'Guide Image 6';
    setGuideText('Follow these for False Stance.', ['Step 1: Instruction for Sitting on Crossed Legs Stance', 'Step 2: Another instruction for Sitting on Crossed Legs Stance']);
  } else if (className == 'Golden Rooster Standing on One Leg Stance (Jin Gi Du Li)') {
    guideImage.src = 'img/7.png';
    guideImage.alt = 'Guide Image 7';
    setGuideText('Follow these for Golden Rooster Standing on One Leg Stance.', ['Step 1: Instruction for Sitting on Crossed Legs Stance', 'Step 2: Another instruction for Sitting on Crossed Legs Stance']);
  } else if (className == 'Squat Stance (Zuo Dun)') {
    guideImage.src = 'img/8.png';
    guideImage.alt = 'Guide Image 8';
    setGuideText('Follow these for Squat Stance.', ['Step 1: Instruction for Sitting on Crossed Legs Stance', 'Step 2: Another instruction for Sitting on Crossed Legs Stance']);
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
