# TablettenTracker – Funktionsbeschreibung & Bedienungsanleitung

Der **TablettenTracker** ist eine benutzerfreundliche Desktop-Anwendung zur Verwaltung von Medikamentenvorräten, Einnahmezeiten und Nachbestellungsfristen. Die Anwendung berechnet automatisch, wie lange Ihr Vorrat reicht, warnt rechtzeitig vor dem Ausgehen von Medikamenten und berücksichtigt dabei auch geplante Urlaubs- und Ferienzeiten.

---

## 🌟 Hauptfunktionen im Überblick

### 1. 💊 Medikamentenverwaltung (Tab "Medikamente")
* **Erfassung & Bearbeitung**:
  * **Medikamentenname**: Bezeichnung des Präparats.
  * **Einnahmezeiten**: Beliebige Auswahl aus *Morgens*, *Mittags*, *Nachmittags* und *Abends*.
  * **Startdatum & Aktuelles Datum**: Basis zur genauen Vorratsberechnung.
  * **Anzahl Tabletten**: Gelieferte Gesamtpackungsmenge.
  * **Einnahme pro Tag**: Tägliche Dosis (z. B. `1.0` für eine ganze Tablette, `0.5` für eine halbe Tablette).
* **Automatische Vorratsberechnung**:
  * Berechnet tagesgenau die **noch vorhandene Tablettenanzahl** sowie die **verbleibenden Tage**.
* **Automatische Warnung (Rote Hervorhebung)**:
  * Ein Medikament wird in der Tabelle **rot markiert**, wenn:
    1. Die verbleibenden Tage die gewählte **Warnfrist** (z. B. 14 Tage) unterschreiten.
    2. Das Ende des Vorrats in eine erfasste **Ferien- oder Urlaubszeit** fällt (damit Sie nicht während des Urlaubs ohne Medikamente dastehen).
* **Nachbestellungen in Zwischenablage kopieren**:
  * Mit dem Button **"Nachbestellungen kopieren"** werden alle rot markierten Medikamente als übersichtliche Liste in die Zwischenablage kopiert – ideal zum Einfügen in eine E-Mail an den Arzt oder die Apotheke.

### 2. ⚙️ Warnfrist-Einstellung
* Eingabefeld oben im Medikamente-Tab.
* Legt fest, wie viele Tage vor dem Ausgehen eines Medikaments die Warnung aktiviert wird (Standard: `14` Tage).

### 3. 🏖️ Ferien- & Urlaubsverwaltung (Tab "Ferien")
* Befindet sich in einem eigenen Reiter, da Ferien nur gelegentlich gepflegt werden müssen.
* Erfassung von **Bezeichnung**, **Beginn** und **Ende** des Urlaubs.
* Die Urlaubszeiten fließen direkt in die Warnlogik der Medikamente ein.

### 4. 🌍 Mehrsprachigkeit (Deutsch 🇩🇪 / English 🇬🇧 / Italiano 🇮🇹)
* Über das Flaggen-Icon in der Kopfzeile lässt sich die Sprache jederzeit umschalten.
* Sämtliche Beschriftungen, Tabellen, Dialoge und Datumsformate passen sich sofort der gewählten Sprache an.
* Die Sprachauswahl wird automatisch für den nächsten Start gespeichert.

### 5. 🌙 Dark Mode / Hell-Dunkel-Design
* Umschaltung zwischen hellem und dunklem Erscheinungsbild über das Sonne-/Mond-Icon in der Kopfzeile.

### 6. 🚪 Anwendung beenden
* Über den Beenden-Button (Power-Icon oben rechts) mit Sicherheitsabfrage lässt sich die Anwendung sauber schließen.

---

## 💾 Datenspeicherung & Sicherheit

* Alle Daten werden **lokal auf Ihrem Computer** in einer SQLite-Datenbank (`tracker.db`) gespeichert.
* Es werden keine sensiblen Gesundheitsdaten ins Internet übertragen.
* Speicherort der Datenbank:
  * **Windows**: `%APPDATA%\TablettenTracker\tracker.db`
  * **macOS**: `~/Library/Application Support/TablettenTracker/tracker.db`
  * **Linux**: `~/.config/TablettenTracker/tracker.db`

---

## 🚀 Installation & Ausführung

* **Windows**: Doppelklick auf `TablettenTracker-Windows-amd64.exe`.
* **macOS**: `.dmg`-Datei öffnen und die App in den Ordner `Programme` ziehen.
* **Linux**: Ausführen der ausführbaren Datei `TablettenTracker-Linux-amd64`.
