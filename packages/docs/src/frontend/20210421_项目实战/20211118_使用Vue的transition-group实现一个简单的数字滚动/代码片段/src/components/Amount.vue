<template>
  <div class="wrapper">
    <div class="amount">
      <div style="display: flex">
        <span>￥</span>
        <transition-group name="list" tag="p" style="position: relative">
          <div
            v-for="(item, index) in todayAmountComputed"
            :key="item + index"
            style="display: inline-block; position: absolute"
            :style="{
              left: `${index * 53}px`,
              transitionDelay: `${0.1 * index}s`,
            }"
          >
            {{ item }}
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  components: {},
  setup() {
    const todayAmount = ref<string>('0');

    const todayAmountComputed = computed(() => {
      return todayAmount.value.split('');
    });

    onMounted(() => {
      setInterval(() => {
        if (todayAmount.value === '0') {
          todayAmount.value = '1000';
        }
        todayAmount.value = `${Math.floor(Math.random() * 10000)}`;
      }, 2000);
    });

    return {
      todayAmountComputed,
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  padding: 30px;
  max-width: 100%;
  border: 1px solid #eee;
  box-sizing: border-box;

  .amount {
    color: gold;
    font-size: 85px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    :deep(.list-enter-active),
    :deep(.list-leave-active) {
      transition:
        transform 1s ease,
        opacity 1s ease;
    }

    :deep(.list-enter-from) {
      opacity: 0;
      transform: translateY(50%);
    }
    :deep(.list-leave-to) {
      opacity: 0;
      transform: translateY(-50%);
    }
  }
}
</style>
