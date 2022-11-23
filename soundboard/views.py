from django.db.models.functions import Lower
from django.views import generic

from soundboard.models import Soundboard


class SoundboardListView(generic.ListView):
    model = Soundboard
    ordering = [Lower("name")]


class SoundboardDetailView(generic.DetailView):
    model = Soundboard
    slug_field = "slug"

    def get_queryset(self):
        return self.model.objects.prefetch_related("sounds").all()
