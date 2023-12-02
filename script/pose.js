document.addEventListener('DOMContentLoaded', () => {
  const video5 = document.createElement('video');
  video5.autoplay = true;
  video5.className = 'input_video5';

  const out5 = document.getElementsByClassName('output5')[0];
  const controlsElement5 = document.getElementsByClassName('control5')[0];
  const canvasCtx5 = out5.getContext('2d');

  const fpsControl = new FPS();

  const spinner = document.querySelector('.loading');
  spinner.ontransitionend = () => {
    spinner.style.display = 'none';
  };

  function zColor(data) {
    const z = clamp(data.from.z + 0.5, 0, 1);
    return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
  }

  function onResultsPose(results) {
    document.body.classList.add('loaded');
    fpsControl.tick();

    canvasCtx5.save();
    canvasCtx5.clearRect(0, 0, out5.width, out5.height);
    canvasCtx5.drawImage(
      results.image,
      0,
      0,
      out5.width,
      out5.height
    );
    drawConnectors(
      canvasCtx5,
      results.poseLandmarks,
      POSE_CONNECTIONS,
      {
        color: (data) => {
          const x0 = out5.width * data.from.x;
          const y0 = out5.height * data.from.y;
          const x1 = out5.width * data.to.x;
          const y1 = out5.height * data.to.y;

          const z0 = clamp(data.from.z + 0.5, 0, 1);
          const z1 = clamp(data.to.z + 0.5, 0, 1);

          const gradient = canvasCtx5.createLinearGradient(x0, y0, x1, y1);
          gradient.addColorStop(
            0,
            `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`
          );
          gradient.addColorStop(
            1.0,
            `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`
          );
          return gradient;
        },
      }
    );
    drawLandmarks(
      canvasCtx5,
      Object.values(POSE_LANDMARKS_LEFT).map(
        (index) => results.poseLandmarks[index]
      ),
      { color: zColor, fillColor: '#FF0000' }
    );
    drawLandmarks(
      canvasCtx5,
      Object.values(POSE_LANDMARKS_RIGHT).map(
        (index) => results.poseLandmarks[index]
      ),
      { color: zColor, fillColor: '#00FF00' }
    );
    drawLandmarks(
      canvasCtx5,
      Object.values(POSE_LANDMARKS_NEUTRAL).map(
        (index) => results.poseLandmarks[index]
      ),
      { color: zColor, fillColor: '#AAAAAA' }
    );
    canvasCtx5.restore();
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
});

document.addEventListener('DOMContentLoaded', function () {
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
});

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
