---
title: Galerie
eyebrow: Impressionen aus dem Feuerwehrdienst
permalink: /galerie/
layout: page
---

{%- assign alben_mit_bildern = 0 -%}
{%- for album in site.data.galerie.alben -%}
  {%- assign pfad = '/assets/images/galerie/' | append: album.ordner | append: '/' -%}
  {%- capture bilder -%}{% include galerie.html pfad=pfad alt=album.titel %}{%- endcapture -%}
  {%- if bilder != "" -%}
    {%- assign alben_mit_bildern = alben_mit_bildern | plus: 1 -%}
<section class="galerie-album">
  <h2>{{ album.titel }}</h2>
  {%- if album.datum %}<p class="galerie-datum">{{ album.datum | date: "%d.%m.%Y" }}</p>{% endif %}
  {%- if album.text %}<p class="galerie-text">{{ album.text }}</p>{% endif %}
  {{ bilder }}
</section>
  {%- endif -%}
{%- endfor -%}

{%- if alben_mit_bildern == 0 %}
<p>Hier entstehen bald Impressionen aus Übungen, Einsätzen und dem Vereinsleben der Feuerwehr Oberer Sempachersee.</p>
{%- endif %}
