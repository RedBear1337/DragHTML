<template>
  <div id="contextMenu" class="context">
    <contextMenuItem :text="action.name.text" v-for="action of actions" :key="action.id"
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
     * @param {object} action.args - переменные в формате {state: false, ...}
     */
    actionGenerate(action) {
      this.actions.push(action);
    },
    getAction(actionText) {
      try {
        this.curAction = this.actions.find(action => action.name.text === actionText);
      } catch (e) {
        throw 'Не удалось получить action. ' + e;
      }
    },

    callEmit() {
      this.$emit('calledAction', this.curAction.name.title);
    },

    getArgs() {
      let args = this.curAction.args;
      if (!args) {
        args = {};
      }
      return args;
    },

    doAction(actionText) {
      try {
        this.getAction(actionText);
      } catch (e) {
        console.error(new Error('Ошибка при получении action:'), e);
      }
      let args = this.getArgs();
      try {
        this.curAction.func(args);
      } catch (e) {
        console.error(new Error('Ошибка при выполнении action:'), e);
      }

      // Если args.isWait = true, то функция должна сама вызывает emit, в зависимости от внутренних условий.
      if (!args.isWait) {
        this.callEmit();
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.actionGenerate(
        {
          name: {title: 'print', text: 'print pussy to console'},
          func: () => {
            console.log('=^._.^= ∫');
          }
        })
    if (this.element !== '') {
      this.actionGenerate(
          {
            name: {title: 'edit', text: 'switch content editable'},
            /**
             * Переключает состояние редактирования текста у элемента
             * @param {object} args - список переменных
             * @param {string} args.log - сообщение для вывода в консоль
             * @param {boolean} args.state - состояние редактирования
             */
            func: (args) => {

              let changeEditState = () => {
                try {
                  console.log('=^._.^= ∫', `${args.log} = ${args.state}`);
                  this.target.parent.contentEditable = args.state;
                  args.state = !args.state;
                } catch (e) {
                  throw 'Не удалось изменить состояние contentEditable. ' + e;
                }

              }

              changeEditState();

              const removeListeners = () => {
                document.removeEventListener('keydown', saveWithEnter);
                document.removeEventListener('click', deselect);

                this.callEmit();
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
            args: {state: true, log: 'editable', isWait: true}
          }
      );

      this.actionGenerate(
          {
            name: {title: 'remove', text: 'remove element'},
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