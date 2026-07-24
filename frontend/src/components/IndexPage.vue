<template>
  <q-page padding>
    <!-- Navigation Tabs -->
    <q-tabs
      v-model="activeTab"
      dense
      class="text-primary bg-white shadow-2 rounded-borders q-mb-md"
      align="left"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
    >
      <q-tab name="medikamente" icon="medication" :label="t('medikamente')" />
      <q-tab name="ferien" icon="beach_access" :label="t('ferien')" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated class="bg-transparent">
      <!-- Medikamente Tab Panel -->
      <q-tab-panel name="medikamente" class="q-pa-none q-gutter-y-lg">
        <div class="row items-center q-gutter-x-md q-pb-xs">
          <q-input 
            v-model.number="warnfrist" 
            type="number" 
            :label="t('warnfristLabel')" 
            standout="bg-primary text-white"
            bg-color="grey-3"
            label-color="black"
            color="black"
            dense
            style="max-width: 200px"
            @change="saveWarnfrist"
          >
            <template v-slot:prepend>
              <q-icon name="warning" color="negative" />
            </template>
          </q-input>
        </div>

        <!-- Medikamente Table -->
        <q-card class="shadow-4">
          <q-card-section class="row items-center bg-primary text-white">
            <div class="text-h6">{{ t('medikamente') }}</div>
            <q-space />
            <q-btn flat color="white" icon="content_copy" :label="t('copyNachbestellung')" @click="copyNachbestellung()" class="q-mr-sm" />
            <q-btn color="white" text-color="primary" :label="t('newMedication')" icon="add" @click="openMedikamentDialog()" />
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
                  <template v-else-if="col.name === 'zeiten'">
                    {{ formatZeiten(props.row.zeiten) }}
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
      </q-tab-panel>

      <!-- Ferien Tab Panel -->
      <q-tab-panel name="ferien" class="q-pa-none q-gutter-y-lg">
        <!-- Ferien Table -->
        <q-card class="shadow-4">
          <q-card-section class="row items-center bg-secondary text-white">
            <div class="text-h6">{{ t('ferien') }}</div>
            <q-space />
            <q-btn color="white" text-color="secondary" :label="t('newMedication')" icon="add" @click="openFerienDialog()" />
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
      </q-tab-panel>
    </q-tab-panels>

    <!-- Medikament Dialog -->
    <q-dialog v-model="medDialog.show" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ medDialog.isEdit ? t('editMedicationTitle') : t('newMedicationTitle') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md q-gutter-y-md">
          <q-input v-model="medDialog.data.medikament" :label="t('medName')" outlined autofocus />
          <q-select 
            v-model="medDialog.data.zeiten" 
            :options="zeitenOptions" 
            :label="t('intakeTimes')" 
            multiple 
            outlined 
            use-chips 
            emit-value 
            map-options 
          />
          <q-input v-model="medDialog.data.startDatum" :label="t('startDate')" type="date" outlined />
          <q-input v-model="medDialog.data.aktuellesDatum" :label="t('currentDate')" type="date" outlined />
          <q-input v-model.number="medDialog.data.anzahlTabletten" :label="t('tabletCount')" type="number" outlined />
          <q-input v-model.number="medDialog.data.einnahmeTag" :label="t('dailyIntakeHint')" type="number" step="0.5" outlined />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="t('cancel')" v-close-popup />
          <q-btn color="primary" :label="t('save')" @click="saveMedikament" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Ferien Dialog -->
    <q-dialog v-model="ferienDialog.show" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ ferienDialog.isEdit ? t('editVacationTitle') : t('newVacationTitle') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md q-gutter-y-md">
          <q-input v-model="ferienDialog.data.bezeichnung" :label="t('bezeichnung')" outlined autofocus />
          <q-input v-model="ferienDialog.data.beginn" :label="t('beginn')" type="date" outlined />
          <q-input v-model="ferienDialog.data.ende" :label="t('ende')" type="date" outlined />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="t('cancel')" v-close-popup />
          <q-btn color="secondary" :label="t('save')" @click="saveFerien" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { 
  GetMedikamente, CreateMedikament, UpdateMedikament, DeleteMedikament, 
  GetFerien, CreateFerien, UpdateFerien, DeleteFerien, 
  GetWarnfrist, UpdateWarnfrist 
} from '../../wailsjs/go/main/App'
import { useI18n } from '../i18n'

const $q = useQuasar()
const { t, currentLang } = useI18n()

const activeTab = ref('medikamente')
const warnfrist = ref(14)
const medikamente = ref([])
const ferien = ref([])

const zeitenOptions = computed(() => [
  { label: t('timeMorning'), value: 'Morgens' },
  { label: t('timeNoon'), value: 'Mittags' },
  { label: t('timeAfternoon'), value: 'Nachmittags' },
  { label: t('timeEvening'), value: 'Abends' }
])

