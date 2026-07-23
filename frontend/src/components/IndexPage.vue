<template>
  <q-page padding class="q-gutter-y-lg">
    <div class="row items-center q-gutter-x-md">
      <q-space />
      <q-input 
        v-model.number="warnfrist" 
        type="number" 
        label="Warnfrist (Tage)" 
        outlined 
        dense
        style="max-width: 150px"
        @change="saveWarnfrist"
      >
        <template v-slot:prepend>
          <q-icon name="warning" color="warning" />
        </template>
      </q-input>
    </div>

    <!-- Medikamente Table -->
    <q-card class="shadow-4">
      <q-card-section class="row items-center bg-primary text-white">
        <div class="text-h6">Medikamente</div>
        <q-space />
        <q-btn flat color="white" icon="content_copy" label="Nachbestellungen kopieren" @click="copyNachbestellung()" class="q-mr-sm" />
        <q-btn color="white" text-color="primary" label="Neuanlegen" icon="add" @click="openMedikamentDialog()" />
      </q-card-section>
      
      <q-table
        :rows="medikamente"
        :columns="medColumns"
        row-key="id"
        flat bordered
        hide-bottom
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props" :class="getRowClass(props.row)">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <!-- Actions Column -->
              <template v-if="col.name === 'actions'">
                <q-btn flat round color="primary" icon="edit" size="sm" @click="openMedikamentDialog(props.row)" />
                <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDeleteMedikament(props.row)" />
              </template>
              <template v-else-if="['startDatum', 'aktuellesDatum'].includes(col.name)">
                {{ formatDate(props.row[col.name]) }}
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>

    <!-- Ferien Table -->
    <q-card class="shadow-4">
      <q-card-section class="row items-center bg-secondary text-white">
        <div class="text-h6">Ferien</div>
        <q-space />
        <q-btn color="white" text-color="secondary" label="Neuanlegen" icon="add" @click="openFerienDialog()" />
      </q-card-section>

      <q-table
        :rows="ferien"
        :columns="ferienColumns"
        row-key="id"
        flat bordered
        hide-bottom
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'actions'">
                <q-btn flat round color="primary" icon="edit" size="sm" @click="openFerienDialog(props.row)" />
                <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDeleteFerien(props.row)" />
              </template>
              <template v-else-if="['beginn', 'ende'].includes(col.name)">
                {{ formatDate(props.row[col.name]) }}
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>

    <!-- Medikament Dialog -->
    <q-dialog v-model="medDialog.show" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ medDialog.isEdit ? 'Medikament bearbeiten' : 'Neues Medikament' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md q-gutter-y-md">
          <q-input v-model="medDialog.data.medikament" label="Medikament Name" outlined autofocus />
          <q-select 
            v-model="medDialog.data.zeiten" 
            :options="['Morgens', 'Mittags', 'Nachmittags', 'Abends']" 
            label="Einnahmezeiten" 
            multiple 
            outlined 
            use-chips 
            emit-value 
            map-options 
          />
          <q-input v-model="medDialog.data.startDatum" label="Start Datum" type="date" outlined />
          <q-input v-model="medDialog.data.aktuellesDatum" label="Aktuelles Datum" type="date" outlined />
          <q-input v-model.number="medDialog.data.anzahlTabletten" label="Anzahl Tabletten" type="number" outlined />
          <q-input v-model.number="medDialog.data.einnahmeTag" label="Einnahme pro Tag (z.B. 1.0, 0.5)" type="number" step="0.5" outlined />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Abbruch" v-close-popup />
          <q-btn color="primary" label="Speichern" @click="saveMedikament" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Ferien Dialog -->
    <q-dialog v-model="ferienDialog.show" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ ferienDialog.isEdit ? 'Ferien bearbeiten' : 'Neue Ferien' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md q-gutter-y-md">
          <q-input v-model="ferienDialog.data.bezeichnung" label="Bezeichnung" outlined autofocus />
          <q-input v-model="ferienDialog.data.beginn" label="Beginn" type="date" outlined />
          <q-input v-model="ferienDialog.data.ende" label="Ende" type="date" outlined />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Abbruch" v-close-popup />
          <q-btn color="secondary" label="Speichern" @click="saveFerien" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { 
  GetMedikamente, CreateMedikament, UpdateMedikament, DeleteMedikament, 
  GetFerien, CreateFerien, UpdateFerien, DeleteFerien, 
  GetWarnfrist, UpdateWarnfrist 
} from '../../wailsjs/go/main/App'

const $q = useQuasar()

const warnfrist = ref(14)
const medikamente = ref([])
const ferien = ref([])

const medColumns = [
  { name: 'medikament', label: 'Medikament', field: 'medikament', align: 'left', sortable: true },
  { name: 'zeiten', label: 'Zeiten', field: 'zeiten', align: 'left' },
  { name: 'startDatum', label: 'Startdatum', field: 'startDatum', align: 'left' },
  { name: 'aktuellesDatum', label: 'Aktuelles Datum', field: 'aktuellesDatum', align: 'left' },
  { name: 'anzahlTabletten', label: 'Anzahl Tabletten', field: 'anzahlTabletten', align: 'center' },
  { name: 'einnahmeTag', label: 'Einnahme/Tag', field: 'einnahmeTag', align: 'center' },
  { name: 'nochvorhanden', label: 'Noch vorhanden', field: 'nochvorhanden', align: 'center' },
  { name: 'tageVerbleibend', label: 'Tage verbleibend', field: 'tageVerbleibend', align: 'center', format: val => val ? val.toFixed(1) : '0' },
  { name: 'actions', label: 'Aktionen', field: 'actions', align: 'center' }
]

