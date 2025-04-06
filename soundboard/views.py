from django.db.models.functions import Lower
from django.views import generic

from soundboard.models import Soundboard


class SoundboardListView(generic.ListView):
    model = Soundboard
    ordering = [Lower("name")]


class SoundboardDetailView(generic.DetailView):
    model = Soundboard
    slug_url_kwarg = "soundboard"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if "sound" in self.kwargs:
            context["sound"] = self.kwargs.get("sound")
        return context
