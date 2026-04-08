<template>
  <div class="card card-body">
    <h2>Home</h2>
  </div>

  <button id="plusButton">
    <router-link to="/addList">+</router-link>
  </button>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
#plusButton {
  border-radius: 50%;
  background-color: rgb(190, 190, 255);
  color: white;
  width: 50px;
  height: 50px;
  border: none;
  font-size: 30px;
  text-decoration: none !important;

  position: fixed;
  right: 20px;
  bottom: 80px;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
