<template>
  <div id="contextMenu" class="context">
    <contextMenuItem :name="action.name" v-for="action of actions" :key="action.id"
                     @action="doAction"/>
  </div>
</template>

<script>
import contextMenuItem from "./contextMenuItem";

export default {
  name: "contextMenu",
  components: {contextMenuItem},
  props: ['target'],
  data() {
    return {
      actions: [],
      curAction: {},
    }
  },
  methods: {
    /**
     * Генерирует action
     * @param action - объект, содержащий команду, её название и список переменных, которые она будет использовать.
     * @param {string} action.name - название
     * @param {arrowFunc} action.func - стрелочная функция ()=>{...}
     * @param {object} action.vars - переменные в формате {state: false, ...}
     */
    actionGenerate(action) {
      this.actions.push(action);
    },
    getAction(actionName) {
      try {
        this.curAction = this.actions.find(action => action.name === actionName);
      } catch (e) {
        throw 'Не удалось получить action. ' + e;
      }
    },


    doAction(actionName) {
      try {
        this.getAction(actionName);
      } catch (e) {
        console.error('Ошибка при получении action:', e);
      }
      let vars = this.curAction.vars;
      try {
        this.curAction.func(vars);
      } catch (e) {
        console.error(new Error('Ошибка при выполнении action:'), e);
      }

      this.$emit('calledAction', this.curAction.name);
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.actionGenerate(
        {
          name: 'print pussy to console',
          func: () => {
            console.log('=^._.^= ∫');
          }
        })
    if (this.element !== '') {
      this.actionGenerate(
          {
            name: 'switch content editable',
            /**
             * Переключает состояние редактирования текста у элемента
             * @param {object} vars - список переменных
             * @param {string} vars.log - сообщение для вывода в консоль
             * @param {boolean} vars.state - состояние редактирования
             */
            func: (vars) => {

              let changeEditState = () => {
                try {
                  console.log('=^._.^= ∫', `${vars.log} = ${vars.state}`);
                  this.target.parent.contentEditable = vars.state;
                  vars.state = !vars.state;
                } catch (e) {
                  throw 'Не удалось изменить состояние contentEditable. ' + e;
                }

              }

              changeEditState();

              const removeListeners = () => {
                document.removeEventListener('keydown', saveWithEnter);
                document.removeEventListener('click', deselect);
              }

              const addListeners = () => {
                document.addEventListener('keydown', saveWithEnter);
                document.addEventListener('click', deselect);
              }

              /**
               * Завершает редактирование, при нажатии Enter
               * @param evt
               */
              const saveWithEnter = (evt) => {
                if (evt.key === 'Enter') {
                  changeEditState();
                  removeListeners();
                }
              }

              /**
               * Завершает редактирование текста при клике на любую другую область документа, кроме текущего элемента.
               * @param {MouseEvent} evt
               */
              const deselect = (evt) => {
                try {
                  if (
                      evt.target.id !== this.target.resizableContainer.id
                      &&
                      !evt.target.classList.contains('resize__handlers') &&
                      !evt.target.classList.contains('resize') &&
                      !evt.path.some(p => p.id === 'contextMenu')
                  ) {
                    changeEditState();
                    removeListeners();
                  }
                } catch (e) {
                  throw 'Не удалось отключить contentEditable: ' + e;
                }

              }

              addListeners();
            },
            vars: {state: true, log: 'editable'}
          }
      );

      this.actionGenerate(
          {
            name: 'remove element',
            /**
             * Удаляет элемент из DOM дерева
             */
            func: () => {
              console.log('=^._.^= ∫', 'removed');
              try {
                this.target.resizableContainer.remove();
              } catch (e) {
                throw 'Не удалось удалить элемент.' + e;
              }

            }
          })
    }

  }
}
</script>

<style lang="scss">
.context {
  z-index: 1000;
  position: fixed;

  width: 100%;
  max-width: 300px;

  max-height: 600px;
  overflow-y: auto;

  background: rgba(255, 255, 255, 0.20);
  color: black;
}
</style>