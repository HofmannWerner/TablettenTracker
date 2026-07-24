import { ref, computed } from 'vue'
import flagDe from './assets/flags/de.svg'
import flagEn from './assets/flags/en.svg'
import flagIt from './assets/flags/it.svg'

const currentLang = ref(localStorage.getItem('app_lang') || 'de')

export const languages = [
  { code: 'de', label: 'Deutsch', flag: flagDe },
  { code: 'en', label: 'English', flag: flagEn },
  { code: 'it', label: 'Italiano', flag: flagIt }
]

export const setLanguage = (lang) => {
  if (languages.some(l => l.code === lang)) {
    currentLang.value = lang
    localStorage.setItem('app_lang', lang)
  }
}

export const translations = {
  appTitle: {
    de: 'TablettenTracker',
    en: 'TabletTracker',
    it: 'TracciatorePillole'
  },
  warnfristLabel: {
    de: 'Warnfrist (Tage)',
    en: 'Warning period (days)',
    it: 'Periodo di avviso (giorni)'
  },
  warnfristSaved: {
    de: 'Warnfrist gespeichert',
    en: 'Warning period saved',
    it: 'Periodo di avviso salvato'
  },
  warnfristError: {
    de: 'Fehler beim Speichern der Warnfrist',
    en: 'Error saving warning period',
    it: 'Errore durante il salvataggio del periodo di avviso'
  },
  medikamente: {
    de: 'Medikamente',
    en: 'Medications',
    it: 'Farmaci'
  },
  copyNachbestellung: {
    de: 'Nachbestellungen kopieren',
    en: 'Copy reorders',
    it: 'Copia ordini di ricarica'
  },
  newMedication: {
    de: 'Neuanlegen',
    en: 'Add New',
    it: 'Aggiungi nuovo'
  },
  editMedicationTitle: {
    de: 'Medikament bearbeiten',
    en: 'Edit Medication',
    it: 'Modifica farmaco'
  },
  newMedicationTitle: {
    de: 'Neues Medikament',
    en: 'New Medication',
    it: 'Nuovo farmaco'
  },
  medName: {
    de: 'Medikament Name',
    en: 'Medication Name',
    it: 'Nome del farmaco'
  },
  intakeTimes: {
    de: 'Einnahmezeiten',
    en: 'Intake Times',
    it: 'Orari di assunzione'
  },
  startDate: {
    de: 'Startdatum',
    en: 'Start Date',
    it: 'Data di inizio'
  },
  currentDate: {
    de: 'Aktuelles Datum',
    en: 'Current Date',
    it: 'Dataattuale'
  },
  tabletCount: {
    de: 'Anzahl Tabletten',
    en: 'Tablet Count',
    it: 'Numero di pillole'
  },
  dailyIntake: {
    de: 'Einnahme/Tag',
    en: 'Intake/Day',
    it: 'Assunzione/Giorno'
  },
  dailyIntakeHint: {
    de: 'Einnahme pro Tag (z.B. 1.0, 0.5)',
    en: 'Intake per day (e.g. 1.0, 0.5)',
    it: 'Assunzione al giorno (es. 1.0, 0.5)'
  },
  remaining: {
    de: 'Noch vorhanden',
    en: 'Remaining',
    it: 'Rimanenti'
  },
  daysLeft: {
    de: 'Tage verbleibend',
    en: 'Days Left',
    it: 'Giorni rimasti'
  },
  actions: {
    de: 'Aktionen',
    en: 'Actions',
    it: 'Azioni'
  },
  cancel: {
    de: 'Abbruch',
    en: 'Cancel',
    it: 'Annulla'
  },
  save: {
    de: 'Speichern',
    en: 'Save',
    it: 'Salva'
  },
  delete: {
    de: 'Löschen',
    en: 'Delete',
    it: 'Elimina'
  },
  confirmDeleteTitle: {
    de: 'Löschen',
    en: 'Delete',
    it: 'Elimina'
  },
  confirmDeleteMedMsg: {
    de: 'Möchten Sie {name} wirklich löschen?',
    en: 'Are you sure you want to delete {name}?',
    it: 'Sei sicuro di voler eliminare {name}?'
  },
  ferien: {
    de: 'Ferien',
    en: 'Vacations',
    it: 'Vacanze'
  },
  newVacationTitle: {
    de: 'Neue Ferien',
    en: 'New Vacation',
    it: 'Nuove vacanze'
  },
  editVacationTitle: {
    de: 'Ferien bearbeiten',
    en: 'Edit Vacation',
    it: 'Modifica vacanze'
  },
  bezeichnung: {
    de: 'Bezeichnung',
    en: 'Description',
    it: 'Descrizione'
  },
  beginn: {
    de: 'Beginn',
    en: 'Start Date',
    it: 'Data inizio'
  },
  ende: {
    de: 'Ende',
    en: 'End Date',
    it: 'Data fine'
  },
  confirmDeleteFerienMsg: {
    de: 'Möchten Sie {name} wirklich löschen?',
    en: 'Are you sure you want to delete {name}?',
    it: 'Sei sicuro di voler eliminare {name}?'
  },
  noReorder: {
    de: 'Keine Medikamente zur Nachbestellung.',
    en: 'No medications to reorder.',
    it: 'Nessun farmaco da riordinare.'
  },
  reorderTitle: {
    de: 'Nachbestellungen',
    en: 'Reorders',
    it: 'Riordini'
  },
  copiedTitle: {
    de: 'In Zwischenablage kopiert',
    en: 'Copied to Clipboard',
    it: 'Copiato negli appunti'
  },
  copiedSuccess: {
    de: 'Nachbestellungen in die Zwischenablage kopiert!',
    en: 'Reorders copied to clipboard!',
    it: 'Riordini copiati negli appunti!'
  },
  copiedError: {
    de: 'Kopieren in die Zwischenablage fehlgeschlagen.',
    en: 'Copying to clipboard failed.',
    it: 'Copia negli appunti non riuscita.'
  },
  close: {
    de: 'Schließen',
    en: 'Close',
    it: 'Chiudi'
  },
  loadError: {
    de: 'Fehler beim Laden der Daten',
    en: 'Error loading data',
    it: 'Errore nel caricamento dei dati'
  },
  saveSuccess: {
    de: 'Erfolgreich gespeichert',
    en: 'Successfully saved',
    it: 'Salvato con successo'
  },
  saveError: {
    de: 'Fehler beim Speichern',
    en: 'Error saving',
    it: 'Errore durante il salvataggio'
  },
  quit: {
    de: 'Beenden',
    en: 'Exit',
    it: 'Esci'
  },
  quitConfirmTitle: {
    de: 'Anwendung beenden',
    en: 'Exit Application',
    it: 'Esci dall\'applicazione'
  },
  quitConfirmMsg: {
    de: 'Möchten Sie die Anwendung wirklich beenden?',
    en: 'Do you really want to exit the application?',
    it: 'Vuoi davvero uscire dall\'applicazione?'
  },
  timeMorning: {
    de: 'Morgens',
    en: 'Morning',
    it: 'Mattina'
  },
  timeNoon: {
    de: 'Mittags',
    en: 'Noon',
    it: 'Pomeriggio'
  },
  timeAfternoon: {
    de: 'Nachmittags',
    en: 'Afternoon',
    it: 'Tardo pomeriggio'
  },
  timeEvening: {
    de: 'Abends',
    en: 'Evening',
    it: 'Sera'
  },
  help: {
    de: 'Hilfe',
    en: 'Help',
    it: 'Guida'
  },
  helpTitle: {
    de: 'Anleitung & Hilfe',
    en: 'User Manual & Help',
    it: 'Guida Utente & Aiuto'
  },
  helpMedTitle: {
    de: '💊 Medikamente-Verwaltung',
    en: '💊 Medication Management',
    it: '💊 Gestione dei Farmaci'
  },
  helpMedDesc: {
    de: 'Erfassen Sie Name, Einnahmezeiten, Startdatum, Gesamtmenge und Tagesdosis. Das System berechnet automatisch den verbleibenden Vorrat und die Resttage.',
    en: 'Enter name, intake times, start date, total tablets, and daily dose. The system automatically calculates remaining tablets and days left.',
    it: 'Inserisci nome, orari, data di inizio, pillole totali e dose giornaliera. Il sistema calcola automaticamente la scorta rimanente e i giorni rimasti.'
  },
  helpWarnTitle: {
    de: '⚠️ Automatische Warnfrist & Urlaubsprüfung',
    en: '⚠️ Automatic Warning & Vacation Check',
    it: '⚠️ Avviso Automatico e Controllo Vacanze'
  },
  helpWarnDesc: {
    de: 'Medikamente werden rot markiert, sobald der Vorrat die gewählte Warnfrist unterschreitet ODER der Vorrat in einer eingetragenen Ferienzeit zu Ende geht.',
    en: 'Medications are highlighted in red as soon as remaining days fall below your warning period OR if stock runs out during a planned vacation.',
    it: 'I farmaci vengono evidenziati in rosso se la scorta scende sotto il periodo di avviso O se finisce durante un periodo di vacanza.'
  },
  helpCopyTitle: {
    de: '📋 Nachbestellungen kopieren',
    en: '📋 Copy Reorders',
    it: '📋 Copia Riordini'
  },
  helpCopyDesc: {
    de: 'Kopiert alle rot markierten Medikamente per Klick in die Zwischenablage – ideal zum Einfügen für Rezepte beim Arzt oder der Apotheke.',
    en: 'Copies all red-highlighted medications to the clipboard with one click – ideal for requesting prescriptions at the doctor or pharmacy.',
    it: 'Copia tutti i farmaci evidenziati in rosso negli appunti con un clic – ideale da inviare al medico o in farmacia.'
  },
  helpFerienTitle: {
    de: '🏖️ Ferien- & Urlaubsverwaltung',
    en: '🏖️ Vacation Management',
    it: '🏖️ Gestione Vacanze'
  },
  helpFerienDesc: {
    de: 'Im Tab "Ferien" können Sie Urlaubszeiten eintragen. Diese werden automatisch berücksichtigt, damit Sie vor dem Urlaub rechtzeitig nachbestellen.',
    en: 'In the "Vacations" tab, enter holiday dates. These are automatically factored in so you can reorder before traveling.',
    it: 'Nella scheda "Vacanze", inserisci le date delle ferie. Vengono considerate automaticamente per riordinare prima di partire.'
  },
  helpStorageTitle: {
    de: '💾 Lokale Datenspeicherung',
    en: '💾 Local Data Storage',
    it: '💾 Archiviazione Dati Locale'
  },
  helpStorageDesc: {
    de: 'Alle Daten werden lokal und sicher auf Ihrem Computer in einer SQLite-Datenbank gespeichert. Es werden keine Daten ins Internet übertragen.',
    en: 'All data is stored locally and securely on your computer in an SQLite database. No data is transferred to the internet.',
    it: 'Tutti i dati sono salvati localmente sul tuo computer in un database SQLite. Nessun dato viene trasmesso a Internet.'
  }
}

export const useI18n = () => {
  const currentFlag = computed(() => {
    const l = languages.find(item => item.code === currentLang.value)
    return l ? l.flag : flagDe
  })

  const t = (key, params = {}) => {
    const textObj = translations[key]
    if (!textObj) return key
    let text = textObj[currentLang.value] || textObj['de'] || key
    for (const [pKey, pVal] of Object.entries(params)) {
      text = text.replace(`{${pKey}}`, pVal)
    }
    return text
  }

  return {
    currentLang,
    currentFlag,
    setLanguage,
    t
  }
}
