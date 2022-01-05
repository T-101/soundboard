from django.views import generic

from soundboard.models import Soundboard


class SoundboardListView(generic.ListView):
    model = Soundboard


class SoundboardDetailView(generic.DetailView):
    model = Soundboard
    slug_field = "slug"