const formatZeiten = (zeitenStr) => {
  if (!zeitenStr) return ''
  const parts = zeitenStr.split(', ')
  const timeMap = {
    'Morgens': t('timeMorning'),
    'Mittags': t('timeNoon'),
    'Nachmittags': t('timeAfternoon'),
    'Abends': t('timeEvening')
  }
  return parts.map(p => timeMap[p] || p).join(', ')
}

const medColumns = computed(() => [
  { name: 'medikament', label: t('medikamente'), field: 'medikament', align: 'left', sortable: true },
  { name: 'zeiten', label: t('intakeTimes'), field: 'zeiten', align: 'left' },
  { name: 'startDatum', label: t('startDate'), field: 'startDatum', align: 'left' },
  { name: 'aktuellesDatum', label: t('currentDate'), field: 'aktuellesDatum', align: 'left' },
  { name: 'anzahlTabletten', label: t('tabletCount'), field: 'anzahlTabletten', align: 'center' },
  { name: 'einnahmeTag', label: t('dailyIntake'), field: 'einnahmeTag', align: 'center' },
  { name: 'nochvorhanden', label: t('remaining'), field: 'nochvorhanden', align: 'center' },
  { name: 'tageVerbleibend', label: t('daysLeft'), field: 'tageVerbleibend', align: 'center', format: val => val ? val.toFixed(1) : '0' },
  { name: 'actions', label: t('actions'), field: 'actions', align: 'center' }
])

const ferienColumns = computed(() => [
  { name: 'bezeichnung', label: t('bezeichnung'), field: 'bezeichnung', align: 'left', sortable: true },
  { name: 'beginn', label: t('beginn'), field: 'beginn', align: 'left' },
  { name: 'ende', label: t('ende'), field: 'ende', align: 'left' },
  { name: 'actions', label: t('actions'), field: 'actions', align: 'center' }
])

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
    $q.notify({ type: 'negative', message: t('loadError') })
  }
}

const saveWarnfrist = async () => {
  try {
    await UpdateWarnfrist(Number(warnfrist.value))
    $q.notify({ type: 'positive', message: t('warnfristSaved') })
  } catch (e) {
    $q.notify({ type: 'negative', message: t('warnfristError') })
  }
}

// Logic for Red Highlight and Ordering
const needsOrder = (row) => {
  if (row.tageVerbleibend <= warnfrist.value) {
    return true
  }
  
  const outDate = new Date()
  outDate.setDate(outDate.getDate() + row.tageVerbleibend)

  for (let holiday of ferien.value) {
    const start = new Date(holiday.beginn)
    const end = new Date(holiday.ende)
    if (outDate >= start && outDate <= end) {
      return true
    }
  }

  return false
}

const getRowClass = (row) => {
  return needsOrder(row) ? 'bg-red-2 text-red-10 text-weight-bold' : ''
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
    $q.notify({ type: 'positive', message: t('saveSuccess') })
  } catch (e) {
    $q.notify({ type: 'negative', message: t('saveError') })
  }
}

const confirmDeleteMedikament = (row) => {
  $q.dialog({
    title: t('confirmDeleteTitle'),
    message: t('confirmDeleteMedMsg', { name: row.medikament }),
    cancel: { label: t('cancel'), flat: true },
    ok: { label: t('delete'), color: 'negative' },
    persistent: true
  }).onOk(async () => {
    await DeleteMedikament(row.id)
    await loadData()
  })
}

const copyNachbestellung = () => {
  const toOrder = medikamente.value.filter(needsOrder)
  if (toOrder.length === 0) {
    $q.notify({ type: 'info', message: t('noReorder') })
    return
  }
  const textLines = toOrder.map(m => {
    return `- ${m.medikament}`
  })
  const textToCopy = `${t('reorderTitle')}:\n` + textLines.join('\n')
  
  copyToClipboard(textToCopy).then(() => {
    $q.dialog({
      title: t('copiedTitle'),
      message: `<pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${textToCopy}</pre>`,
      html: true,
      ok: t('close')
    })
    $q.notify({ type: 'positive', message: t('copiedSuccess') })
  }).catch(() => {
    $q.notify({ type: 'negative', message: t('copiedError') })
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
    $q.notify({ type: 'positive', message: t('saveSuccess') })
  } catch (e) {
    $q.notify({ type: 'negative', message: t('saveError') })
  }
}

const confirmDeleteFerien = (row) => {
  $q.dialog({
    title: t('confirmDeleteTitle'),
    message: t('confirmDeleteFerienMsg', { name: row.bezeichnung }),
    cancel: { label: t('cancel'), flat: true },
    ok: { label: t('delete'), color: 'negative' },
    persistent: true
  }).onOk(async () => {
    await DeleteFerien(row.id)
    await loadData()
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  const localeMap = { de: 'de-DE', en: 'en-US', it: 'it-IT' }
  return d.toLocaleDateString(localeMap[currentLang.value] || 'de-DE')
}
</script>
