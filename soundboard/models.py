import os

from django.conf import settings
from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from django_extensions.db.fields import AutoSlugField


class Soundboard(models.Model):
    name = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from="name", blank=True, null=True, overwrite=True, max_length=255)

    def __str__(self):
        return self.name


def sound_directory_path(instance, orig_filename):
    _, ext = os.path.splitext(orig_filename)
    filename = f"{instance.slug}{ext}"
    return os.path.join(instance.soundboard.slug, filename)


class Sound(models.Model):
    soundboard = models.ForeignKey(Soundboard, on_delete=models.CASCADE, related_name="sounds")
    name = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from="name", blank=True, null=True, overwrite=True, max_length=255)
    sound = models.FileField(max_length=255, upload_to=sound_directory_path)
    image = models.ImageField(max_length=255, blank=True, null=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        unique_together = ('slug', 'soundboard')
        ordering = ["sort_order"]

    def __str__(self):
        return self.soundboard.name


@receiver(signals.pre_delete, sender=Sound)
def delete_sound_attachments(sender, instance, **kwargs):
    try:
        if instance.sound:
            instance.sound.delete()
    except FileNotFoundError:
        pass
    try:
        if instance.sound:
            instance.image.delete()
    except FileNotFoundError:
        pass
    try:
        directory = os.path.join(settings.MEDIA_ROOT, instance.soundboard.slug)
        os.rmdir(directory)
    except (OSError, FileNotFoundError):
        pass
