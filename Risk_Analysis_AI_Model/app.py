import joblib
import numpy as np
import pandas as pd
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
        # Get JSON input from the frontend
        data = request.get_json()
        
        # Print the raw input data for debugging
        print("Input Data Received:", data)

        # Extract the features from the input JSON and put them into a pandas DataFrame
        features = pd.DataFrame([[
            data['loss_making_trades'],
            data['avg_loss_making_trades'],
            data['loss_making_trades_percentage'],
            data['loss_making_volume'],
            data['diamond_hands'],
            data['liquidity_score']
        ]], columns=[
            'loss_making_trades', 'avg_loss_making_trades', 'loss_making_trades_percentage',
            'loss_making_volume', 'diamond_hands', 'liquidity_score'
        ])

        # Print the features DataFrame before scaling
        print("Features DataFrame (Before Scaling):")
        print(features)

        # Scale the input features using the loaded scaler
        scaled_features = scaler.transform(features)

        # Print the scaled features for debugging
        print("Scaled Features:")
        print(scaled_features)

        # Make the prediction using the trained decision tree model
        prediction = dt_model.predict(scaled_features)

        # Print the prediction for debugging
        print("Prediction:", prediction)

        # Map the cluster label to the risk category
        risk_categories = ['Medium', 'Low', 'High']
        risk_category = risk_categories[prediction[0]]
        # Return the result as JSON
        return jsonify({'risk_category': risk_category})
    
    except Exception as e:
        print(f"Error: {str(e)}")  # Print the error if any
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
