---
title: Ausrüstung
eyebrow: Fuhrpark & Material
permalink: /ausruestung/
layout: page
---

Unser Fuhrpark ist im Magazin Sempach stationiert und deckt die ganze Bandbreite unserer Einsätze ab — von der Brandbekämpfung über technische Hilfeleistungen bis zum Personentransport.

<div class="fleet-grid">
  {% assign fahrzeuge = site.ausruestung | sort: 'order' %}
  {% for f in fahrzeuge %}
    <a class="fleet-card" href="{{ f.url | relative_url }}">
      {% if f.image and f.image != "" %}
        <div class="fleet-card-image">
          <img src="{{ f.image | relative_url }}" alt="{{ f.title }}">
        </div>
      {% else %}
        <div class="fleet-card-icon">{{ f.icon | default: "🚒" }}</div>
      {% endif %}
      <div class="fleet-card-body">
        {% if f.kategorie %}<span class="fleet-card-kategorie">{{ f.kategorie }}</span>{% endif %}
        <h3>{{ f.title }}</h3>
        <p>{{ f.excerpt | strip_html | truncatewords: 20 }}</p>
      </div>
    </a>
  {% else %}
    <p>Noch keine Fahrzeuge erfasst.</p>
  {% endfor %}
</div>

<p style="margin-top:32px;color:#4A4744;font-size:.9rem;">Neue Einträge werden als Datei im Ordner <code>_ausruestung/</code> hinzugefügt.</p>
