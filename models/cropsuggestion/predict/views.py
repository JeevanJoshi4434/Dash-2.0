import os
import pandas as pd
import json
from django.http import JsonResponse
import pickle
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Construct the full path to the pickle file
model_file_path = os.path.join(
    settings.BASE_DIR, "predict", "model_files", "crop_suggestion_model.pkl"
)

# Load the model
try:
    with open(model_file_path, "rb") as file:
        model = pickle.load(file)
except FileNotFoundError:
    raise Exception(f"Model file not found at {model_file_path}")


@csrf_exempt
def predict_crop(request):
    if request.method == "POST":
        try:
            # Parse input JSON from the request body
            data = json.loads(request.body)

            # Extract features from input
            N = data["N"]
            P = data["P"]
            K = data["K"]
            temperature = data["temperature"]
            humidity = data["humidity"]
            ph = data["ph"]
            rainfall = data["rainfall"]

            # Create a DataFrame for the input
            input_data = pd.DataFrame(
                {
                    "N": [N],
                    "P": [P],
                    "K": [K],
                    "temperature": [temperature],
                    "humidity": [humidity],
                    "ph": [ph],
                    "rainfall": [rainfall],
                }
            )

            # Make the prediction
            prediction = model.predict(input_data)

            # Return the predicted crop
            return JsonResponse({"recommended_crop": prediction[0]})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)
