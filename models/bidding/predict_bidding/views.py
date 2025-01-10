from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import pickle
import numpy as np
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from predict_bidding.serializer import BiddingInputSerializer

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


class PredictBidAPIView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(
            {"message": "This endpoint supports POST for predictions."},
            status=status.HTTP_200_OK,
        )

    def post(self, request, *args, **kwargs):
        # Validate the input data
        serializer = BiddingInputSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            # Prepare features for prediction
            features = np.array(
                [
                    [
                        data["average_price"],
                        data["temperature"],
                        data["rainfall"],
                        data["sales_prediction"],
                        data["other_features"],
                    ]
                ]
            )

            # Perform prediction
            try:
                predicted_bid = model.predict(features)[0]
                return Response(
                    {"predicted_bid_price": predicted_bid}, status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
