from django.urls import URLPattern
from django.urls import path
from .views import predict_bid
from .views import PredictBidAPIView


from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Bidding API",
        default_version="v1",
        description="API for predicting bidding prices",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path(
        "docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("predict_old/", predict_bid, name="predict_bid_old"),
    path("predict/", PredictBidAPIView.as_view(), name="predict_bid_api"),
]
