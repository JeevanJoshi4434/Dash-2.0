from rest_framework import serializers


class BiddingInputSerializer(serializers.Serializer):
    average_price = serializers.FloatField()
    temperature = serializers.FloatField()
    rainfall = serializers.FloatField()
    sales_prediction = serializers.FloatField()
    other_features = serializers.FloatField()
