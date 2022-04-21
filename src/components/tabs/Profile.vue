<template>
  <b-container class="profile-container">
    <b-row>
      <div class="text-center position-absolute profile-layout">
        <img src="../../assets/ui/info2.png" draggable="false" />
      </div>
    </b-row>
    <div class="text-center profile-data">
      <b-row class="text-center profile-icons">
        <div>
          <img
            src="../../assets/ui/default_icon.png"
            class="summoner-icon"
            draggable="false"
          />
        </div>
        <div>
          <img src="../../assets/ui/level.png" draggable="false" />
        </div>
      </b-row>
      <p class="level-level">--</p>
      <p class="info-name">Updating...</p>
      <img src="../../assets/states/online_a.png" draggable="false" />
      <p class="info-bp">Updating...</p>
      <button type="button" class="col-3 start-button text-uppercase">
        Start
      </button>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'Profile',
};
</script>

<style>
.profile-layout {
  z-index: -1;
  top: 110px;
  left: 0;
}

.profile-data {
  z-index: 0;
}

.summoner-icon {
  border-radius: 50%;
  width: 140px;
  height: 140px;
}

.profile-icons {
  margin-bottom: -30px;
}

.level-level {
  color: #f0e6d2;
}

.info-name {
  font-size: 25px;
  color: #f0e6d2;
}

.profile-container {
  margin-top: 45px;
}

.start-button {
  margin-top: 70px;
}
</style>
