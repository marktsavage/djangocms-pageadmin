# -*- coding: utf-8 -*-
# Generated by Django 1.11.17 on 2019-01-02 09:24
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    initial = True

    dependencies = [("cms", "0034_remove_pagecontent_placeholders")]

    operations = [
        migrations.CreateModel(
            name="PageContent",
            fields=[],
            options={"proxy": True, "indexes": []},
            bases=("cms.pagecontent",),
        )
    ]
