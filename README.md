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

## Struktur

```
_config.yml         Site-Titel, Kontaktdaten, Notrufnummern, Navigation
_data/               (optional) weitere strukturierte Daten
_includes/           Header, Footer, <head>
_layouts/            default, page, post, einsatz, fahrzeug
_posts/               Neuigkeiten (ein Markdown-File pro Beitrag)
_einsaetze/            Einsatzprotokolle (eigene Collection)
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
4. **Einsätze**: Neue Datei in `_einsaetze/` mit Front Matter (`title`,
   `date`, `time`, `ort`) anlegen.
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
