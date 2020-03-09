<template>
    <div class="testeditor" v-bind:id="id">
        <draggable @change="updateTextarea()" ghost-class="testeditor-ghost" handle=".testeditor-draggable-handle"
                   v-model="questions"
                   group="questions" @start="drag=true" @end="drag=false">
            <div class="testeditor-question" v-for="(question, i) in questions">
                <div class="testeditor-question-title-wrap">
                    <div title="Переместить" class="testeditor-draggable-handle"><span
                            class="glyphicon glyphicon-move"></span></div>
                    <input @input="updateTextarea" :required="validation" v-model="question.question" type="text"
                           class="form-control testeditor-input">
                    <div class="testeditor-right-buttons">
                        <a title="Удалить" href="#" class="btn btn-link btn-xs testeditor-btn-remove"
                           @click.prevent="removeQuestion(i)"><span
                                class="glyphicon glyphicon-remove"></span></a>
                    </div>
                </div>
                <draggable @change="updateTextarea()" ghost-class="testeditor-ghost"
                           handle=".testeditor-draggable-handle"
                           v-model="question.options" :group="i" @start="drag=true" @end="drag=false">
                    <div class="testeditor-option" v-for="(option, i2) in question.options">
                        <div title="Переместить" class="testeditor-draggable-handle"><span
                                class="glyphicon glyphicon-move"></span></div>
                        <div title="Установить правильный ответ" @click="changeValid(i, i2)" v-if="option.valid === 0"
                             class="testeditor-btn-valid"><span
                                class="glyphicon glyphicon-ok"></span></div>
                        <div title="Правильный ответ" v-if="option.valid === 1" class="testeditor-checked"><span
                                class="glyphicon glyphicon-ok"></span></div>
                        <input @input="updateTextarea" :required="validation" v-model="option.title" type="text"
                               class="form-control testeditor-input">
                        <div class="testeditor-right-buttons">
                            <a title="Удалить" href="#" class="pull-right btn btn-link btn-xs testeditor-btn-remove"
                               @click.prevent="removeOption(i, i2)"><span
                                    class="glyphicon glyphicon-remove"></span></a>
                        </div>

                    </div>
                    <div class="testeditor-add-option-wrap">
                        <a href="#" @click.prevent="addOption(i)" class="btn btn-default btn-sm">Добавить вариант</a>
                    </div>
                </draggable>
            </div>
        </draggable>
        <div class="testeditor-add-question-wrap">
            <a href="#" @click.prevent="addQuestion()" class="btn btn-default btn-sm">Добавить вопрос</a>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import draggable from "vuedraggable";

    Vue.use(draggable);
    export default {
        components: {
            draggable
        },
        props: ['id', 'textarea', 'validation', 'newQuestionOptionCount'],
        data() {
            return {
                message: '',
                questions: ''
            };
        },
        mounted() {
            try {
                this.questions = JSON.parse(document.getElementById(this.textarea).value)
            } catch (e) {
                this.questions = [];
            }
            if (this.questions.length === 0) {
                this.addQuestion();
            }
        },
        computed: {},
        methods: {
            removeQuestion(q) {
                this.questions.splice(q, 1);
                if (this.questions.length === 0) {
                    this.addQuestion();
                }
                this.updateTextarea();
            },
            removeOption(q, o) {
                if (this.questions[q].options[o].valid === 1 && this.questions[q].options[0] !== undefined) {
                    var i = 0;
                    if (o === 0) {
                        i = 1;
                    }
                    if (this.questions[q].options[i] !== undefined) {
                        this.questions[q].options[i].valid = 1;
                    }
                }
                this.questions[q].options.splice(o, 1);
                if (this.questions[q].options[0] === undefined) {
                    this.removeQuestion(q);
                }
                this.updateTextarea();
            },
            changeValid(q, o) {
                this.questions[q].options.forEach(function (item, i) {
                    if (i !== o) {
                        item.valid = 0;
                    } else {
                        item.valid = 1;
                    }
                });
                this.updateTextarea();
            },
            addOption(q) {
                var option = {"title": "Вариант " + (this.questions[q].options.length + 1), "valid": 0};
                this.questions[q].options.push(option);
                this.updateTextarea();
            },
            addQuestion() {
                var question = {
                    "question": "Вопрос " + (this.questions.length + 1),
                    "options": []
                };

                for (var i = 0; i < this.newQuestionOptionCount; i++) {
                    question['options'].push({"title": "Вариант " + (i + 1), "valid": i === 0 ? 1 : 0});
                }
                this.questions.push(question);
                this.updateTextarea();
            },
            updateTextarea() {
                document.getElementById(this.textarea).value = JSON.stringify(this.questions);
            }
        }
    };
</script>

<style>
    .testeditor-question {
        background: #efefef;
        padding: 15px;
        margin-bottom: 7px;
        border-radius: 4px;
        position: relative;
    }

    .testeditor-question-title-wrap {
        font-size: 20px;
        font-weight: bold;
        padding-right: 15px;
        padding-left: 22px;
        margin-bottom: 10px;
    }

    .testeditor-option {
        background: #fff;
        padding: 5px;
        margin-bottom: 5px;
        border-radius: 4px;
        position: relative;
        padding-right: 30px;
    }

    .testeditor-right-buttons {
        position: absolute;
        right: 0;
        top: 0;
    }

    .form-control.testeditor-input {
        border: none;
        box-shadow: none;
        background: transparent;
        padding: 0;
        height: auto;
    }

    .testeditor-draggable-handle {
        width: 20px;
        height: 20px;
        cursor: move;
        position: absolute;
        left: 15px;
        top: 16px;
        font-size: 16px;
        text-align: center;
        line-height: 20px;
        vertical-align: middle;
        color: #999;
    }

    .btn.btn-link.testeditor-btn-remove {
        color: #999;
    }

    .btn.btn-link.testeditor-btn-remove:hover {
        color: #a94442;
    }

    .testeditor-option .testeditor-draggable-handle {
        top: 7px;
        left: 7px;
    }

    .testeditor-btn-valid {
        position: absolute;
        top: 5px;
        left: 30px;
        padding: 0;
        color: #999;
        border: none;
        cursor: pointer;
    }

    .testeditor-btn-valid:hover {
        color: #3c763d;
    }

    .testeditor-checked {
        display: inline;
        color: #3c763d;
        position: absolute;
        top: 5px;
        left: 30px;
        padding: 0;
    }

    .testeditor-option .testeditor-input {
        padding-left: 48px;
    }

    .testeditor-ghost {
        opacity: .35;
    }

    .testeditor-add-option-wrap {
        margin-top: 7px;
    }

    .testeditor-add-question-wrap {
        margin-top: 7px;
        margin-bottom: 15px;
    }
</style>
