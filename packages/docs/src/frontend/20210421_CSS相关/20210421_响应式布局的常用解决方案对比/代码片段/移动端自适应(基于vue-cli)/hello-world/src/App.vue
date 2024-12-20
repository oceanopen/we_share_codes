<template>
  <div id="app">
    <img class="logo px2rem" alt="Vue logo" src="./assets/logo.png">
    <img class="viewport-logo viewport" alt="Vue logo" src="./assets/logo.png">
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.logo.px2rem {
  width: 100px;
  height: 100px;
}
.viewport-logo.viewport {
  width: 100px;
  height: 100px;
}
</style>
