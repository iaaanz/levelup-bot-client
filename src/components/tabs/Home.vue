<template>
  <div class="text-center">
    <div class="title">
      <img src="../../assets/ui/underline.png" draggable="false" />
    </div>
    <button type="button" class="text-uppercase" @click="$emit('getStarted')">
      Get Started
    </button>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style>
.title {
  margin-top: 150px;
  margin-bottom: 50px;
}
</style>