from rest_framework import serializers

from .models import Product, Category, ProductSize, ProductVote, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = '__all__'



class ProductSerializer(serializers.ModelSerializer):
    size = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProductSize.objects.all()
    )
    size_names = serializers.SerializerMethodField(method_name='get_size_name')
    product_votes = serializers.SerializerMethodField(method_name='get_star_vote')
    photo = serializers.SerializerMethodField(method_name='get_photos')
    category = serializers.PrimaryKeyRelatedField(
        many=False,
        queryset=Category.objects.all()
    )
    category_name = serializers.SerializerMethodField(method_name='get_category_name')
    class Meta:
        model = Product
        fields = (
            'id', 'name', 'category', 'category_name', 'photo', 'slug', 'description',
            'price', 'sale', 'final_price','sex', 'available', 'size', 'size_names', 'product_votes',
        )
        read_only_fields = ('id', 'created', 'updated', 'photo',)

    def get_photos(self, obj):
        photos = ProductImage.objects.filter(product=obj.id)
        return [photo.image.url for photo in photos]

    def get_category_name(self, obj):
        category_name = obj.category.name
        if category_name:
            return category_name

    def get_star_vote(self, obj):
        votes = ProductVote.objects.filter(product=obj.id)
        return [vote.voter_star for vote in votes]\

    def get_size_name(self, obj):
        size_names = obj.size.all()
        return [size_name.name for size_name in size_names]


class ProductVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVote
        fields = ('voter_name', 'voter_text', 'voter_star', 'product',)
        read_only_fields = ('id', 'created')



class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False)
        )
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image']

    def create(self, validated_data):
        images = validated_data.pop('image')
        for image in images:
            image = ProductImage.objects.create(image=image, **validated_data)
        return image