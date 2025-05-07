<template>
  <div ref="container" style="width: 100%; height: 500px;"></div>
</template>

<script>
import * as THREE from 'three';

export default {
  name: 'FloorPlan',
  mounted() {
    this.initThreeJS();
  },
  methods: {
    initThreeJS() {
      const width = this.$refs.container.clientWidth;
      const height = this.$refs.container.clientHeight;

      // 创建场景
      const scene = new THREE.Scene();

      // 创建相机
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 10;

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      this.$refs.container.appendChild(renderer.domElement);

      // 创建楼层平面
      const floorGeometry = new THREE.PlaneGeometry(10, 10);
      const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      scene.add(floor);

      // 添加楼层区域（例如教室）
      const roomGeometry = new THREE.PlaneGeometry(3, 3);
      const roomMaterial = new THREE.MeshBasicMaterial({ color: 0x4CAF50 });
      const room = new THREE.Mesh(roomGeometry, roomMaterial);
      room.position.set(1, 1, 0);
      scene.add(room);

      // 渲染循环
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    }
  }
};
</script>

<style scoped>
</style>
