<template>
    <div id="app">
        <ul class="router-list">
            <li>
                <router-link :to="{name: 'show'}">Create & Show secret</router-link>
            </li>
            <li>
                <router-link :to="{name: 'recover'}">Recover</router-link>
            </li>
        </ul>
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #555;
        margin-top: 60px;
    }
    .router-list {
        height: 40px;
        width: 400px;
        margin: 0 auto 40px;
    }
    .router-list > li {
        list-style-type: none;
        float: left;
    }
    .router-list > li > a {
        display: block;
        height: 40px;
        width: 160px;
        line-height: 40px;
        border-bottom: 1px solid #ccc;
        text-decoration: none;
        margin: 0 20px;
    }
    button {
        height: 40px;
        min-width: 120px;
        border: none;
        cursor: pointer;
        transition: 0.3s;
        color: #fff;
        margin: 0 6px;
    }
    button:hover {
        background: #f2f2f2;
    }
    input {
        height: 40px;
        box-sizing: border-box;
        padding: 0 10px;
        margin-right: 6px;
    }
    button[disabled='disabled'] {
        cursor: not-allowed;
        background-color: #ccc !important;
    }
</style>
