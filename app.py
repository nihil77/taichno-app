from flask import Flask, render_template, Response, request
import cv2
import mediapipe as mp
import subprocess  # Import subprocess module
import math


app = Flask(__name__)
        
# Initialize MediaPipe BlazePose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.7, min_tracking_confidence=0.7)

# Variable to store the webcam feed
video_capture = cv2.VideoCapture(0)

def calculate_angle(x1, y1, x2, y2, x3, y3):
    radians = math.acos((x1 * (x2 - x3) + y1 * (y2 - y3)) / (math.sqrt(x1**2 + y1**2) * (math.sqrt((x2 - x3)**2 + (y2 - y3)**2))))
    return math.degrees(radians) if (math.sqrt(x1**2 + y1**2) * math.sqrt((x2 - x3)**2 + (y2 - y3)**2)) > 0 else 0  # Avoid NaN for very small angles

def is_horse_stance_correct(landmarks):
    keypoints_detected = (
        landmarks[11].visibility > 0.5 and  # Left hip
        landmarks[12].visibility > 0.5 and  # Right hip
        landmarks[23].visibility > 0.5 and  # Left knee
        landmarks[24].visibility > 0.5  # Right knee
    )

    if keypoints_detected:
        # Calculate distances
        left_hip_x = landmarks[11].x
        right_hip_x = landmarks[12].x
        left_knee_x = landmarks[23].x
        right_knee_x = landmarks[24].x

        left_hip_y = landmarks[11].y
        right_hip_y = landmarks[12].y
        left_knee_y = landmarks[23].y
        right_knee_y = landmarks[24].y

        # Tolerance values (you may need to adjust these)
        hip_width_tolerance = 0.1  # Tolerance for hip width
        knee_distance_tolerance = 0.1  # Tolerance for knee distance
        vertical_tolerance = 0.5  # Tolerance for vertical alignment (0.1, 0.2)

        # Check if the keypoints match criteria for Horse Stance
        is_correct_horse_stance = (
            abs(left_hip_x - right_hip_x) < hip_width_tolerance and
            abs(left_knee_x - right_knee_x) < knee_distance_tolerance and
            abs(left_knee_y - left_hip_y) < vertical_tolerance and
            abs(right_knee_y - right_hip_y) < vertical_tolerance
        )
    else:
        is_correct_horse_stance = False
        
    # Calculate angles
    angle_left_hip_knee = calculate_angle(
        landmarks[11].x, landmarks[11].y, landmarks[23].x, landmarks[23].y, landmarks[24].x, landmarks[24].y
    )

    angle_right_hip_knee = calculate_angle(
        landmarks[12].x, landmarks[12].y, landmarks[24].x, landmarks[24].y, landmarks[23].x, landmarks[23].y
    )

    return is_correct_horse_stance, angle_left_hip_knee, angle_right_hip_knee

    # Stance for Bow Arrow Stance
def is_bow_arrow_stance_correct(landmarks):
    # Check if the required keypoints are detected
    keypoints_detected = (
        landmarks[11].visibility > 0.5 and  # Left hip
        landmarks[12].visibility > 0.5 and  # Right hip
        landmarks[23].visibility > 0.5 and  # Left knee
        landmarks[24].visibility > 0.5  # Right knee
    )

    if keypoints_detected:
        # Calculate angles between hips and knees
        angle_left_hip_knee = calculate_angle(
            landmarks[11].x, landmarks[11].y, landmarks[23].x, landmarks[23].y, landmarks[24].x, landmarks[24].y
        )

        angle_right_hip_knee = calculate_angle(
            landmarks[12].x, landmarks[12].y, landmarks[24].x, landmarks[24].y, landmarks[23].x, landmarks[23].y
        )

        # Define angle thresholds for Bow-Arrow Stance (you may need to adjust these)
        min_angle_threshold = 160  # Minimum angle between hip and knee
        max_angle_threshold = 200  # Maximum angle between hip and knee

        # Check if both angles are within the defined thresholds
        is_correct_bow_arrow_stance = (
            min_angle_threshold <= angle_left_hip_knee <= max_angle_threshold and
            min_angle_threshold <= angle_right_hip_knee <= max_angle_threshold
        )
    else:
        is_correct_bow_arrow_stance = False

    return is_correct_bow_arrow_stance, angle_left_hip_knee, angle_right_hip_knee


@app.route('/')
def index():
    return render_template('realtime.html')

def generate_frames():
    while True:
        success, frame = video_capture.read()
        if not success:
            print("Failed to capture frame")
            break
        else:
            frame = process_pose_estimation(frame)
            print("Frame processed")
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                print("Failed to encode frame")
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            print("Frame sent")

def process_pose_estimation(frame):
    # Convert to RGB
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame and get the pose landmarks
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        # Draw pose landmarks on the frame (customize this part)
        mp_drawing = mp.solutions.drawing_utils
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

     # Get pose landmarks and angles
        landmarks = results.pose_landmarks.landmark
        is_correct_horse_stance, angle_left_hip_knee, angle_right_hip_knee = is_horse_stance_correct(landmarks)

        # Display the horse stance results on the frame
        cv2.putText(frame, f'{"Correct" if is_correct_horse_stance else "Incorrect"}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0) if is_correct_horse_stance else (0, 0, 255), 2)
        cv2.putText(frame, f'Left Hip-Knee Angle: {angle_left_hip_knee:.2f}', (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.putText(frame, f'Right Hip-Knee Angle: {angle_right_hip_knee:.2f}', (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    return frame

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_flask_app', methods=['GET', 'POST'])
def start_flask_app():
    try:
        subprocess.Popen(['python', 'app_runner.py'])  # Start the Flask app in a separate process
        return 'Flask app started successfully', 200
    except Exception as e:
        return f'Failed to start Flask app: {e}', 500

if __name__ == '__main__':
    app.run(debug=True)
