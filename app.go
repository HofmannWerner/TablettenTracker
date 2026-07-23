package main

import (
	"context"
	"database/sql"
	"log"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite"
)

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.initDB()
}

func (a *App) initDB() {
	var err error
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = "."
	}
	appDir := filepath.Join(configDir, "TablettenTracker")
	os.MkdirAll(appDir, 0755)

	dbPath := filepath.Join(appDir, "tracker.db")
	a.db, err = sql.Open("sqlite", dbPath)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}

	a.createTables()
}

func (a *App) createTables() {
	medikamenteTable := `
	CREATE TABLE IF NOT EXISTS medikamente (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		medikament TEXT NOT NULL,
		start_datum DATETIME NOT NULL,
		aktuelles_datum DATETIME,
		anzahl_tabletten INTEGER NOT NULL,
		einnahme_tag REAL NOT NULL,
		zeiten TEXT DEFAULT ''
	);`

	ferienTable := `
	CREATE TABLE IF NOT EXISTS ferien (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		bezeichnung TEXT NOT NULL,
		beginn DATETIME NOT NULL,
		ende DATETIME NOT NULL
	);`

	settingsTable := `
	CREATE TABLE IF NOT EXISTS settings (
		key TEXT PRIMARY KEY,
		value INTEGER NOT NULL
	);`

	if _, err := a.db.Exec(medikamenteTable); err != nil {
		log.Fatalf("Error creating medikamente table: %v", err)
	}

	if _, err := a.db.Exec(ferienTable); err != nil {
		log.Fatalf("Error creating ferien table: %v", err)
	}

	if _, err := a.db.Exec(settingsTable); err != nil {
		log.Fatalf("Error creating settings table: %v", err)
	}

	// Insert default Warnfrist if not exists
	_, _ = a.db.Exec(`INSERT OR IGNORE INTO settings (key, value) VALUES ('warnfrist', 14)`)

	// Upgrade existing database schema: add 'zeiten' column if it doesn't exist
	_, _ = a.db.Exec(`ALTER TABLE medikamente ADD COLUMN zeiten TEXT DEFAULT ''`)
}

// ------------------------------------------
// Models
// ------------------------------------------

type Medikament struct {
	ID              int       `json:"id" db:"id"`
	Medikament      string    `json:"medikament" db:"medikament"`
	StartDatum      time.Time `json:"startDatum" db:"start_datum"`
	AktuellesDatum  time.Time `json:"aktuellesDatum" db:"aktuelles_datum"`
	AnzahlTabletten int       `json:"anzahlTabletten" db:"anzahl_tabletten"`
	EinnahmeTag     float64   `json:"einnahmeTag" db:"einnahme_tag"`
	Zeiten          string    `json:"zeiten" db:"zeiten"`
	Nochvorhanden   int       `json:"nochvorhanden"`
	TageVerbleibend float64   `json:"tageVerbleibend"`
}

type Ferien struct {
	ID          int       `json:"id" db:"id"`
	Bezeichnung string    `json:"bezeichnung" db:"bezeichnung"`
	Beginn      time.Time `json:"beginn" db:"beginn"`
	Ende        time.Time `json:"ende" db:"ende"`
}

func (m *Medikament) calculateRemaining() {
	today := time.Now()
	diff := today.Sub(m.StartDatum).Hours() / 24
	if diff < 0 {
		diff = 0
	}

	used := int(diff * m.EinnahmeTag)
	m.Nochvorhanden = m.AnzahlTabletten - used

	if m.EinnahmeTag > 0 {
		m.TageVerbleibend = float64(m.Nochvorhanden) / m.EinnahmeTag
	} else {
		m.TageVerbleibend = 0
	}
}

// ------------------------------------------
// Methods (Bound to JS)
// ------------------------------------------

