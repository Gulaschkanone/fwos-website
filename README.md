# Feuerwehr-Website (Jekyll)

Statische Website für eine Feuerwehr, gebaut mit [Jekyll](https://jekyllrb.com/).
Aufbau orientiert an fwos.ch: Navbar → Hero → Informationspanels.
Hauptfarbe: RAL 3000 „Feuerrot" (`#A72920`).

## Lokal starten

Das mitgelieferte System-Ruby ist zu alt für aktuelles Jekyll. Falls noch
nicht vorhanden, Homebrew-Ruby installieren:

```bash
brew install ruby@3.4
```

**Wichtig:** Die Ruby-Gems werden bewusst **ausserhalb** dieses Ordners unter
`~/.local-gems/webseite-feuerwehr` installiert (statt in `vendor/bundle`
direkt im Projekt). Dieser Ordner liegt in `~/Documents`, welches von
OneDrive **und** kDrive synchronisiert wird — die Cloud-Sync-Clients fassen
laufend die tausenden kleinen Gem-Dateien an, was macOS' Gatekeeper-Prüfung
immer wieder neu auslöst und den Build teils minutenlang blockiert oder
komplett hängen lässt. Gems ausserhalb des synchronisierten Ordners zu
halten vermeidet das zuverlässig.

```bash
export GEM_HOME="$HOME/.local-gems/webseite-feuerwehr"
export PATH="/opt/homebrew/opt/ruby@3.4/bin:$GEM_HOME/bin:$PATH"
bundle install
bundle exec jekyll serve
```

Danach ist die Seite unter `http://localhost:4000` erreichbar. Änderungen an
Inhalten werden automatisch neu gebaut (Live-Reload).

Falls die Seite mal wieder nicht lädt oder der Build ungewöhnlich lange
hängt: Prüfen, ob zufällig noch ein alter `jekyll serve`-Prozess läuft
(`ps aux | grep jekyll`) und diesen beenden, dann neu starten.

## Neue Beiträge in VS Code anlegen

**Per Task (empfohlen):** `Ctrl+Shift+P` → „Tasks: Run Task" → **Neue Neuigkeit**
oder **Neuer Einsatz**. VS Code fragt nach Titel, Datum (leer = heute) und bei
Einsätzen nach Alarmzeit und Ort. Die Datei wird mit korrektem Namen
(`JJJJ-MM-TT-titel.md`) und Front Matter im richtigen Ordner angelegt und geöffnet.
Danach nur noch den Text schreiben, speichern, committen und auf `main` pushen.

Alternativ im Terminal:

```powershell
.\scripts\neuer-beitrag.ps1 -Typ Einsatz -Titel "Brand, Scheune" -Ort "Eich" -Zeit "14:05"
```

**Per Snippet:** Leere `.md`-Datei selbst anlegen, `neuigkeit` bzw. `einsatz`
tippen und `Tab` drücken → Front Matter wird eingefügt. Mit `bild` + `Tab` wird
ein Bild aus `assets/images/` eingebunden.

**Bilder zu einer Neuigkeit:** Fotos (`.jpg`, `.png`, `.webp`) in den Ordner
`assets/images/neuigkeiten/<Dateiname des Posts ohne .md>/` legen, z. B.
`assets/images/neuigkeiten/2026-11-21-neue-kadermitglieder/`. Sie erscheinen
automatisch als Galerie unter dem Text (alphabetisch sortiert, also z. B.
`01-gruppe.jpg`, `02-uebergabe.jpg`). Fotos vorher auf ca. 1600 px Breite
verkleinern, damit die Seite schnell lädt. Der Task „Neue Neuigkeit" legt den
Ordner automatisch an.

**Zwischentitel:** Im Text eine Zeile mit `## Titel` beginnen (Snippet
`zwischentitel`). Für Bilder direkt unter einem Zwischentitel einen
Unterordner anlegen (z. B. `.../2026-11-21-neue-kadermitglieder/offiziere/`)
und an der gewünschten Stelle `{% include galerie.html ordner="offiziere" %}`
einfügen (Snippet `galerie`).

Vorschau: `Ctrl+Shift+V` zeigt das Markdown direkt in VS Code an.

## Galerie (Impressionen)

Die Seite `/galerie/` zeigt Fotoalben. Pro Album:

1. Ordner `assets/images/galerie/<ordner>/` anlegen, z. B.
   `assets/images/galerie/2025-09-hauptuebung/`.
2. Fotos hineinlegen (vorher auf ca. 1600 px Breite verkleinern; Reihenfolge
   alphabetisch nach Dateiname).
3. In `_data/galerie.yml` einen Eintrag ergänzen (`ordner`, `titel`, optional
   `datum` und `text`). Die Alben erscheinen in der Reihenfolge der Liste,
   also das neueste zuoberst. Alben ohne Fotos werden ausgeblendet.

Ein Klick auf ein Foto öffnet es gross (Pfeiltasten blättern).

## Struktur

```
_config.yml         Site-Titel, Kontaktdaten, Notrufnummern, Navigation
_data/               (optional) weitere strukturierte Daten
_includes/           Header, Footer, <head>
_layouts/            default, page, post, einsatz, fahrzeug
_posts/               Neuigkeiten (ein Markdown-File pro Beitrag)
_einsaetze/            Einsätze (beim Bauen aus der App erzeugt, nicht im Repository)
_ausruestung/           Fahrzeuge/Material (eigene Collection)
assets/css/main.scss  Alle Styles (Sass, eine Datei)
assets/js/main.js     Mobiles Menü, Organigramm-Linien
index.html            Startseite (Hero + Informationspanels)
organisation.md        "Über uns"-Seite + Organigramm
ausruestung.md          Fuhrpark-Übersicht (listet _ausruestung/)
einsaetze.md            Einsatzübersicht (listet _einsaetze/)
neuigkeiten.md          News-Übersicht (listet _posts/)
mitglied-werden.md      Rekrutierungs-CTA + Formular
kontakt.md              Notfall-Infos, Notrufnummern, Kontaktformular
impressum.md            Impressum / Datenschutz
```

## Anpassen

1. **Eigene Angaben eintragen**: Öffne `_config.yml` und ersetze Titel,
   Gemeinden, Kennzahlen, Kontaktdaten, Notrufnummern und Navigation.
2. **Logo**: Aktuell wird ein einfaches Text-Icon (erste zwei Buchstaben von
   `short_title`) verwendet (`.brand-mark` in `_includes/header.html` /
   `footer.html`). Für ein echtes Logo `<img>`-Tag einsetzen und Datei unter
   `assets/images/` ablegen.
2. **Hero-Bild**: Der Hero-Bereich nutzt aktuell einen Rot-Verlauf. Für ein
   Foto (z. B. Feuerwehrfahrzeug) eine eigene Aufnahme unter
   `assets/images/hero.jpg` ablegen und in `assets/css/main.scss` bei
   `.hero::after` `var(--hero-image, none)` durch
   `url("/assets/images/hero.jpg")` ersetzen bzw. das Inline-Style
   `style="--hero-image:url(...)"` auf `<section class="hero">` in
   `index.html` setzen.
3. **Neuigkeiten**: Neue Datei in `_posts/` nach dem Schema
   `YYYY-MM-DD-titel.md` mit Front Matter (`title`, `date`) anlegen.
4. **Einsätze**: werden in der App (app.fwos.ch → Einsätze) erfasst, mit
   «Auf der Webseite anzeigen». Beim Bauen holt `scripts/einsaetze_holen.py`
   sie ab und erzeugt `_einsaetze/` (nicht im Repository). Die Webseite wird
   täglich um 04:15 UTC neu gebaut; sofort geht es auf GitHub unter Actions →
   «Deploy auf VPS» → «Run workflow». Lokal vor `jekyll serve` einmal
   `python3 scripts/einsaetze_holen.py` ausführen.
5. **Ausrüstung/Fahrzeuge**: Neue Datei in `_ausruestung/` anlegen mit
   Front Matter `title`, `kategorie`, `baujahr`, `kennzeichen`, `besatzung`,
   `standort`, `order` (Sortierung in der Übersicht) und optional `image`
   (Pfad zu einem Foto unter `assets/images/fahrzeuge/`) — ohne Bild wird
   ersatzweise das `icon`-Emoji angezeigt.
6. **Formulare**: Die Formulare auf `mitglied-werden.md` und `kontakt.md`
   sind rein statisch (Jekyll erzeugt kein Backend). Für echten Versand z. B.
   [Formspree](https://formspree.io) oder Netlify Forms anbinden (URL im
   `action`-Attribut eintragen).

## Deployment

Die Seite kann z. B. über GitHub Pages, Netlify oder Vercel gehostet werden.
Für GitHub Pages reicht in der Regel ein Push auf den `main`-Branch mit
aktiviertem Pages-Build aus `_config.yml`/Jekyll.
