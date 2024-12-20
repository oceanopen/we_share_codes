<template>
  <button
    class="el-button" :class="[type ? `el-button--${type}` : '', buttonSize ? `el-button--${buttonSize}` : '']"
    @click="handleClick"
  >
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import { isValidComponentSize } from '../../utils/validators';

type IButtonType = PropType<'primary' | 'default'>;

type EmitFn = (evt: MouseEvent) => void;

export default defineComponent({
  name: 'TestButton',

  props: {
    type: {
      type: String as IButtonType,
      default: 'default',
      validator: (val: string) => {
        return ['default', 'primary'].includes(val);
      },
    },
    size: {
      type: String as PropType<ComponentSize>,
      validator: isValidComponentSize,
    },
  },

  emits: ['click'],

  setup(props: any, { emit }) {
    const buttonSize = computed(() => {
      return props.size || 'medium';
    });

    // methods
    const handleClick: EmitFn = (evt: MouseEvent) => {
      emit('click', evt);
    };

    return {
      buttonSize,
      handleClick,
    };
  },
});
</script>

<style>
.el-button {
  display: inline-block;

  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  outline: 0;
  margin: 0;

  text-align: center;
  box-sizing: border-box;
  transition: 0.1s;

  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;

  font-weight: 500;
  line-height: 1;
}
.el-button + .el-button {
  margin-left: 10px;
}

.el-button:focus,
.el-button:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.el-button:active {
  color: #3a8ee6;
  border-color: #3a8ee6;
  outline: 0;
}

.el-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.el-button--primary:focus,
.el-button--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
.el-button--primary:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
}
.el-button--primary:active {
  outline: 0;
}

.el-button--medium {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.el-button--small {
  font-size: 12px;
  border-radius: 3px;
  padding: 9px 15px;
}
</style>
