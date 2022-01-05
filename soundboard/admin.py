from django.contrib import admin

from .models import Soundboard, Sound


@admin.register(Soundboard)
class SoundboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ['name']}


@admin.register(Sound)
class SoundAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'soundboard',
        'name',
        'sound',
        'image',
        'sort_order',
    )
    list_filter = ('soundboard',)
    search_fields = ('name',)
    autocomplete_fields = ['soundboard']
