<template>
  <div class="floor-plan-container">
    <svg :width="svgWidth" :height="svgHeight">
      <g v-for="(room, index) in rooms" :key="index">
        <rect
            :x="room.x"
            :y="room.y"
            :width="room.w"
            :height="room.h"
            fill="#e0f7fa"
            stroke="#000"
            stroke-width="2"
            rx="10"
        />
        <text
            :x="room.x + room.w / 2"
            :y="room.y + room.h / 2"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="16"
            fill="#333"
        >
          {{ room.name }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "FloorPlan",
  props: {
    rooms: {
      type: Array,
      required: true
    }
  },
  computed: {
    svgWidth() {
      return Math.max(...this.rooms.map(r => r.x + r.w)) + 20;
    },
    svgHeight() {
      return Math.max(...this.rooms.map(r => r.y + r.h)) + 20;
    }
  }
};
</script>

<style scoped>
.floor-plan-container {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
