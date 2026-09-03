---
title: Kontakt
eyebrow: Wir sind für dich da
permalink: /kontakt/
layout: page
---

<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:48px;" class="kontakt-grid">
  <div>
    <h2>Es brennt — was tun?</h2>
    <ol class="steps">
      <li>
        <div>
          <strong>Feuerwehr alarmieren: 118</strong><br>
          oder Polizei-Notruf 117. Wo brennt's? Was brennt? Wer ruft an?
        </div>
      </li>
      <li><div><strong>Personen retten.</strong> Lift nicht benützen.</div></li>
      <li><div><strong>Türen und Fenster schliessen.</strong> Ruhe bewahren!</div></li>
      <li><div><strong>Brand bekämpfen</strong> mit Decken, Wassereimern, Handfeuerlöscher oder Löschposten.</div></li>
    </ol>

    <h2 style="margin-top:48px;">Notruf-Telefonnummern</h2>
    <ul class="emergency-list">
      {% for n in site.emergency_numbers %}
        <li>
          <span class="num">{{ n.number }}</span>
          <span class="name">{{ n.name }}</span>
        </li>
      {% endfor %}
    </ul>
  </div>

  <div>
    <div class="panel" style="margin-bottom:24px;">
      <h3>Kommandant</h3>
      <p>{{ site.contact.kommandant }}</p>
      <h3 style="margin-top:20px;">Adresse</h3>
      <p>{{ site.title }}<br>{{ site.contact.strasse }}<br>{{ site.contact.ort }}</p>
      <h3 style="margin-top:20px;">Erreichbarkeit</h3>
      <p>
        <a href="mailto:{{ site.contact.email }}">{{ site.contact.email }}</a><br>
        <a href="tel:{{ site.contact.telefon | replace: ' ', '' }}">{{ site.contact.telefon }}</a>
      </p>
    </div>

    <div class="panel">
      <h3>Nachricht schreiben</h3>
      <!-- Hinweis: Formular-Backend nötig, siehe mitglied-werden.md -->
      <form class="form-grid" action="#" method="POST">
        <div>
          <label for="c-name">Name</label>
          <input type="text" id="c-name" name="name" required>
        </div>
        <div>
          <label for="c-email">E-Mail *</label>
          <input type="email" id="c-email" name="email" required>
        </div>
        <div>
          <label for="c-message">Nachricht</label>
          <textarea id="c-message" name="message" rows="4"></textarea>
        </div>
        <div>
          <button class="btn btn-primary" type="submit">Senden</button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  @media (max-width: 760px) {
    .kontakt-grid { grid-template-columns: 1fr !important; }
  }
</style>
