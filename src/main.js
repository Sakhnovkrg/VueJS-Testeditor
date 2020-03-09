import 'es6-promise/auto';
import Vue from 'vue';
import App from './components/App.vue';

export class TestEditor {
    static get defaultOptions() {
        return {
            textarea: undefined,
            validation: true,
            newQuestionOptionCount: 4
        };
    }

    constructor(opts) {
        this.options = {...this.constructor.defaultOptions, ...opts};
        this.init();
    }

    init() {
        Vue.prototype.$editor = this;

        let el = document.querySelector(this.options.el);
        let textarea = document.querySelector(this.options.textarea);
        this.vm = new Vue({
            el: this.options.el,
            render: h => h(App, {
                props: {
                    id: el.id,
                    textarea: textarea.id,
                    validation: this.options.validation,
                    newQuestionOptionCount: this.options.newQuestionOptionCount
                }
            })
        });
    }
}
