<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <button @click="clickScreenshotHandler">
    截图
  </button>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue';

function clickScreenshotHandler() {
  html2canvas(document.body).then((canvas) => {
    document.body.appendChild(canvas);
  });
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
