import os
import requests
import base64
from flask import Flask, render_template, request, jsonify
from io import BytesIO
from PIL import Image
import datetime
import io
import cv2

app = Flask(__name__)

SAVE_FOLDER = 'saved_images'
if not os.path.exists(SAVE_FOLDER):
    os.makedirs(SAVE_FOLDER)

@app.route('/front')
def front():
    # URL of the video to be linked to
    video_url = "http://10.42.0.137:8000"
    return render_template('OneCamNew.html', video_url=video_url)


@app.route('/back')
def back():
    # URL of the video to be linked to
    video_url = "http://10.42.0.137:8000"
    return render_template('OneCamNew.html', video_url=video_url)


@app.route('/right')
def right():
    # URL of the video to be linked to
    video_url = "http://10.42.0.137:8000"
    return render_template('OneCamNew.html', video_url=video_url)

@app.route('/left')
def left():
    # URL of the video to be linked to
    video_url = "http://10.42.0.137:8000"
    return render_template('OneCamNew.html', video_url=video_url)


@app.route('/map')
def map():
    return render_template('responsive.html')

@app.route('/save-frame', methods=['POST'])
def save_frame():
    try:
        data = request.get_json()
        image_data = data['image_data']

        header, encoded = image_data.split(',', maxsplit=1)
        binary_data = base64.b64decode(encoded)
        now = datetime.datetime.now()
        filename = f'saved_image_{now.strftime("%Y-%m-%d %H:%M:%S")}.jpg'
        filepath = os.path.join(SAVE_FOLDER, filename)

        with open(filepath, 'wb') as f:
            f.write(binary_data)

        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, error=str(e))



if __name__ == '__main__':
    app.run(debug=True)

