/* eslint-disable */
import '../../assets/css/reset.css';
import '../../assets/css/public.less';
import '../../assets/css/style.less';
import '../../assets/css/icon.less';
import '../../assets/css/ant-markdown.css';
import Vue from 'vue/dist/vue.js'
//const Vue = require('vue');
let baseApp = new Vue({
    el: '#app',
    data() {
        return {
            nav: {
                isShow: false
            }
        }
    },
    methods: {

    }
});