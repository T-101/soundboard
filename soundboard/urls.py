from django.urls import path

from soundboard.views import SoundboardListView, SoundboardDetailView

app_name = "soundboard"

urlpatterns = [
    path("", SoundboardListView.as_view(), name="list"),
    path("<slug:slug>/", SoundboardDetailView.as_view(), name="detail")
]
