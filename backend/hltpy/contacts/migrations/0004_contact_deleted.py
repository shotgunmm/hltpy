# Generated by Django 2.1.2 on 2018-11-01 03:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0003_auto_20181030_0536'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]