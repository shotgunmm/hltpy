# Generated by Django 2.1.3 on 2018-12-13 20:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0010_contacttag'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contact',
            name='agent_company',
        ),
        migrations.RemoveField(
            model_name='contact',
            name='agent_email',
        ),
        migrations.RemoveField(
            model_name='contact',
            name='agent_name',
        ),
        migrations.RemoveField(
            model_name='contact',
            name='agent_phone',
        ),
        migrations.RemoveField(
            model_name='contact',
            name='buyer_name',
        ),
        migrations.RemoveField(
            model_name='contact',
            name='mortgage_broker',
        ),
        migrations.RemoveField(
            model_name='contact',
            name='mortgage_company',
        ),
        migrations.AddField(
            model_name='contact',
            name='phone_work_extension',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]