const ferienColumns = [
  { name: 'bezeichnung', label: 'Bezeichnung', field: 'bezeichnung', align: 'left', sortable: true },
  { name: 'beginn', label: 'Beginn', field: 'beginn', align: 'left' },
  { name: 'ende', label: 'Ende', field: 'ende', align: 'left' },
  { name: 'actions', label: 'Aktionen', field: 'actions', align: 'center' }
]

// Dialogs state
const medDialog = ref({ show: false, isEdit: false, data: {} })
const ferienDialog = ref({ show: false, isEdit: false, data: {} })

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    warnfrist.value = await GetWarnfrist()
    medikamente.value = await GetMedikamente()
    ferien.value = await GetFerien()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Fehler beim Laden der Daten' })
  }
}

const saveWarnfrist = async () => {
  try {
    await UpdateWarnfrist(Number(warnfrist.value))
    $q.notify({ type: 'positive', message: 'Warnfrist gespeichert' })
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Fehler beim Speichern der Warnfrist' })
  }
}

// Logic for Red Highlight
const getRowClass = (row) => {
  if (row.tageVerbleibend <= warnfrist.value) {
    return 'bg-red-2 text-red-10 text-weight-bold'
  }
  
  const outDate = new Date()
  outDate.setDate(outDate.getDate() + row.tageVerbleibend)

  for (let holiday of ferien.value) {
    const start = new Date(holiday.beginn)
    const end = new Date(holiday.ende)
    if (outDate >= start && outDate <= end) {
      return 'bg-red-2 text-red-10 text-weight-bold'
    }
  }

  return ''
}

// Medikament Actions
const openMedikamentDialog = (row = null) => {
  if (row) {
    medDialog.value = { 
      show: true, 
      isEdit: true, 
      data: { 
        ...row, 
        zeiten: row.zeiten ? row.zeiten.split(', ') : [],
        startDatum: row.startDatum.split('T')[0], 
        aktuellesDatum: row.aktuellesDatum.split('T')[0] 
      } 
    }
  } else {
    medDialog.value = { 
      show: true, 
      isEdit: false, 
      data: { 
        zeiten: [],
        startDatum: new Date().toISOString().split('T')[0], 
        aktuellesDatum: new Date().toISOString().split('T')[0], 
        anzahlTabletten: 0, 
        einnahmeTag: 1.0 
      } 
    }
  }
}

const saveMedikament = async () => {
  try {
    let m = { ...medDialog.value.data }
    m.anzahlTabletten = Number(m.anzahlTabletten)
    m.einnahmeTag = Number(m.einnahmeTag)
    m.zeiten = m.zeiten && m.zeiten.length ? m.zeiten.join(', ') : ''
    m.startDatum = new Date(m.startDatum).toISOString()
    m.aktuellesDatum = new Date(m.aktuellesDatum).toISOString()

    if (medDialog.value.isEdit) {
      await UpdateMedikament(m)
    } else {
      await CreateMedikament(m)
    }
    medDialog.value.show = false
    await loadData()
    $q.notify({ type: 'positive', message: 'Erfolgreich gespeichert' })
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Fehler beim Speichern' })
  }
}

const confirmDeleteMedikament = (row) => {
  $q.dialog({
    title: 'Löschen',
    message: `Möchten Sie ${row.medikament} wirklich löschen?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await DeleteMedikament(row.id)
    await loadData()
  })
}

const copyNachbestellung = () => {
  const toOrder = medikamente.value.filter(m => m.tageVerbleibend <= warnfrist.value)
  if (toOrder.length === 0) {
    $q.notify({ type: 'info', message: 'Keine Medikamente zur Nachbestellung.' })
    return
  }
  const textLines = toOrder.map(m => {
    const zeiten = m.zeiten ? ` (${m.zeiten})` : ''
    return `- ${m.medikament}${zeiten}: Noch ${m.nochvorhanden} Stück vorhanden (${m.tageVerbleibend.toFixed(1)} Tage)`
  })
  const textToCopy = 'Nachbestellungen:\n' + textLines.join('\n')
  
  copyToClipboard(textToCopy).then(() => {
    $q.notify({ type: 'positive', message: 'Nachbestellungen in die Zwischenablage kopiert!' })
  }).catch(() => {
    $q.notify({ type: 'negative', message: 'Kopieren in die Zwischenablage fehlgeschlagen.' })
  })
}

// Ferien Actions
const openFerienDialog = (row = null) => {
  if (row) {
    ferienDialog.value = { 
      show: true, 
      isEdit: true, 
      data: { ...row, beginn: row.beginn.split('T')[0], ende: row.ende.split('T')[0] } 
    }
  } else {
    ferienDialog.value = { 
      show: true, 
      isEdit: false, 
      data: { beginn: new Date().toISOString().split('T')[0], ende: new Date().toISOString().split('T')[0] } 
    }
  }
}

const saveFerien = async () => {
  try {
    let f = { ...ferienDialog.value.data }
    f.beginn = new Date(f.beginn).toISOString()
    f.ende = new Date(f.ende).toISOString()

    if (ferienDialog.value.isEdit) {
      await UpdateFerien(f)
    } else {
      await CreateFerien(f)
    }
    ferienDialog.value.show = false
    await loadData()
    $q.notify({ type: 'positive', message: 'Erfolgreich gespeichert' })
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Fehler beim Speichern' })
  }
}

const confirmDeleteFerien = (row) => {
  $q.dialog({
    title: 'Löschen',
    message: `Möchten Sie ${row.bezeichnung} wirklich löschen?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await DeleteFerien(row.id)
    await loadData()
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('de-DE')
}
</script>
