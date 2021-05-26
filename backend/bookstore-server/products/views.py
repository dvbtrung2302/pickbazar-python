from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from .serializers import ProductSerializer, CategorySerializer, ProductSizeSerializer, ProductVoteSerializer, ProductImageSerializer
from .models import Product, Category, ProductSize, ProductVote, ProductImage


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # permission_classes = [permissions.IsAuthenticated,]


class ProductSizeViewSet(viewsets.ModelViewSet):
    queryset = ProductSize.objects.all()
    serializer_class = ProductSizeSerializer
    # permission_classes = [permissions.IsAuthenticated,]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [permissions.IsAuthenticated,]


# class ProductVoteViewSet(viewsets.ModelViewSet):
#     queryset = ProductVote.objects.all()
#     serializer_class = ProductVoteSerializer
#     permission_classes = [permissions.IsAuthenticated,]


class ProductVoteCreate(generics.ListCreateAPIView):
    queryset = ProductVote.objects.all()
    serializer_class = ProductVoteSerializer
    # permission_classes = [permissions.IsAuthenticated]


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    parser_classes = (MultiPartParser, FormParser,)
    # permission_classes = [permissions.IsAuthenticated,]
