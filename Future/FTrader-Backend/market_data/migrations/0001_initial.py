# Generated by Django 4.2.10 on 2025-03-09 22:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Market",
            fields=[
                (
                    "epic",
                    models.CharField(max_length=100, primary_key=True, serialize=False),
                ),
                ("name", models.CharField(max_length=255)),
                ("instrument_type", models.CharField(max_length=100)),
                ("expiry", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "high",
                    models.DecimalField(
                        blank=True, decimal_places=5, max_digits=15, null=True
                    ),
                ),
                (
                    "low",
                    models.DecimalField(
                        blank=True, decimal_places=5, max_digits=15, null=True
                    ),
                ),
                (
                    "percentage_change",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                (
                    "net_change",
                    models.DecimalField(
                        blank=True, decimal_places=5, max_digits=15, null=True
                    ),
                ),
                (
                    "bid",
                    models.DecimalField(
                        blank=True, decimal_places=5, max_digits=15, null=True
                    ),
                ),
                (
                    "offer",
                    models.DecimalField(
                        blank=True, decimal_places=5, max_digits=15, null=True
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="MarketAlert",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "alert_type",
                    models.CharField(
                        choices=[
                            ("price_above", "Price Above"),
                            ("price_below", "Price Below"),
                            ("price_change_percent", "Price Change Percent"),
                            ("price_change_value", "Price Change Value"),
                        ],
                        max_length=20,
                    ),
                ),
                (
                    "threshold_value",
                    models.DecimalField(decimal_places=5, max_digits=15),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("active", "Active"),
                            ("triggered", "Triggered"),
                            ("expired", "Expired"),
                            ("cancelled", "Cancelled"),
                        ],
                        default="active",
                        max_length=10,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("triggered_at", models.DateTimeField(blank=True, null=True)),
                ("expiry_date", models.DateTimeField(blank=True, null=True)),
                (
                    "market",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="alerts",
                        to="market_data.market",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="market_alerts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="WatchList",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("is_default", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "markets",
                    models.ManyToManyField(
                        related_name="watchlists", to="market_data.market"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="watchlists",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "unique_together": {("name", "user")},
            },
        ),
        migrations.CreateModel(
            name="PriceHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("timestamp", models.DateTimeField()),
                ("open_price", models.DecimalField(decimal_places=5, max_digits=15)),
                ("close_price", models.DecimalField(decimal_places=5, max_digits=15)),
                ("high_price", models.DecimalField(decimal_places=5, max_digits=15)),
                ("low_price", models.DecimalField(decimal_places=5, max_digits=15)),
                ("volume", models.IntegerField(blank=True, null=True)),
                (
                    "market",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="price_history",
                        to="market_data.market",
                    ),
                ),
            ],
            options={
                "ordering": ["-timestamp"],
                "unique_together": {("market", "timestamp")},
            },
        ),
    ]
