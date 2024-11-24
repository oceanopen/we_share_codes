<template>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Hello Docker" />
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
    name: 'App',
    components: {
        HelloWorld,
    },
    setup() {
        onMounted(() => {
            axios
                .get('/api/json', {
                    params: {},
                })
                .then((res: any) => {
                    console.log(res);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        });
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
