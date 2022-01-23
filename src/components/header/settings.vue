<template>
<div class="settings">
  <!--
   =Настройка сетки - чтобы понять как её сделать(в процентах или по-пиксильно) и
   => с какими ограничениями(какой максимальный шаг сетки), нужно сначала реализовать смену размеров поля.
   =Настройка ширины рабочей зоны
   => наверное при расширении элементы будут двигаться вместе с границами.
   => 2 чекбокса, которые определяют в чём будет измеряться страница:
   ==> Пиксели и миллиметры
   -->
  <h1 class="settings__title">Settings</h1>
  <label class="settings__label">
    <span class="settings__subtitle" title="Minimal path on element move">Grid</span>
    <input type="range" class="settings__range">
  </label>
  <form class="settings__label">
    <span class="settings__subtitle" title="Width of page">
      Page width
    </span>
    <div class="settings__group">
      <label class="settings__inputgroup" title="Pixels">
        <input type="radio" name="width metering" value="px" class="settings__radio" v-model="radio">
        <span class="settings__text">px</span>
      </label>
      <label class="settings__inputgroup" title="Millimeters">
        <input type="radio" name="width metering" value="mm" class="settings__radio" v-model="radio">
        <span class="settings__text">mm</span>
      </label>
    </div>

    <input type="text" class="settings__input" placeholder="width..." v-model="width" @input="width = $event.target.value = $event.target.value.replace(/[^0-9]*/g, '')">

  </form>

  <customBtn :type="'round'" :data="{message: 'Apply'}"></customBtn>
</div>
</template>

<script>
import customBtn from "../customBtn";

export default {
  name: "settings",
  components: {customBtn},
  data() {
    return {
      radio: '',
      width: 0, //**** парсить актуальную ширину рабочей зоны
      // Не давать возможность создавать зону шире разрешения монитора минус ширина других функциональных частей окна
    }
  },
  methods: {
    re(evt) {
      let reg = new RegExp('[^0-9]*','gm');
      let value = evt.target.value;
      value = value.replace(reg, '');
      console.log(value);
    }
  },
  computed: {},
  watch: {},
  mounted() {

  }
}
</script>

<style lang="scss">
.settings {
  z-index: 1000;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: 360px;

  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;

  padding: 10px 10px 20px;

  background: #FFFFFF;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  &__label {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    justify-content: center;

    width: 100%;

    margin-bottom: 10px;
  }

  &__inputgroup {
    display: flex;
    flex-flow: row;
    align-items: flex-end;
    justify-content: flex-start;
  }

  &__group {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  &__title {
    width: 100%;
  }

  &__subtitle {
    margin-bottom: 5px;
  }

  &__input {
    font-size: 16px;
    border: 1px solid #2c3e50;
    padding: 5px;
  }

  &__range {

  }

  &__radio {

  }

  &__text {
    margin-left: 8px;
  }
}
</style>