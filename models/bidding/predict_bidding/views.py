import os
import pickle
import numpy as np
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Construct the full path to the pickle file
models_file_path = os.path.join(
    settings.BASE_DIR, "predict_bidding", "models_file", "bidding_model.pkl"
)

# Load the model
try:
    with open(models_file_path, "rb") as file:
        model = pickle.load(file)
except FileNotFoundError:
    raise Exception(f"Model file not found at {models_file_path}")


@csrf_exempt
def predict_bid(request):
    if request.method == "POST":
        try:
            # Parse JSON data from request body
            data = json.loads(request.body)

            # Extract features from the payload
            average_price = float(data.get("average_price"))
            temperature = float(data.get("temperature"))
            rainfall = float(data.get("rainfall"))
            sales_prediction = float(data.get("sales_prediction"))
            other_features = float(data.get("other_features"))

            # Create a feature array
            features = np.array(
                [
                    [
                        average_price,
                        temperature,
                        rainfall,
                        sales_prediction,
                        other_features,
                    ]
                ]
            )

            # Predict using the model
            predicted_bid = model.predict(features)[0]

            return JsonResponse({"predicted_bid_price": predicted_bid}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
