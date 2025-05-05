<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <router-link to="/" class="back-home-btn">Go back home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e45e2, #88d3ce);
  color: white;
  font-family: 'Roboto', sans-serif;
}

.content {
  text-align: center;
  max-width: 400px;
}

h1 {
  font-size: 10rem;
  margin: 0;
  font-weight: 900;
}

p {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.back-home-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ffffff;
  color: #6e45e2;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.back-home-btn:hover {
  background-color: #6e45e2;
  color: #ffffff;
}

.astronaut {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 200px;
}

.astronaut img {
  width: 100%;
}
</style>