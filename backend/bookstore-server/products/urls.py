from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, ProductSizeViewSet, ProductVoteCreate, ProductImageViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'product_size', ProductSizeViewSet)
router.register(r'product_upload_image', ProductImageViewSet, basename='productimage')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('product_vote/', ProductVoteCreate.as_view())
]