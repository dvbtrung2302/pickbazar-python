from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from .models import Order, OrderLine
from .serializers import OrderSerializers, OrderLineSerializers


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializers
    # permission_classes = [permissions.IsAuthenticated,]

class OrderLineViewSet(viewsets.ModelViewSet):
    queryset = OrderLine.objects.all()
    serializer_class = OrderLineSerializers
    # permission_classes = [permissions.IsAuthenticated,]

