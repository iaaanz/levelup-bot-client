<template>
  <div id="app">
    <NavBar />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
  },
};
</script>

<style>
@font-face {
  font-family: 'beaufort-bold';
  src: url('assets/fonts/Beaufort-Bold.ttf');
}

@font-face {
  font-family: 'beaufort-regular';
  src: url('assets/fonts/Beaufort-Regular.ttf');
}

body {
  background: linear-gradient(
      to bottom,
      rgba(125, 185, 232, 0) -1%,
      rgba(50, 96, 122, 0) 65%,
      rgba(10, 49, 64, 0.8) 100%
    ),
    url(assets/ui/wallpaper.png);
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  font-family: 'beaufort-bold' !important;
  text-transform: uppercase;
  margin: 0 auto;
  position: fixed;
  width: 100%;
  user-select: none;
}

select {
  text-align-last: center;
  text-align: center;
  -ms-text-align-last: center;
  -moz-text-align-last: center;
}

.titleBar {
  margin-left: 10px;
  width: 100%;
  line-height: 30px;
  margin-top: 5px;
  padding-bottom: 5px;
  -webkit-app-region: drag;
}

.option-name {
  font-size: 25px;
  color: #f0e6d2;
  margin-bottom: 10px;
}

h1 {
  color: #fff;
  font-weight: 100;
  font-size: 59px;
  margin-bottom: 5px;
}

hr {
  width: 350px;
  margin-top: 40px;
  margin-bottom: 40px;
  border: 1px solid #cdbe91;
}

.tier {
  width: 350px !important;
}

.division {
  width: 50px !important;
  margin-top: 3px;
}

.left {
  float: left;
  margin: 2px;
}

.center {
  text-align: center;
}

.end {
  margin-bottom: 50px;
}

.version {
  position: fixed;
  bottom: 15px;
  left: 15px;
  cursor: default;
}

.version-tag {
  margin: 0px;
  color: #a09b8c;
  opacity: 0.5;
  transition: opacity 0.1s ease-in-out;
  text-decoration: none;
}

.version-tag:hover {
  opacity: 1;
  color: #a09b8c;
  text-decoration: none;
}

.icon {
  font-size: 20px !important;
}

::-webkit-scrollbar {
  width: 7px;
  border-radius: 5px;
}

::-webkit-scrollbar * {
  background: transparent;
}

::-webkit-scrollbar-track-piece:start {
  background: transparent;
}

::-webkit-scrollbar-track-piece:end {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #9b722c;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d4b373;
}

button {
  display: inline-block;
  position: relative;
  font-family: 'beaufort-bold', cursive;
  text-transform: uppercase;
  color: #cdbe91;
  font-weight: 100;
  letter-spacing: 1px;
  white-space: nowrap;
  padding: 9px 21px;
  cursor: pointer;
  box-shadow: 0 0 1px 1px #010a13, inset 0 0 1px 1px #010a13;
  background: #1e2328;
  border: 2px solid transparent;
  border-image: linear-gradient(
    to top,
    #785b28 0%,
    #c89c3c 55%,
    #c8a355 71%,
    #c8aa6e 100%
  );
  border-image-slice: 1;
  transition: opacity 300ms linear;
  margin-top: 5px;
  transition: color 100ms linear;
}

button:hover {
  color: #f0e6d2;
  border: 2px solid transparent;
  border-image: linear-gradient(
    to top,
    rgb(78.4%, 61.2%, 23.5%) 0%,
    rgb(86.3%, 75.7%, 53.3%) 50%,
    rgb(88.2%, 78.8%, 59.6%) 71%,
    rgb(94.1%, 90.2%, 84.7%) 100%
  );
  border-image-slice: 1;
  box-shadow: 0px 0px 13px 0px rgba(205, 190, 145, 0.39);
  transition: color 100ms linear;
}

button:active {
  color: #e4e1d8;
  border-image: linear-gradient(
    to top,
    #ffffff 0%,
    #ffffff 33%,
    #ffffff 66%,
    #ffffff 100%
  );
  border-image-slice: 1;
  color: #5c5b57;
  transition: color 100ms linear;
  animation: none;
}

button:focus {
  outline: 0;
}

button:after {
  transition: all 0.8s;
}

.sections {
  margin-bottom: 100px;
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

.box {
  height: 600px;
  overflow-y: scroll;
  margin-right: 10px;
}

.info {
  position: absolute;
  margin-left: 35px;
  margin-top: 25px;
}

.float-left {
  float: left;
  margin-right: 5px;
}

.option {
  margin-bottom: 25px;
}

.icon-box {
  position: absolute;
  top: 23px;
  width: 248px;
  height: 140px;
}

.offset {
  margin-top: 25px !important;
}

.info-bp {
  font-size: 15px;
  color: #f0e6d2;
}

.level-box {
  position: absolute;
  top: 155px;
  width: 246px;
  height: 25px;
}

.options {
  font-family: 'beaufort-bold';
  text-transform: none;
  margin: 10px;
  margin-left: 0px;
  color: #a09b8c;
}

.options:hover {
  color: #ceccc4;
}

.warning {
  color: rgba(230, 33, 66, 0.7) !important;
  border: 1px solid rgba(230, 33, 66, 0.7);
}

.warning:hover {
  color: rgba(230, 33, 66, 0.7) !important;
  border: 1px solid rgba(230, 33, 66, 0.7);
}

.warning-sign {
  position: fixed;
  margin-top: 7px;
  margin-left: 5px;
}
</style>