func (a *App) GetMedikamente() []Medikament {
	rows, err := a.db.Query("SELECT id, medikament, start_datum, aktuelles_datum, anzahl_tabletten, einnahme_tag, zeiten FROM medikamente")
	if err != nil {
		log.Println("GetMedikamente error:", err)
		return []Medikament{}
	}
	defer rows.Close()

	var meds []Medikament
	for rows.Next() {
		var m Medikament
		var zeiten sql.NullString
		if err := rows.Scan(&m.ID, &m.Medikament, &m.StartDatum, &m.AktuellesDatum, &m.AnzahlTabletten, &m.EinnahmeTag, &zeiten); err != nil {
			log.Println("Scan error:", err)
			continue
		}
		if zeiten.Valid {
			m.Zeiten = zeiten.String
		}
		m.calculateRemaining()
		meds = append(meds, m)
	}
	
	if meds == nil {
		return []Medikament{}
	}
	return meds
}

func (a *App) CreateMedikament(m Medikament) Medikament {
	res, err := a.db.Exec("INSERT INTO medikamente (medikament, start_datum, aktuelles_datum, anzahl_tabletten, einnahme_tag, zeiten) VALUES (?, ?, ?, ?, ?, ?)",
		m.Medikament, m.StartDatum, m.AktuellesDatum, m.AnzahlTabletten, m.EinnahmeTag, m.Zeiten)
	if err != nil {
		log.Println("CreateMedikament error:", err)
		return m
	}

	id, _ := res.LastInsertId()
	m.ID = int(id)
	m.calculateRemaining()
	return m
}

func (a *App) UpdateMedikament(m Medikament) Medikament {
	_, err := a.db.Exec("UPDATE medikamente SET medikament=?, start_datum=?, aktuelles_datum=?, anzahl_tabletten=?, einnahme_tag=?, zeiten=? WHERE id=?",
		m.Medikament, m.StartDatum, m.AktuellesDatum, m.AnzahlTabletten, m.EinnahmeTag, m.Zeiten, m.ID)
	if err != nil {
		log.Println("UpdateMedikament error:", err)
	}
	m.calculateRemaining()
	return m
}

func (a *App) DeleteMedikament(id int) bool {
	_, err := a.db.Exec("DELETE FROM medikamente WHERE id=?", id)
	if err != nil {
		log.Println("DeleteMedikament error:", err)
		return false
	}
	return true
}

func (a *App) GetFerien() []Ferien {
	rows, err := a.db.Query("SELECT id, bezeichnung, beginn, ende FROM ferien")
	if err != nil {
		log.Println("GetFerien error:", err)
		return []Ferien{}
	}
	defer rows.Close()

	var fList []Ferien
	for rows.Next() {
		var f Ferien
		if err := rows.Scan(&f.ID, &f.Bezeichnung, &f.Beginn, &f.Ende); err != nil {
			log.Println("Scan error:", err)
			continue
		}
		fList = append(fList, f)
	}
	
	if fList == nil {
		return []Ferien{}
	}
	return fList
}

func (a *App) CreateFerien(f Ferien) Ferien {
	res, err := a.db.Exec("INSERT INTO ferien (bezeichnung, beginn, ende) VALUES (?, ?, ?)",
		f.Bezeichnung, f.Beginn, f.Ende)
	if err != nil {
		log.Println("CreateFerien error:", err)
		return f
	}

	id, _ := res.LastInsertId()
	f.ID = int(id)
	return f
}

func (a *App) UpdateFerien(f Ferien) Ferien {
	_, err := a.db.Exec("UPDATE ferien SET bezeichnung=?, beginn=?, ende=? WHERE id=?",
		f.Bezeichnung, f.Beginn, f.Ende, f.ID)
	if err != nil {
		log.Println("UpdateFerien error:", err)
	}
	return f
}

func (a *App) DeleteFerien(id int) bool {
	_, err := a.db.Exec("DELETE FROM ferien WHERE id=?", id)
	if err != nil {
		log.Println("DeleteFerien error:", err)
		return false
	}
	return true
}

func (a *App) GetWarnfrist() int {
	var value int
	err := a.db.QueryRow("SELECT value FROM settings WHERE key='warnfrist'").Scan(&value)
	if err != nil {
		return 14
	}
	return value
}

func (a *App) UpdateWarnfrist(warnfrist int) int {
	_, err := a.db.Exec("UPDATE settings SET value=? WHERE key='warnfrist'", warnfrist)
	if err != nil {
		log.Println("UpdateWarnfrist error:", err)
	}
	return warnfrist
}
