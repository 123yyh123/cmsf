<template>
  <div class="marquee-container">
    <div class="marquee" :style="{ animationDuration: `${speed}s` }">
      <span>{{ text }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span>{{ text }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    speed: {
      type: Number,
      default: 10
    }
  }
};
</script>

<style scoped>
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
  height: 40px;
  line-height: 40px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  position: relative;
}

.marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee linear infinite;
}

@keyframes marquee {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
