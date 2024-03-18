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

  // Set the color for connectors and landmarks based on correctness of stance and smiling
  let lineColor, landmarkColor;
  if (isCorrectStance && isSmiling) {
    lineColor = perfectPoseColor; // Perfect pose color
    landmarkColor = perfectPoseColor; // Perfect pose color
  } else if (isCorrectStance) {
    lineColor = 'green'; // Correct stance color
    landmarkColor = 'green'; // Correct stance color
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
      'Step 6: Hold the crossed-leg position for a comfortable duration.',
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
      'Step 6: Engage core muscles for stability and support.',
      'Step 7: Hold the position for a comfortable duration, breathing steadily.',
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
      'Step 6: Engage the core muscles to maintain balance and control.',
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
      'Step 6: Hold the lifted foot with one or both hands, finding balance.',
      'Step 7: Keep the torso upright and the gaze forward, maintaining alignment.',
      'Step 8: Breathe deeply and evenly to stay centered and focused.',
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
      'Step 6: Extend the lifted leg forward, finding a comfortable balance point.',
      'Step 7: Keep the torso upright and the gaze focused ahead for stability.',
      'Step 8: Hold the lifted leg with one or both hands to assist with balance.',
      'Step 9: Breathe deeply and evenly, maintaining a steady rhythm.',
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
      'Step 6: Engage glutes and thigh muscles to push through heels and rise back to standing.',
      'Step 7: Keep weight evenly distributed on both feet throughout the movement.',
      'Step 8: Maintain a neutral spine and avoid rounding or arching the back.',
      'Step 9: Exhale as you push up from the squat, keeping breath controlled and steady.',
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
