<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div>
    <test-button>默认按钮</test-button>
    <test-button type="primary" size="small">
      主要按钮
    </test-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {},
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
