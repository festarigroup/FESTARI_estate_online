from rest_framework import serializers
from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image')


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ('owner',)


class WishlistPropertySerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'description',
            'property_type',
            'listing_type',
            'price',
            'location',
            'is_available',
            'created_at',
            'images',
        )

    def get_images(self, obj):
        return [img.image for img in obj.images.all()]
