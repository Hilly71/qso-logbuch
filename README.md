# QSO-Logbuch

Logbuch für CB- und Amateurfunk-Kontakte mit Karte. Läuft im Browser auf Handy und Rechner, auch offline.
Alle Logdaten bleiben im Browser des jeweiligen Geräts – auf dem Server liegt nur die leere App.

## Auf GitHub Pages veröffentlichen

1. Bei github.com anmelden und oben rechts **+ → New repository** wählen.
2. Name: `qso-logbuch`, Sichtbarkeit **Public**, dann **Create repository**.
3. Auf der leeren Repository-Seite **uploading an existing file** anklicken.
4. Den **Inhalt** dieses Ordners (nicht den Ordner selbst) ins Browserfenster ziehen:
   `index.html`, `manifest.webmanifest`, `sw.js`, `README.md` sowie die Ordner `icons` und `lib`.
5. Unten **Commit changes** klicken.
6. **Settings → Pages**: unter „Build and deployment“ bei *Source* **Deploy from a branch** wählen,
   Branch **main** und Ordner **/ (root)**, dann **Save**.
7. Nach ein bis zwei Minuten ist die App erreichbar unter
   `https://<dein-github-name>.github.io/qso-logbuch/`

## Auf dem iPhone als App ablegen

1. Die Adresse in **Safari** öffnen.
2. **Teilen** → **Zum Home-Bildschirm** → **Hinzufügen**.
3. Ab jetzt immer über das Symbol auf dem Home-Bildschirm starten.

Wichtig: Die Home-Bildschirm-App und ein normaler Safari-Tab haben auf dem iPhone getrennte Speicher.
Immer dieselbe Variante benutzen, sonst sieht man zwei verschiedene Logbücher.

Am Mac die Adresse in Safari oder Chrome öffnen. In Chrome kann man sie über das Symbol in der Adressleiste
als App installieren, in Safari über **Ablage → Zum Dock hinzufügen**.

## Daten zwischen Geräten übertragen

Im Logbuch auf **Sicherung** tippen. Das speichert eine `.json`-Datei. Auf dem anderen Gerät mit **Import**
einlesen. Bereits vorhandene Einträge werden dabei nicht doppelt angelegt.
Regelmäßig eine Sicherung zu machen schützt vor Datenverlust, falls Browserdaten gelöscht werden.

## Offline

Nach dem ersten Aufruf funktioniert die App ohne Internet. Kartenausschnitte, die schon einmal angezeigt
wurden, bleiben gespeichert. Die Ortssuche braucht immer eine Internetverbindung; offline Locator eingeben
oder auf die Karte tippen.

## Updates einspielen

1. Die geänderte `index.html` im Repository hochladen (gleicher Name, ersetzt die alte).
2. In `sw.js` die Zeile `const VERSION = 'v1';` hochzählen, z. B. auf `'v2'`, und ebenfalls hochladen.
3. Die App einmal öffnen, schließen und erneut öffnen – dann läuft die neue Version.
   Die Logdaten bleiben dabei erhalten.

## Verwendete Bausteine

- Karte: [Leaflet](https://leafletjs.com) 1.9.4 (BSD-2-Lizenz, siehe `lib/leaflet/LICENSE.txt`)
- Kartendaten: © OpenStreetMap-Mitwirkende
- Ortssuche: Nominatim (OpenStreetMap)
