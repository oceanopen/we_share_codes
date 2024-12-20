<template>
  <OneStar v-if="viewCom === 'OneStar'" />
  <MeteorShower v-if="viewCom === 'MeteorShower'" />
  <MeteorShowerBg v-if="viewCom === 'MeteorShowerBg'" />
</template>

<script setup lang="ts">
import MeteorShower from './components/MeteorShower.vue';
import MeteorShowerBg from './components/MeteorShowerBg.vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import OneStar from './components/OneStar.vue';

const viewCom = 'MeteorShowerBg' as string;
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
body {
  background: #000;
}
</style>
