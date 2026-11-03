from django.test import TestCase
from django.urls import reverse

from soundboard.models import Sound, Soundboard


class SoundboardPageTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.board = Soundboard.objects.create(name='Test board')
        for index in range(2):
            Sound.objects.create(
                soundboard=cls.board,
                name=f'Sound "{index}" & friends',
                sound=f'test/sound-{index}.mp3',
                image=f'test/image-{index}.png',
            )

    def test_library_offers_both_themes_and_color_cycle(self):
        response = self.client.get(reverse('normal:list'))
        self.assertContains(response, 'data-site-theme="v0"')
        self.assertContains(response, 'data-site-theme="v1"')
        self.assertContains(response, 'id="color-mode-toggle"', count=1)
        self.assertContains(response, reverse('normal:detail', args=[self.board.slug]))

    def test_sound_controls_have_accessible_names_and_unique_image_markup(self):
        sound = self.board.sounds.first()
        response = self.client.get(reverse('normal:detail', args=[self.board.slug, sound.slug]))
        self.assertContains(response, f'data-selected-sound="{sound.slug}"')
        self.assertContains(response, 'aria-label="Play Sound &quot;0&quot; &amp; friends"')
        self.assertContains(response, 'class="collapse sound-image"', count=2)
        self.assertNotContains(response, 'id="imageCollapse"')
        self.assertContains(response, 'soundboard/player.js')

    def test_empty_board_renders(self):
        board = Soundboard.objects.create(name='Empty board')
        response = self.client.get(reverse('normal:detail', args=[board.slug]))
        self.assertContains(response, 'This board is waiting for its first sound.')
