<template>
  <b-container class="tabcontent">
    <b-row align-h="center">
      <b-col sm="6" class="text-center">
        <b-row align-h="center" class="mt-4">
          <p class="suboption-name">Champions - Pick order in lobby</p>
          <b-col sm="8">
            <b-row>
              <select id="champ1" class="dropdown mb-2"></select>
              <select id="champ2" class="dropdown mb-2"></select>
              <select id="champ3" class="dropdown mb-2"></select>
            </b-row>
          </b-col>
          <p class="mt-3 suboption-name">Gamemode</p>
          <b-col sm="8">
            <b-row>
              <select id="gamemode" class="dropdown mb-2">
                <option value="">Treino (dev)</option>
                <option value="">Introducao (recomendado)</option>
              </select>
            </b-row>
          </b-col>
        </b-row>
      </b-col>

      <b-col sm="6" class="text-center">
        <b-row align-h="center" class="mt-4">
          <p class="suboption-name">Automatic login (in progress...)</p>
          <b-col sm="8">
            <b-row>
              <textarea
                disabled
                rows="1"
                cols="35"
                placeholder="Username"
              ></textarea>
              <textarea
                disabled
                rows="1"
                cols="35"
                placeholder="Password"
                class="mt-2"
              ></textarea>
            </b-row>
          </b-col>
          <b-col sm="8" class="mt-4">
            <b-row>
              <button type="button" onClick="selectDir()">
                Game Directory
              </button>
              <textarea
                disabled
                rows="1"
                class="mt-2"
                id="gamefolder"
                cols="35"
              >
              Ex: C:\Riot Games\League of Legends
              </textarea>
            </b-row>
          </b-col>
        </b-row>
        <!-- <div class="row mt-2 justify-content-center">
          <div class="col-4 ps-0 pe-1">
            <button type="button" class="w-100" onClick="saveConfiguration()">
              Save
            </button>
          </div>
          <div class="col-4 pe-0 ps-1">
            <button type="button" class="w-100" onClick="startBot()">
              Start
            </button>
          </div>
        </div> -->
      </b-col>
      <b-col sm="2" class="text-center">
        <b-row align-h="center" class="mt-5">
          <button
            type="button"
            class="text-uppercase"
            onClick="saveConfiguration()"
          >
            Save
          </button>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Configurations',
};
</script>

<style>
textarea {
  overflow: hidden;
  white-space: nowrap;
  resize: none;
  font-family: 'Open Sans', sans-serif;
  padding: 10px 10px;
  color: rgb(62.7%, 60.8%, 54.9%);
  display: block;
  box-sizing: border-box;
  border: 1px solid #785a28;
  background-color: rgba(0, 0, 0, 0.7);
  appearance: none;
  outline: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25) inset, 0 0 0 1px rgba(0, 0, 0, 0.25);
}

textarea:focus {
  background: linear-gradient(
    to bottom,
    rgba(7, 16, 25, 0.7),
    rgba(32, 39, 44, 0.7)
  );
  border-image: linear-gradient(to bottom, #785a28, #c8aa6e) 1 stretch;
}

textarea:disabled {
  color: rgba(230, 33, 66, 0.7) !important;
  border: 1px solid rgba(230, 33, 66, 0.7);
}

textarea#gamefolder {
  font-size: 13px;
}

textarea#gamefolder:disabled {
  color: rgb(62.7%, 60.8%, 54.9%) !important;
  border: 1px solid #785a28;
}

.tabcontent {
  border-top: none;
  margin-top: 30px;
}

.suboption-name {
  font-size: 16px;
  color: #cdbe91;
  margin-bottom: 5px;
}

.dropdown {
  display: inline-block;
  position: relative;
  cursor: pointer;
  font-family: 'beaufort-bold', sans-serif;
  color: rgb(62.7%, 60.8%, 54.9%);
  letter-spacing: 0.025rem;
  outline: none;
  padding: 10px 14px;
  background-color: rgba(30, 35, 40, 0.5);
  border: 1px solid transparent;
  border-image: linear-gradient(
      to top,
      #695625 0%,
      #a9852d 23%,
      #b88d35 93%,
      #c8aa6e 100%
    )
    1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.dropdown:active {
  background: rgba(30, 35, 40, 0.5);
  color: #463714;
  border: 1px solid #463714;
}

.dropdown:focus {
  background: linear-gradient(
    to top,
    rgba(88, 83, 66, 0.5),
    rgba(30, 35, 40, 0.5)
  );
  border: 1px solid transparent;
  border-image: linear-gradient(to top, #c89b3c, #f0e6d2) 1;
}

.dropdown option {
  position: relative;
  color: #cdbe91;
  cursor: pointer;
  padding: 9px;
  border-top: 1px solid #1f2123 !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: #010a13;
  -o-border-image: linear-gradient(0deg, #695625, #463714) 1;
  border-image: -webkit-linear-gradient(bottom, #695625, #463714) 1;
  border-image: linear-gradient(0deg, #695625, #463714) 1;
  font-size: 13px;
  height: 20px;
}

.dropdown option:hover {
  background-color: #fff;
}

.dropdown option:disabled {
  color: #756c53;
}
</style>
