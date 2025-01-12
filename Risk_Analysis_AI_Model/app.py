import joblib
import numpy as np
import pandas as pd
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the decision tree model and scaler
dt_model = joblib.load('./model/final_model_randomForest.pkl')
scaler = joblib.load('./model/scaler.pkl')

# Home route for testing
@app.route('/')
def home():
    return "Flask app is running!"

# Predict route to get model predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Input Data Received:", data)

        features = pd.DataFrame([[
            data['loss_making_trades'],
            data['avg_loss_making_trades'],
            data['loss_making_trades_percentage'],
            data['loss_making_volume'],
            data['diamond_hands'],
            data['liquidity_score']
        ]], columns=['loss_making_trades', 'avg_loss_making_trades', 'loss_making_trades_percentage',
                     'loss_making_volume', 'diamond_hands', 'liquidity_score'])

        print("Features DataFrame (Before Scaling):", features)
        scaled_features = scaler.transform(features)
        print("Scaled Features:", scaled_features)

        prediction = dt_model.predict(scaled_features)
        print("Prediction:", prediction)

        risk_categories = ['Medium', 'Low', 'High']
        risk_category = risk_categories[prediction[0]]
        return jsonify({'risk_category': risk_category})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 400


# New route to handle the image upload and Unleash NFT API request
@app.route('/nft-image-upload', methods=['POST'])
def nft_image_upload():
    try:
        # Get the file from the request
        image_file = request.files.get('image')
        if not image_file:
            return jsonify({'error': 'No image provided'}), 400

        # Send the image to Unleash NFTs API
        url = "https://api-cdv.unleashnfts.com/api/v1/nft/image/detect-counterfiet?offset=0&limit=10"
        files = {'image': (image_file.filename, image_file.stream, 'image/png')}
        headers = {"accept": "application/json", "x-api-key": "316dd88ae8840897e1f61160265d1a3f"}

        response = requests.post(url, files=files, headers=headers)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch data from Unleash NFTs API'}), response.status_code

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',port=3030)
