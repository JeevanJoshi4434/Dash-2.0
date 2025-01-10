from django.urls import URLPattern
from django.urls import path
from .views import predict_bid

urlpatterns = [
    path("predict/", predict_bid, name="predict_bid"),
]
