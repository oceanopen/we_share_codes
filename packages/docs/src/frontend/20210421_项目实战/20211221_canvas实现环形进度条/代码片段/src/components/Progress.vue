<template>
  <canvas ref="canvasRef" :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }" />
</template>

<script lang="ts">
import BezierEasing from 'bezier-easing';
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';

interface IProgressLineColorStopsItem {
  percent: number;
  color: string;
}

const EASING_MAP = {
  'linear': [0, 0, 1, 1] as const,
  'ease': [0.25, 0.1, 0.25, 1] as const,
  'ease-in': [0.42, 0, 1, 1] as const,
  'ease-out': [0, 0, 0.58, 1] as const,
  'ease-in-out': [0.42, 0, 0.58, 1] as const,
};

type EASING_KEY = keyof typeof EASING_MAP;

export default defineComponent({
  name: 'CircleProgress',
  props: {
    // 圆环半径
    circleRadius: {
      type: Number,
      default: 40,
    },
    circleWidth: {
      type: Number,
      default: 2,
    },
    circleColor: {
      type: String,
      default: '#E5E5E5',
    },
    // 进度圆点
    pointRadius: {
      type: Number,
      default: 6,
    },
    pointColor: {
      type: String,
      default: '#3B77E3',
    },
    showText: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    fontColor: {
      type: String,
      default: '#333',
    },
    formatText: {
      type: Function,
    },
    // 进度弧线
    progressLineWidth: {
      type: Number,
      default: 8,
    },
    progressUseGradient: {
      type: Boolean,
      default: false,
    },
    progressLineColor: {
      type: String,
      default: '#3B77E3',
    },
    // 若 progressUseGradient 为 true，则需要定义此项
    progressLineColorStops: {
      type: Array,
      default: (): IProgressLineColorStopsItem[] => [
        { percent: 0, color: '#13CDE3' },
        { percent: 1, color: '#3B77E3' },
      ],
    },
    // 开始角度
    startDeg: {
      type: Number,
      default: 270,
      validator: (value: number) => {
        return value >= 0 && value < 360;
      },
    },
    // 百分比
    percentage: {
      type: Number,
      default: 50,
      validator: (value: number) => {
        return value >= 0 && value <= 100;
      },
    },
    animated: {
      type: Boolean,
      default: true,
    },
    // 若 animated 为 true，则需要定义此项
    duration: {
      type: Number,
      // 浏览器大约是 60FPS，因此 1s 大约执行 60 次 requestAnimationFrame
      // 默认 1 代表 1S 内渲染完毕，所以 0.5 代表 0.5S，2 代表 2S，以此类推。
      default: 1,
    },
    easing: {
      type: String,
      default: 'linear',
      validator: (value: string) => {
        return Object.keys(EASING_MAP).includes(value);
      },
    },
  },
  setup(props) {
    const {
      startDeg,
      circleRadius,
      circleWidth,
      circleColor,
      pointRadius,
      progressUseGradient,
      progressLineColorStops,
      duration,
      easing,
    } = props;
    const canvasRef = ref<null | HTMLCanvasElement>(null);
    const canvasCtx = ref<null | CanvasRenderingContext2D>(null);
    const progressGradient = ref<null | CanvasGradient>(null);

    const outerRadius = computed(() => circleRadius + pointRadius);
    const canvasSize = computed(() => 2 * outerRadius.value);
    const steps = computed(() => Math.floor(duration * 60));
    const easingFunc = computed(() => {
      const easingInfo = EASING_MAP[easing as EASING_KEY];
      return BezierEasing(easingInfo[0], easingInfo[1], easingInfo[2], easingInfo[3]);
    });

    let animationId: number = 0;

    // 设置渐变色
    function handleGradient() {
      const canvasInstance = canvasRef.value as HTMLCanvasElement;
      canvasCtx.value = canvasInstance.getContext('2d') as CanvasRenderingContext2D;

      if (progressUseGradient) {
        progressGradient.value = canvasCtx.value.createLinearGradient(circleRadius, 0, circleRadius, circleRadius * 2)
        ;(progressLineColorStops as IProgressLineColorStopsItem[]).forEach((item) => {
          ;(progressGradient.value as CanvasGradient).addColorStop(item.percent, item.color);
        });
      }
    }

    // 处理 dpx
    function handleDpx() {
      const canvasInstance = canvasRef.value as HTMLCanvasElement;
      canvasCtx.value = canvasInstance.getContext('2d') as CanvasRenderingContext2D;

      const dpr = Math.max(window.devicePixelRatio, 1);
      // 调整画布物理像素
      canvasInstance.width = canvasSize.value * dpr;
      canvasInstance.height = canvasSize.value * dpr;
      // 同时用 scale 处理倍率
      canvasCtx.value.scale(dpr, dpr);
    }

    // 初始化 canvas
    function initCanvas() {
      // 设置渐变色
      handleGradient();

      // 处理 dpx
      handleDpx();
    }

    // deg 转弧度
    function deg2Arc(deg: number) {
      return (deg / 180) * Math.PI;
    }

    // 根据开始角度和进度百分比求取目标角度
    function getTargetDegByPercentage(percentage: number) {
      if (percentage === 100) {
        return startDeg + 360;
      }
      else {
        const targetDeg = (startDeg + (360 * percentage) / 100) % 360;
        return targetDeg;
      }
    }

    // 根据角度获取圆点的位置
    function getPointPositionByDeg(deg: number) {
      let x = 0;
      let y = 0;
      if (deg >= 0 && deg <= 90) {
        // 0 ~ 90
        x = circleRadius * (1 + Math.cos(deg2Arc(deg)));
        y = circleRadius * (1 + Math.sin(deg2Arc(deg)));
      }
      else if (deg > 90 && deg <= 180) {
        // 90 ~ 180
        x = circleRadius * (1 - Math.cos(deg2Arc(180 - deg)));
        y = circleRadius * (1 + Math.sin(deg2Arc(180 - deg)));
      }
      else if (deg > 180 && deg <= 270) {
        // 180 ~ 270
        x = circleRadius * (1 - Math.sin(deg2Arc(270 - deg)));
        y = circleRadius * (1 - Math.cos(deg2Arc(270 - deg)));
      }
      else {
        // 270 ~ 360
        x = circleRadius * (1 + Math.cos(deg2Arc(360 - deg)));
        y = circleRadius * (1 - Math.sin(deg2Arc(360 - deg)));
      }
      return { x, y };
    }

    // 画圆环
    function drawCircle() {
      const ctx = canvasCtx.value as CanvasRenderingContext2D;

      ctx.strokeStyle = circleColor;
      ctx.lineWidth = circleWidth;
      ctx.beginPath();
      ctx.arc(outerRadius.value, outerRadius.value, circleRadius, 0, deg2Arc(360));
      ctx.stroke();
      ctx.closePath();
    }

    // 画文字
    function drawText() {
      const { showText, fontColor, fontSize } = props;
      const ctx = canvasCtx.value as CanvasRenderingContext2D;

      if (!showText) {
        return;
      }

      ctx.font = `${fontSize}px Arial,"Microsoft YaHei"`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let text = '';
      if (typeof props.formatText === 'function') {
        text = props.formatText();
      }
      ctx.fillText(text, outerRadius.value, outerRadius.value);
    }

    // 画进度弧线
    function drawProgressLine(nextDeg: number) {
      const { progressUseGradient, progressLineColor, progressLineWidth } = props;
      const ctx = canvasCtx.value as CanvasRenderingContext2D;
      const startArc = deg2Arc(startDeg);
      const nextArc = deg2Arc(nextDeg);

      ctx.strokeStyle = progressUseGradient ? (progressGradient.value as CanvasGradient) : progressLineColor;
      ctx.lineWidth = progressLineWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(outerRadius.value, outerRadius.value, circleRadius, startArc, nextArc);
      ctx.stroke();
      ctx.closePath();
    }

    // 画进度圆点
    function drawPoint(nextDeg: number) {
      const { pointColor, progressUseGradient } = props;
      const ctx = canvasCtx.value as CanvasRenderingContext2D;

      const pointPosition = getPointPositionByDeg(nextDeg);

      ctx.fillStyle = progressUseGradient ? (progressGradient.value as CanvasGradient) : pointColor;
      ctx.beginPath();
      ctx.arc(pointPosition.x + pointRadius, pointPosition.y + pointRadius, pointRadius, 0, deg2Arc(360));
      ctx.fill();
      ctx.closePath();
    }

    // 动画绘制
    function animateDrawProgress(beginPercent: number, endPercent: number, stepNo: number, stepTotal: number) {
      const ctx = canvasCtx.value as CanvasRenderingContext2D;
      const canvasInstance = canvasRef.value as HTMLCanvasElement;

      ctx.clearRect(0, 0, canvasInstance.width, canvasInstance.height);

      const nextPercent = beginPercent + (endPercent - beginPercent) * easingFunc.value(stepNo / stepTotal);
      const nextDeg = getTargetDegByPercentage(nextPercent);

      // 画圆环
      drawCircle();

      // 画文字
      drawText();

      // 画进度弧线
      drawProgressLine(nextDeg);

      // 画进度圆点
      drawPoint(nextDeg);

      if (stepNo !== stepTotal) {
        stepNo++;
        animationId = window.requestAnimationFrame(
          animateDrawProgress.bind(null, beginPercent, endPercent, stepNo, stepTotal),
        );
      }
      else {
        window.cancelAnimationFrame(animationId);
        animationId = 0;
      }
    }

    // 渲染内容
    function renderContent() {
      const { percentage, animated } = props;

      if (percentage === 0) {
        animateDrawProgress(0, 0, 0, 0);
      }
      else {
        if (animated) {
          // 用动画来画动态内容
          animateDrawProgress(0, percentage, 1, steps.value);
        }
        else {
          animateDrawProgress(0, percentage, steps.value, steps.value);
        }
      }
    }

    onMounted(async () => {
      // 画布渲染完毕
      await nextTick();

      // 初始化 canvas
      initCanvas();

      // 渲染内容
      renderContent();
    });

    return {
      canvasRef,
      canvasSize,
    };
  },
});
</script>
