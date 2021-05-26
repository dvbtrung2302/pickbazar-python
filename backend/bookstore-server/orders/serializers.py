from rest_framework import serializers

from .models import Order, OrderLine
from products.models import Product


class OrderLineSerializers(serializers.ModelSerializer):
    class Meta:
        model = OrderLine
        fields = ('id', 'product', 'quantity')



class OrderSerializers(serializers.ModelSerializer):
    # products =  serializers.PrimaryKeyRelatedField(
    #     many=True,
    #     queryset=Product.objects.all()
    # )
    # quantity = serializers.IntegerField()
    # list_items = serializers.SerializerMethodField(method_name="get_list_items)
    lines = OrderLineSerializers(many=True)
    class Meta:
        model = Order
        fields = ('id', 'customer_name', 'customer_email', 'customer_phone', 'customer_province', 'customer_district', 'lines',
                    'customer_ward', 'customer_address', 'total_amount', 'payment_method', 'created', 'creator')
        #readd_only_fields = ('creator',)

    # def get_list_items(self, obj):
        # product_list = Product.objects.filter()

    # def perform_create(self, serializer):
    #     """Create a new object"""
    #     serializer.save(creator=self.request.user)



    def create(self, validated_data):
        lines_data = validated_data.pop('lines')
        order =  Order.objects.create(**validated_data)
        for line_data in lines_data:
            OrderLine.objects.create(order=order, **line_data)
        return order
        
