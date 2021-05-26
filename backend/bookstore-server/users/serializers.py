from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from orders.models import Order


class UserSerializer(serializers.ModelSerializer):
    #password1 = serializers.CharField(write_only=True)
    #password2 = serializers.CharField(write_only=True)
    orders_creator = serializers.PrimaryKeyRelatedField(
        many=True,
        #queryset=Order.objects.all(),
        read_only=True
    )
    # def validate(self, data):
    #     if data['password1'] != data['password2']:
    #         raise serializers.ValidationError('Passwords must match.')
    #     return data

    def create(self, validated_data):
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password',)
        }
        data['password'] = validated_data['password']
        return self.Meta.model.objects.create_user(**data)
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(validated_data["password"])
                instance.save()
        return instance 
    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 'password',
            'first_name', 'last_name', 'orders_creator',
        )
        read_only_fields = ('id',)


class LogInSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        for key, value in user_data.items():
            if key != 'id':
                token[key] = value
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['id'] = self.user.id
        return data

class UserManagerSerializer(serializers.ModelSerializer):
    orders_creator = serializers.PrimaryKeyRelatedField(
        many=True,
        #queryset=Order.objects.all(),
        read_only=True
    )
    class Meta:
        model = get_user_model()
        fields = ('id', 'username',
            'first_name', 'last_name','orders_creator')