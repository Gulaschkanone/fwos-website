"""Holt die Einsätze aus der App (app.fwos.ch) und erzeugt daraus _einsaetze/*.md.

Läuft beim Bauen der Webseite auf GitHub (siehe .github/workflows/). Die Einsätze werden
in der App erfasst; hier entstehen nur die Dateien für Jekyll. Bei einem Fehler bricht
das Skript ab, damit nie eine Webseite ohne Einsätze veröffentlicht wird.

Lokal (für «bundle exec jekyll serve»):  python3 scripts/einsaetze_holen.py
"""
import json
import os
import sys
import urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

URL = os.environ.get('EINSAETZE_URL', 'https://app.fwos.ch/oeffentlich/einsaetze.json')
ORDNER = Path(__file__).resolve().parent.parent / '_einsaetze'
ZUERICH = ZoneInfo('Europe/Zurich')


def yaml_text(wert: str) -> str:
    """Als YAML-Zeichenkette in Anführungszeichen (JSON-Strings sind gültiges YAML)."""
    return json.dumps(wert or '', ensure_ascii=False)


def main():
    anfrage = urllib.request.Request(URL, headers={'User-Agent': 'fwos-website-build'})
    with urllib.request.urlopen(anfrage, timeout=30) as antwort:
        einsaetze = json.load(antwort)
    if not isinstance(einsaetze, list) or not einsaetze:
        sys.exit(f'Keine Einsätze von {URL} erhalten – Abbruch, damit die Webseite nicht leer wird.')

    ORDNER.mkdir(exist_ok=True)
    for alt in ORDNER.glob('*.md'):
        alt.unlink()
    for e in einsaetze:
        zeit = e.get('zeit') or '00:00'
        beginn = datetime.strptime(f"{e['datum']} {zeit}", '%Y-%m-%d %H:%M').replace(tzinfo=ZUERICH)
        zeilen = ['---',
                  f"title: {yaml_text(e['titel'])}",
                  f"date: {beginn.strftime('%Y-%m-%d %H:%M:%S %z')}",
                  f"time: {yaml_text(e.get('zeit'))}",
                  f"ort: {yaml_text(e.get('ort'))}"]
        if e.get('einsatzart'):
            zeilen.append(f"einsatzart: {yaml_text(e['einsatzart'])}")
        zeilen += ['---', '']
        (ORDNER / f"{e['pfad']}.md").write_text('\n'.join(zeilen), encoding='utf-8')
    print(f'{len(einsaetze)} Einsätze aus {URL} übernommen.')


if __name__ == '__main__':
    main()
