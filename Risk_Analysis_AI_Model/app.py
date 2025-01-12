import joblib
import numpy as np
import pandas as pd
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load models and scalers
anomaly_model = joblib.load('model/trained_model.joblib')  # Model for anomaly prediction
anomaly_scaler = joblib.load('model/scaler_model.joblib')  # Scaler for anomaly prediction
dt_model = joblib.load('./model/final_model_randomForest.pkl')  # Decision tree model
dt_scaler = joblib.load('./model/scaler.pkl')  # Scaler for decision tree model

# Route: Home
@app.route('/')
def home():
    return "Flask API is running!"

# Route: Anomaly Prediction
@app.route('/anomaly-predict', methods=['POST'])
def anomaly_predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        washtrade_index = float(data['washtrade_index'])
        zero_profit_trades = float(data['zero_profit_trades'])
        loss_making_volume = float(data['loss_making_volume'])

        # Prepare input data
        custom_input = np.array([[washtrade_index, zero_profit_trades, loss_making_volume]])
        custom_input_scaled = anomaly_scaler.transform(custom_input)

        # Make prediction
        prediction = anomaly_model.predict(custom_input_scaled)

        # Map numeric prediction to label
        labels = {0: 'Normal', 1: 'Potential Anomaly', 2: 'Anomaly'}
        predicted_label = labels.get(prediction[0], 'Unknown')

        return jsonify({'prediction': predicted_label})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 400

# Route: Risk Prediction
@app.route('/risk-predict', methods=['POST'])
def risk_predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        features = pd.DataFrame([[
            data['loss_making_trades'],
            data['avg_loss_making_trades'],
            data['loss_making_trades_percentage'],
            data['loss_making_volume'],
            data['diamond_hands'],
            data['liquidity_score']
        ]], columns=['loss_making_trades', 'avg_loss_making_trades', 'loss_making_trades_percentage',
                     'loss_making_volume', 'diamond_hands', 'liquidity_score'])

        # Scale the features
        scaled_features = dt_scaler.transform(features)

        # Make prediction
        prediction = dt_model.predict(scaled_features)

        # Map prediction to risk category
        risk_categories = ['Medium', 'Low', 'High']
        risk_category = risk_categories[prediction[0]]

        return jsonify({'risk_category': risk_category})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 400

# Route: NFT Image Upload
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
