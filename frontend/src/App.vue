<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" style="--wails-draggable:drag">
      <q-toolbar>
        <q-toolbar-title>
          TablettenTracker (Wails)
        </q-toolbar-title>
        <q-btn flat round dense :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <IndexPage />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import IndexPage from './components/IndexPage.vue'

const $q = useQuasar()
</script>

<style>
/* Base Wails dragging */
</style>
