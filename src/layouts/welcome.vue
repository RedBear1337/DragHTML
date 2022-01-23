<template>
  <div class="welcome">
    <span class="welcome__title">
Hello there!<br>
Choose your page size to start
    </span>
    <div class="welcome__group">
      <customCheckbox class="welcome__checkbox" :title="getCheckboxTitle(checkbox.text)" :key="checkbox.id"
                      v-for="checkbox of checkboxes" :checkData="checkbox"
                      @chosen="setChosenWidthUnit">
        {{ checkbox.text }}
      </customCheckbox>
      <input type="text" class="welcome__input" placeholder="Width..." v-model="width"
             @input="filterInput($event.target.value)">
      <applyBtn :applyFunc="apply" :isReady="isApplyReady" class="welcome__apply"/>
    </div>
  </div>
</template>
<script>
import electron from 'electron';
import customCheckbox from "../components/customCheckbox";
import applyBtn from "../components/applyBtn";

export default {
  name: "welcome",
  components: {customCheckbox, applyBtn},
  data() {
    return {
      chosenWidthUnit: 'px',
      width: 0,
    }
  },
  methods: {
    getCheckboxTitle(unit) {
      if (unit == 'px') {
        return 'Pixels'
      } else if (unit == 'mm') {
        return 'Millimeters'
      }
    },
    setChosenWidthUnit(unit) {
      this.chosenWidthUnit = unit;
    },
    filterInput(value) {
      let match = value.match(/(([1-9][0-9]*)?[0-9](\.[0-9]*)?|\.[0-9]+)/g);
      if (!!match) {
        if (match[0] == '0') {
          match = match.slice(1);
        }
        match.join('');
      } else {
        match = '';
      }
      this.width = match;
    },
    getJSONApplyData() {
      let data = {
        width: this.currentWidth,
        format: this.chosenWidthUnit
      }
      return JSON.stringify(data);
    },
    async writeNewProjectData() {
      await electron.ipcRenderer.send('fileOperations', {
        action: 'write',
        fileName: 'project-data',
        data: this.getJSONApplyData(),
        format: 'json'
      })
      this.$store.commit('setWidth', this.currentWidth);
      this.$store.commit('setWidthFormat', this.chosenWidthUnit);
    },
    async setNewProjectData() {
      await electron.ipcRenderer.send('window', {
        action: 'change-width-win', fileName: 'project-data',
        width: this.currentWidth,
        unit: this.chosenWidthUnit,
        winName: 'mainWindow'
      })
    },
    closeModal() {
      let modal = this.$el.parentNode;
      while (modal.id !== 'modal') {
        if (modal.tag !== 'BODY') {
          modal = modal.parentNode;
        } else {
          console.error(new Error('Ошибка при попытке закрыть модальное окно:'), 'id "modal" не найден');
          return;
        }
      }
      modal.style.display = 'none';
    },
    async apply() {
      await this.writeNewProjectData();
      await this.setNewProjectData();
      await this.closeModal();
      // Рассчитать текущий размер окна, отнять размер рабочей области - это будет размер остальных элементов кроме рабочей области
      // Проверка, чтобы окно было не больше размера экрана.
    }
  },
  computed: {
    minWidth() {
      let minWidth = 0;
      if (this.chosenWidthUnit == 'px') {
        minWidth = 100;
      } else if (this.chosenWidthUnit == 'mm') {
        minWidth = 100;
      }
      return minWidth
    },
    currentWidth() {
      return parseInt(this.width);
    },
    isApplyReady() {
      return this.currentWidth >= this.minWidth;
    },
    checkboxes() {
      let checkList = [
        {text: 'px', state: true},
        {text: 'mm', state: false},
      ];
      checkList.forEach(check => {
        check.state = check.text == this.chosenWidthUnit;
      })
      return checkList
    }
  },
  watch: {},
  mounted() {

  }
}
</script>

<style lang="scss">
.welcome {
  z-index: 1000;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: 358px;
  height: 124px;
  padding: 10px 8px 15px;

  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
  background: #B649FF;

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    letter-spacing: 0.1em;

    /* Font/Secondary */

    color: #FFFFFF;
  }

  &__group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__checkbox {
    margin-right: 6px;

    &:nth-last-of-type(2) {
      margin-right: 0;
    }
  }

  &__input {
    height: 32px;
    width: 202px;
    padding: 8px 0px 8px 16px;
    margin-left: 8px;

    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
  }

  &__apply {
    margin: 0 12px 0 20px;
  }
}
</style>