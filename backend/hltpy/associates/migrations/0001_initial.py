# Generated by Django 2.1.2 on 2018-11-09 02:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Associate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('search_zipcode_id', models.IntegerField(blank=True, null=True)),
                ('slug', models.CharField(max_length=255)),
                ('preview_key', models.CharField(max_length=255)),
                ('first_name', models.CharField(max_length=255)),
                ('middle', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=255)),
                ('suffix', models.CharField(max_length=20)),
                ('dob', models.DateTimeField(blank=True, null=True)),
                ('notes', models.TextField()),
                ('drivers_license', models.CharField(max_length=255)),
                ('drivers_license_state', models.CharField(max_length=2)),
                ('drivers_license_expires_at', models.DateTimeField(blank=True, null=True)),
                ('vehicle_make', models.CharField(max_length=255)),
                ('vehicle_model', models.CharField(max_length=255)),
                ('vehicle_year', models.CharField(max_length=255)),
                ('vehicle_color', models.CharField(max_length=10)),
                ('vehicle_state', models.CharField(max_length=2)),
                ('vehicle_plate', models.CharField(max_length=255)),
                ('street', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('state', models.CharField(max_length=2)),
                ('zip', models.CharField(max_length=10)),
                ('show_street', models.IntegerField()),
                ('street_home', models.CharField(max_length=255)),
                ('city_home', models.CharField(max_length=255)),
                ('state_home', models.CharField(max_length=2)),
                ('zip_home', models.CharField(max_length=10)),
                ('phone_1', models.CharField(max_length=20)),
                ('phone_1_type', models.CharField(max_length=6)),
                ('phone_2', models.CharField(max_length=20)),
                ('phone_2_type', models.CharField(max_length=6)),
                ('phone_3', models.CharField(max_length=20)),
                ('phone_3_type', models.CharField(max_length=6)),
                ('mobile_phone', models.CharField(max_length=20)),
                ('mobile_carrier', models.CharField(max_length=255)),
                ('confirmation_code', models.CharField(max_length=255)),
                ('texts_enabled', models.IntegerField()),
                ('mobile_reminder_dismissed', models.IntegerField()),
                ('emergency_first_name_1', models.CharField(max_length=255)),
                ('emergency_last_name_1', models.CharField(max_length=255)),
                ('emergency_phone_1', models.CharField(max_length=255)),
                ('emergency_email_1', models.CharField(max_length=255)),
                ('emergency_first_name_2', models.CharField(max_length=255)),
                ('emergency_last_name_2', models.CharField(max_length=255)),
                ('emergency_phone_2', models.CharField(max_length=255)),
                ('emergency_email_2', models.CharField(max_length=255)),
                ('emergency_first_name_3', models.CharField(max_length=255)),
                ('emergency_last_name_3', models.CharField(max_length=255)),
                ('emergency_phone_3', models.CharField(max_length=255)),
                ('emergency_email_3', models.CharField(max_length=255)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('transactions', models.IntegerField()),
                ('full_time', models.IntegerField()),
                ('commission', models.IntegerField(blank=True, null=True)),
                ('commission_1vp', models.IntegerField(blank=True, null=True)),
                ('commission_2vp', models.IntegerField(blank=True, null=True)),
                ('team_commission', models.IntegerField(blank=True, null=True)),
                ('managed_commission', models.IntegerField(blank=True, null=True)),
                ('accepting_leads', models.IntegerField()),
                ('headshot', models.CharField(max_length=255)),
                ('logo', models.CharField(max_length=255)),
                ('banner', models.CharField(max_length=255)),
                ('synopsis', models.CharField(max_length=255)),
                ('biography', models.TextField()),
                ('facebook_link', models.CharField(max_length=255)),
                ('twitter_link', models.CharField(max_length=255)),
                ('linkedin_link', models.CharField(max_length=255)),
                ('pinterest_link', models.CharField(max_length=255)),
                ('instagram_link', models.CharField(max_length=255)),
                ('googleplus_link', models.CharField(max_length=255)),
                ('published', models.IntegerField()),
                ('visible', models.IntegerField()),
                ('nearby', models.IntegerField()),
                ('test_account', models.IntegerField()),
                ('created_at', models.DateTimeField()),
                ('updated_at', models.DateTimeField()),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'associates',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AssociatePosition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('manage_managers', models.IntegerField()),
                ('manage_associates', models.IntegerField()),
                ('supervisor', models.IntegerField()),
                ('requires_supervisor', models.IntegerField()),
                ('commission', models.IntegerField(blank=True, null=True)),
                ('commission_1vp', models.IntegerField(blank=True, null=True)),
                ('commission_2vp', models.IntegerField(blank=True, null=True)),
                ('team_commission', models.IntegerField(blank=True, null=True)),
                ('managed_commission', models.IntegerField(blank=True, null=True)),
                ('rank', models.IntegerField()),
                ('published', models.IntegerField()),
                ('created_at', models.DateTimeField()),
                ('updated_at', models.DateTimeField()),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'associates_positions',
                'managed': False,
            },
        ),
    ]
