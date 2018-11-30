# Generated by Django 2.1.3 on 2018-11-30 18:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contacts', '0008_auto_20181126_0412'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactNote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shared', models.BooleanField(default=False)),
                ('text', models.TextField(default='')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='note_set', to='contacts.Contact')),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created'],
            },
        ),
        migrations.AlterModelOptions(
            name='contactteammember',
            options={'ordering': ['name']},
        ),
        migrations.AlterField(
            model_name='contactteammember',
            name='user',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='team_member_roles', to=settings.AUTH_USER_MODEL),
        ),
    ]