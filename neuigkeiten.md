---
title: Neuigkeiten
eyebrow: Aktuelles
permalink: /neuigkeiten/
layout: page
---

<ul class="post-list">
  {% for post in site.posts %}
    <li class="post-card">
      <div>
        <span class="date">{{ post.date | date: "%d.%m.%Y" }}</span>
      </div>
      <div>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.excerpt | strip_html | truncatewords: 28 }}</p>
      </div>
    </li>
  {% else %}
    <li class="post-card">Noch keine Neuigkeiten veröffentlicht.</li>
  {% endfor %}
</ul>

<p style="margin-top:32px;color:#4A4744;font-size:.9rem;">Neue Beiträge werden als Datei im Ordner <code>_posts/</code> hinzugefügt.</p>
