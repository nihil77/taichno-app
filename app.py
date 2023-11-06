from flask import Flask, render_template, Response, request
import cv2
import mediapipe as mp
import subprocess  # Import subprocess module

app = Flask(__name__)
        
# Initialize MediaPipe BlazePose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Variable to store the webcam feed
video_capture = cv2.VideoCapture(0)

@app.route('/')
def index():
    return render_template('realtime.html')

def generate_frames():
    while True:
        success, frame = video_capture.read()
        if not success:
            break
        else:
            frame = process_pose_estimation(frame)
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

def process_pose_estimation(frame):
    # Convert to RGB
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame and get the pose landmarks
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        # Draw pose landmarks on the frame (customize this part)
        mp_drawing = mp.solutions.drawing_utils
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

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
