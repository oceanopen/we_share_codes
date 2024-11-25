<template>
    <Progress />
    <Progress circle-color="#425990" :show-text="true" :format-text="formatText" :progress-use-gradient="true" />
    <Progress
        circle-color="#425990"
        :show-text="true"
        :format-text="formatText"
        :progress-use-gradient="true"
        :start-deg="30"
        :percentage="50"
        easing="ease-in-out"
        :duration="2"
    />
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Progress from './components/Progress.vue';

function formatText() {
    return '90%';
}
</script>

<style>
#app {
  text-align: center;
  margin-top: 60px;
}
</style>
