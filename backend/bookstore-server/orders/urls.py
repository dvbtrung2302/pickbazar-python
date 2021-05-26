from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderLineViewSet
# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'lines', OrderLineViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]