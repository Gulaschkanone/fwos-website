// Terminkalender: lädt die öffentlichen Termine aus der App (app.fwos.ch/kalender)
// und zeigt sie mit FullCalendar als Monat (Bildschirm) bzw. Liste (Handy).
(function () {
  var wurzel = document.querySelector('.termine');
  if (!wurzel || typeof FullCalendar === 'undefined') return;

  var basis = (wurzel.dataset.kalenderUrl || 'https://app.fwos.ch/kalender').replace(/\/$/, '');
  var abos = { '': 'fwos', '1': 'fwos-zug1', '2': 'fwos-zug2' };
  var namen = { '': 'aller Formationen', '1': 'für Zug 1', '2': 'für Zug 2' };
  var zug = '';
  try { zug = localStorage.getItem('termine-zug') || ''; } catch (e) { /* ohne Speicher */ }
  if (!(zug in abos)) zug = '';

  var fehler = document.getElementById('termine-fehler');
  var schmal = window.matchMedia('(max-width: 700px)');

  var kalender = new FullCalendar.Calendar(document.getElementById('termine-kalender'), {
    locale: 'de',
    timeZone: 'local',
    initialView: schmal.matches ? 'listMonth' : 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' },
    buttonText: { today: 'Heute', month: 'Monat', list: 'Liste' },
    height: 'auto',
    fixedWeekCount: false,
    eventDisplay: 'block',
    displayEventEnd: true,
    views: { dayGridMonth: { displayEventEnd: false } },   // im Monat nur Beginn, damit der Titel Platz hat
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    noEventsText: 'Keine Termine in diesem Monat',
    events: function (info, erfolg, misserfolg) {
      fetch(basis + '/termine.json' + (zug ? '?zug=' + zug : ''), { credentials: 'omit' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (daten) { fehler.hidden = true; erfolg(daten); })
        .catch(function (e) { fehler.hidden = false; misserfolg(e); });
    },
    eventDidMount: function (info) {
      var ort = info.event.extendedProps.ort;
      if (ort) {
        info.el.title = info.event.title + ' – ' + ort;
        var ziel = info.el.querySelector('.fc-list-event-title');
        if (ziel) {
          var span = document.createElement('span');
          span.className = 'termine-ort';
          span.textContent = ort;
          ziel.appendChild(span);
        }
      }
    }
  });
  kalender.render();

  schmal.addEventListener('change', function (e) {
    kalender.changeView(e.matches ? 'listMonth' : 'dayGridMonth');
  });

  function aboAnzeigen() {
    var https = basis + '/' + abos[zug] + '.ics';
    var webcal = https.replace(/^https?:/, 'webcal:');
    document.getElementById('termine-abo-webcal').href = webcal;
    document.getElementById('termine-abo-google').href =
      'https://calendar.google.com/calendar/r?cid=' + encodeURIComponent(webcal);
    document.getElementById('termine-abo-link').textContent = https;
    document.getElementById('termine-abo-name').textContent = namen[zug];
    wurzel.querySelectorAll('.termine-filter-btn').forEach(function (b) {
      var aktiv = b.dataset.zug === zug;
      b.classList.toggle('aktiv', aktiv);
      b.setAttribute('aria-pressed', aktiv ? 'true' : 'false');
    });
  }

  wurzel.querySelectorAll('.termine-filter-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      zug = b.dataset.zug;
      try { localStorage.setItem('termine-zug', zug); } catch (e) { /* ohne Speicher */ }
      aboAnzeigen();
      kalender.refetchEvents();
    });
  });

  document.getElementById('termine-abo-kopieren').addEventListener('click', function () {
    var knopf = this;
    var link = document.getElementById('termine-abo-link').textContent;
    var fertig = function () {
      knopf.textContent = 'Kopiert';
      setTimeout(function () { knopf.textContent = 'Link kopieren'; }, 2000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(fertig, function () { window.prompt('Link kopieren:', link); });
    } else {
      window.prompt('Link kopieren:', link);
    }
  });

  aboAnzeigen();
})();
