from django.db import models
from django.contrib.auth import get_user_model

from products.models import Product






class Order(models.Model):
    BANKING = 'BANKING'
    CASH = 'CASH'
    PAYMENT_CHOICES = [
        (BANKING, 'Banking'),
        (CASH, 'Cash')
    ]
    creator = models.ForeignKey(
        get_user_model(), related_name="orders_creator", null=True,
        blank=True, on_delete=models.SET_NULL
    )
    customer_name = models.CharField(max_length=256)
    customer_email = models.EmailField(max_length=256)
    customer_phone = models.CharField(max_length=15)
    customer_province = models.CharField(max_length=256)
    customer_district = models.CharField(max_length=256)
    customer_ward = models.CharField(max_length=256)
    customer_address = models.CharField(max_length=256)
    total_amount = models.IntegerField()
    payment_method = models.CharField(
        max_length=10,
        choices=PAYMENT_CHOICES,
    )
    created = models.DateTimeField(auto_now_add=True)


class OrderLine(models.Model):
    order = models.ForeignKey(Order, related_name='lines', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='lines', on_delete=models.CASCADE)
    quantity = models.IntegerField()
