<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" style="--wails-draggable:drag">
      <q-toolbar>
        <q-toolbar-title>
          {{ t('appTitle') }}
        </q-toolbar-title>

        <!-- Help Button -->
        <q-btn flat round dense icon="help_outline" color="white" class="q-mr-xs" @click="showHelp = true">
          <q-tooltip>{{ t('help') }}</q-tooltip>
        </q-btn>

        <!-- Language Switcher Dropdown with SVG Flags -->
        <q-btn-dropdown flat color="white" no-caps class="q-mr-xs">
          <template v-slot:label>
            <img :src="currentFlag" style="width: 24px; height: 16px; object-fit: cover; border-radius: 2px; border: 1px solid rgba(255,255,255,0.5);" />
          </template>
          <q-list>
            <q-item 
              v-for="lang in languages" 
              :key="lang.code" 
              clickable 
              v-close-popup 
              @click="setLanguage(lang.code)"
              :active="currentLang === lang.code"
            >
              <q-item-section avatar style="min-width: 32px;">
                <img :src="lang.flag" style="width: 24px; height: 16px; object-fit: cover; border-radius: 2px; border: 1px solid rgba(0,0,0,0.15);" />
              </q-item-section>
              <q-item-section>
                {{ lang.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Dark Mode Toggle -->
        <q-btn flat round dense :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()" />

        <!-- Quit Button -->
        <q-btn flat round dense icon="power_settings_new" color="white" class="q-ml-sm" @click="confirmQuit">
          <q-tooltip>{{ t('quit') }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <IndexPage />
    </q-page-container>

    <!-- Help Dialog -->
    <q-dialog v-model="showHelp">
      <q-card style="width: 650px; max-width: 90vw;">
        <q-card-section class="bg-primary text-white row items-center">
          <q-icon name="help_outline" size="md" class="q-mr-sm" />
          <div class="text-h6">{{ t('helpTitle') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md" style="max-height: 70vh; overflow-y: auto;">
          <div class="q-gutter-y-md">
            <q-list separator bordered rounded class="bg-white">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold text-primary">{{ t('helpMedTitle') }}</q-item-label>
                  <q-item-label caption class="text-body2 text-grey-9 q-mt-xs">{{ t('helpMedDesc') }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold text-negative">{{ t('helpWarnTitle') }}</q-item-label>
                  <q-item-label caption class="text-body2 text-grey-9 q-mt-xs">{{ t('helpWarnDesc') }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold text-primary">{{ t('helpCopyTitle') }}</q-item-label>
                  <q-item-label caption class="text-body2 text-grey-9 q-mt-xs">{{ t('helpCopyDesc') }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold text-secondary">{{ t('helpFerienTitle') }}</q-item-label>
                  <q-item-label caption class="text-body2 text-grey-9 q-mt-xs">{{ t('helpFerienDesc') }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold text-teal">{{ t('helpStorageTitle') }}</q-item-label>
                  <q-item-label caption class="text-body2 text-grey-9 q-mt-xs">{{ t('helpStorageDesc') }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-2 text-primary">
          <q-btn flat :label="t('close')" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import IndexPage from './components/IndexPage.vue'
import { useI18n, languages } from './i18n'
import { Quit } from '../wailsjs/go/main/App'

const $q = useQuasar()
const { t, currentLang, currentFlag, setLanguage } = useI18n()
const showHelp = ref(false)

const confirmQuit = () => {
  $q.dialog({
    title: t('quitConfirmTitle'),
    message: t('quitConfirmMsg'),
    cancel: {
      label: t('cancel'),
      flat: true
    },
    ok: {
      label: t('quit'),
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    Quit()
  })
}
</script>

<style>
/* Base Wails dragging */
</style>
