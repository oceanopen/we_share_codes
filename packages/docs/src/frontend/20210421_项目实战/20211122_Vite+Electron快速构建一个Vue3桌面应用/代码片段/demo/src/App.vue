<template>
  <div>
    <h1>Hello World!</h1>
    We are using Node.js <span id="node-version" />, Chromium <span id="chrome-version" />, and Electron
    <span id="electron-version" />.
  </div>

  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
});
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
