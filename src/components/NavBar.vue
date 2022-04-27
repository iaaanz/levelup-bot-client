<template>
  <div class="nav-container">
    <div class="drag" />
    <div class="tab-container">
      <img
        src="../assets/ui/selected.png"
        id="selected"
        class="selected"
        draggable="false"
      />
      <div class="tab">
        <b-row>
          <b-tabs v-model="tabIndex">
            <b-tab title="Home" :title-link-class="linkClass()">
              <Home @getStarted="getStarted" />
            </b-tab>
            <b-tab title="Profile" :title-link-class="linkClass()">
              <Profile />
            </b-tab>
            <b-tab title="Configurations" :title-link-class="linkClass()">
              <Configurations />
            </b-tab>
          </b-tabs>
        </b-row>
      </div>
      <div class="controls">
        <button @click="minimizeApp()">
          <b-icon-dash class="h3" />
        </button>
        <button>
          <b-icon-bug-fill class="h6 mt-1" />
        </button>
        <button @click="closeApp()">
          <b-icon-x class="h4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Profile from './tabs/Profile.vue';
import Home from './tabs/Home.vue';
import Configurations from './tabs/Configurations.vue';
import { ipcRenderer } from 'electron';
import { getCurrentWindow } from '@electron/remote';

export default {
  name: 'NavBar',
  components: {
    Home,
    Profile,
    Configurations,
  },
  data() {
    return {
      tabIndex: null,
    };
  },
  methods: {
    getStarted() {
      this.tabIndex = 2;
    },
    closeApp() {
      ipcRenderer.send('closeApp');
    },
    minimizeApp() {
      getCurrentWindow().minimize();
    },
    linkClass() {
      if (this.tabIndex === 0) {
        document.getElementById('selected').style.marginLeft = '0px';
      }
      if (this.tabIndex === 1) {
        document.getElementById('selected').style.marginLeft = '138px';
      }
      if (this.tabIndex === 2) {
        document.getElementById('selected').style.marginLeft = '320px';
      }
    },
  },
};
</script>
<style>
.drag {
  position: absolute;
  width: 90%;
  height: 25px;
  top: 0;
  -webkit-app-region: drag;
}

.tab-container {
  width: 100%;
  border-top: 2px solid #735828;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  height: 100px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0) 80%
  );
}

.nav-item {
  background-color: transparent;
  float: left;
  border: none;
  outline: none;
  padding: 14px 10px;
  transition: 0.3s;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  font-size: 16px;
  margin-left: 33px;
  -webkit-app-region: no-drag;
}

.nav-tabs {
  border: none !important;
}

.nav-link {
  border: none !important;
  color: #cdbe91 !important;
}

.nav-link.active {
  border: none !important;
  background-color: transparent !important;
  color: #f0e6d2 !important;
}

.nav-link:hover {
  border: none !important;
  color: #f0e6d2 !important;
}

.controls button {
  background-color: transparent;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 4px 4px;
  transition: 0.3s;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  font-size: 8px;
  margin-left: 10px;
}

.controls button:hover {
  color: #f0e6d2;
  border: none;
  outline: none;
  cursor: pointer;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}

.controls button.active {
  color: #f0e6d2;
}

.controls {
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  margin-right: 5px;
  margin-top: 5px;
}

.selected {
  position: absolute;
  left: -10px;
}

.tab {
  margin: 0px auto;
  margin-top: 20px;
  overflow: hidden;
}
</style>