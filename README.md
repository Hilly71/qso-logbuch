# QSO-Logbuch

Logbuch für CB- und Amateurfunk-Kontakte mit Karte. Läuft im Browser auf Handy und Rechner, auch offline.
Auf GitHub liegt nur die leere App. Die Logdaten liegen im Browser des jeweiligen Geräts und, wenn die
Synchronisation eingerichtet ist, zusätzlich in deinem eigenen Firebase-Projekt.

## Auf GitHub Pages veröffentlichen

1. Bei github.com anmelden und oben rechts **+ → New repository** wählen.
2. Name: `qso-logbuch`, Sichtbarkeit **Public**, dann **Create repository**.
3. Auf der leeren Repository-Seite **uploading an existing file** anklicken.
4. Den **Inhalt** dieses Ordners (nicht den Ordner selbst) ins Browserfenster ziehen:
   `index.html`, `manifest.webmanifest`, `sw.js`, `firebase-config.js`, `README.md` sowie die Ordner `icons` und `lib`.
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

## Synchronisation zwischen Geräten (Firebase)

Damit iPhone, iPad und Rechner immer denselben Stand haben, gleicht die App das Logbuch über Firebase
(Google) ab. Ohne Netz wird lokal weitergespeichert und später automatisch nachgereicht.

### Einmalig: Firebase einrichten

1. console.firebase.google.com öffnen und mit einem Google-Konto anmelden.
2. **Projekt erstellen**, Name z. B. `qso-logbuch`. Google Analytics wird nicht gebraucht.
3. Links **Authentication → Jetzt starten → Anmeldemethode**: **E-Mail-Adresse/Passwort** aktivieren und speichern.
4. Links **Firestore Database → Datenbank erstellen**: Standort **europe-west3 (Frankfurt)**, im **Produktionsmodus** starten.
5. In der Firestore-Datenbank den Reiter **Regeln** öffnen, den Inhalt durch Folgendes ersetzen und **Veröffentlichen**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

   Damit kann jedes Konto nur seine eigenen Daten lesen und schreiben.
6. Zahnrad oben links → **Projekteinstellungen** → unten bei **Meine Apps** das Web-Symbol `</>` wählen,
   einen Namen eingeben (Firebase Hosting **nicht** ankreuzen) und **App registrieren**.
7. Den angezeigten Block `const firebaseConfig = { … }` kopieren und in `firebase-config.js` eintragen:
   `window.FIREBASE_CONFIG = { apiKey: "…", authDomain: "…", projectId: "…", … };`
   Diese Werte sind nicht geheim; geschützt werden die Daten durch die Regeln aus Schritt 5.
8. `firebase-config.js` ins GitHub-Repository hochladen.

### Auf jedem Gerät

In der App auf **Station & Sync** tippen. Auf dem ersten Gerät **Konto anlegen**, auf allen weiteren mit derselben
E-Mail und demselben Passwort **Anmelden**. Vorhandene Einträge eines Geräts werden beim ersten Anmelden
mit der Cloud zusammengeführt. Oben in der Kopfzeile zeigt ein Punkt den Zustand: grün = synchron,
orange = wird übertragen, grau = offline.

Optional: Wenn dein Konto angelegt ist, kannst du in Firebase unter **Authentication → Einstellungen →
Nutzeraktionen** die Registrierung neuer Konten abschalten. Dann kann niemand sonst dein Firebase-Projekt nutzen.

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
- Synchronisation: Firebase JavaScript SDK 12.19 (Apache-2.0, siehe `lib/firebase/LICENSE.txt`)
