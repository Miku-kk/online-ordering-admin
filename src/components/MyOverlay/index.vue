<template>
  <bm-overlay
    ref="customOverlay"
    :class="{sample: true}"
    pane="labelPane"
    @draw="draw"
  >
    <div @click="handleClick" v-text="text" />
  </bm-overlay>
</template>

<script>
export default {
  // props: ['text', 'position', 'active'],
  props: {
    text: {
      type: String,
      default() {
        return ''
      }
    },
    position: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
    handleClick() {

    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.sample {
  width: 70px;
  height: 25px;
  line-height: 25px;
  background: rgba(0,0,0,0.5);
  // box-shadow: 0 0 5px #000;
  color: #fff;
  text-align: center;
  position: absolute;
}
.sample:after {
  display:block;
  content:'';
  position: absolute;
  width: 0;
  height: 0;
  border-top: 10px solid rgba(0, 0, 0, 0.5);
  border-bottom: 10px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  // filter: blur(1px);
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
