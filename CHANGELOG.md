<h1 align="center">Changelogs</h1>

## :bookmark: [React-Auctions v1.0.0](https://github.com/tklein1801/React-Auctions/releases/tag/v1.0.0)

#### Hinzugefügt

- **Gewinner** der Auktion festlegen wenn der Countdown abgelaufen ist
- **Hamburger** wird im nun auf Tablets angezeigt
- **Gebote** wurden wieder eingefügt
  - Höhstbietender in der **Verkaufshistorie** für Auktionen anzeigen

#### Überarbeitet

- **Navbar Links** wurden erneuert
- **Footer** überarbeitet
- **Design & Komponenten** wurden ein wenig überarbeitet
- **eu.ui-avatars.eu** anstelle der **Steam Profilbilder** verwenden
- **Fehler bei Verkaufs- & Kaufhistorie** wurde behoben(Einträge haben sich verdoppelt bei Änderungen am Dokument)

#### Entfernt

- **ReallifeRPG** wurde entfernt (Abfrage des Kontostandes, Steam Avatar & Benutzername)
- **Moneybar** Bargeld, Kontostand, Benutername & Icons wurden entfernt

---

## :bookmark: [React-Auctions v0.4.2](https://github.com/tklein1801/React-Auctions/releases/tag/v0.4.2)

#### Hinzugefügt

- **Kaufhistorie** wurde hinzugefügt. Benutzer können nun einsehen welche Angebote durch sie erworben wurden

#### Überarbeitet

- **Komponenten** werden nun mit der Dateiendung `.jsx` gespeichert
- **Stylesheets** für einzelne Komponenten werden nun in einem eigenen Verzeichnis gespeichert
- **Verkaufshistorie** wurde gefixt.
  - Käufer wird angezeigt
  - Status wird nun richtig angezeigt

---

## :bookmark: [React-Auctions v0.4.1](https://github.com/tklein1801/React-Auctions/releases/tag/v0.4.1)

#### Hinzugefügt

- **Profil** kann nun bearbeitet werden d.h. du bist nun in der Lage deine Profildaten zu ändern
  - Bevor du deine E-Mail Adresse ändern kannst musst diese vorher bestätigt werden
- **Verifizieren** du hast nun die Möglichkeit deine E-Mail Adresse zu bestätigen
  - Die Verifizierungs email wird nach dem registrieren abgeschickt kann jedoch später auch noch manuell angefordert werden
- **Angebot**
  - Angebote löschen
    - Nur möglich wenn kein Gebot oder Käufer für das Angebot gegeben ist
  - Weiterleitung & Toast anstelle der Nachricht sollte Angebot nicht gefunden werden

#### Überarbeitet

- **Dateistruktur** wurde ein weniger übersichtlicher gestaltet
- **Breadcrumb** Pfad ist nun dynamisch (Pfad ändert sich wenn man die Seite wechselt)
- **Modals** wurden optisch überarbeitet
  - Modals werden ab sofort in der Datei `./src/components/Modals.jsx` zu finden sein
- **Profil**
  - Steam avatar wird nun von der ReallifeRPG API abgerufen & angezeigt
- **Moneybar** aktualisiert sich gleichzeitig mit dem Authentifizierungsstatus
  - Steam avatar wird nun von der ReallifeRPG API abgerufen & angezeigt

#### Entfernt

- **Angebote** können temporär nur als Sofortkauf eingestellt werden

---

## :bookmark: [React-Auctions v0.4.0](https://github.com/tklein1801/React-Auctions/releases/tag/v0.4.0)

- Profile
  - Create a new offer
  - Show created offers
  - Get status of created offers
- Minor style & component updates

---

## :bookmark: [React-Auctions v0.3.0](https://github.com/tklein1801/React-Auctions/releases/tag/v0.3.0)

- Add usernames using Firestore
- Add error messages if no offers were found
- Move to Firestore instead of using Firebase real-time database
  - get real-time changes
- Update the Moneybar-component
- Remove Bootstrap Row-component
- Minor style changes

---

## :bookmark: [React-Auctions v0.2.1](https://github.com/tklein1801/React-Auctions/releases/tag/v0.2.1)

- Add React Material Toasts
- Fix Navbar on mobile devices

---

## :bookmark: [React-Auctions v0.2](https://github.com/tklein1801/React-Auctions/releases/tag/v0.2)

- Create Sign in & sign up for user
  - Use Firbase for authentification
- Minor style changes
