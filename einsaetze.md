---
title: Einsätze
eyebrow: Im Überblick
permalink: /einsaetze/
layout: page
---

<ul class="einsatz-list">
  {% assign einsaetze = site.einsaetze | sort: 'date' | reverse %}
  {% for e in einsaetze %}
    <li class="einsatz-row">
      <span class="when">{{ e.date | date: "%d.%m.%Y" }} · {{ e.time }}</span>
      <span class="what"><a href="{{ e.url | relative_url }}">{{ e.title }}</a></span>
      <span class="where">{{ e.ort }}</span>
    </li>
  {% else %}
    <li class="einsatz-row">Noch keine Einsätze erfasst.</li>
  {% endfor %}
</ul>

