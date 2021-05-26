from django.db import models
from django.contrib.auth import get_user_model

class Category(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, unique=True)
    
    class Meta:
        ordering = ('name',)
        verbose_name = 'category'
        verbose_name_plural = 'categories'
        
    def __str__(self):
        return self.name


class ProductSize(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name


class Product(models.Model):
    MAN = 'MAN'
    WOMAN = 'WOMAN'
    SEX_CHOICES = [
        (MAN, 'Man'),
        (WOMAN, 'Woman')
    ]
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    sale = models.IntegerField()
    sex = models.CharField(
        max_length=5,
        choices=SEX_CHOICES,
    )
    available = models.BooleanField(default=True)
    size = models.ManyToManyField(ProductSize, related_name="product_size")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    final_price = models.IntegerField()
    class Meta:
        ordering = ('name',)
        index_together = (('id', 'slug'),)

    def __str__(self):
        return self.name

    @property
    def final_price(self):
        return (self.price - self.price * self.sale / 100)


class ProductVote(models.Model):
    voter_name = models.CharField(max_length=256)
    created = models.DateTimeField(auto_now_add=True)

    product = models.ForeignKey(Product, related_name="product_votes", on_delete=models.CASCADE)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='products/%Y/%m/%d', blank=True)