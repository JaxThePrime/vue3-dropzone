<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       v-if="name === 'xls'"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-xls">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
    <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"/>
    <path d="M4 15l4 6"/>
    <path d="M4 21l4 -6"/>
    <path
        d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"/>
    <path d="M11 15v6h3"/>
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       v-if="name === 'txt'"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-txt">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
    <path d="M16.5 15h3"/>
    <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"/>
    <path d="M4.5 15h3"/>
    <path d="M6 15v6"/>
    <path d="M18 15v6"/>
    <path d="M10 15l4 6"/>
    <path d="M10 21l4 -6"/>
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       v-if="name === 'doc' || name === 'docx'"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-doc">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
    <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"/>
    <path d="M5 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z"/>
    <path d="M20 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0"/>
    <path d="M12.5 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -3 0v-3a1.5 1.5 0 0 1 1.5 -1.5z"/>
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       v-if="name === 'pdf'"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-pdf">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
    <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"/>
    <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6"/>
    <path d="M17 18h2"/>
    <path d="M20 15h-3v6"/>
    <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z"/>
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       v-if="name === 'csv'"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-csv">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
    <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"/>
    <path d="M7 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0"/>
    <path
        d="M10 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"/>
    <path d="M16 15l2 6l2 -6"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  name: String
})
</script>

<style scoped lang="scss">

</style>