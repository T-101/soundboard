# Generated by Django 4.0.1 on 2022-11-23 14:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('soundboard', '0003_soundboard_slug'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sound',
            options={'ordering': ['sort_order']},
        ),
    ]