<template>
    <div class="container">
    <div class="row">
        <div class="col-xs-12">
            <div class="jumbotron">
                <h1>Hello.. FuseBox with Vue.js Example</h1>
                <p>What we show here:</p>
                <ul>
                    <li>Using FuseBox HTML plugin to bundle and load Vue Template from HTML file</li>
                    <li>Using FuseBox SASS plugin to compile and bundle SASS files and automatically inject it to page
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-xs-12">
            <h2>Reactivity example</h2>
            <span class="text-info">Current Time is </span><span>{{currentTime}}</span></div>
        <div class="col-xs-12">
            <form>
                <h2>Data binding example</h2>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input class="form-control" type="text" v-model="name">
                </div>
                <span class="text-info">your name is  : {{name}}</span>
            </form>
        </div>

    </div>
</div>  
  

</template>

<script>
    export default {
        data: {
            name: `Mike Reynolds`,
            currentTime: new Date()
        },
        methods: {
            timer() {
                setInterval(() => {
                    this.currentTime = new Date();
                }, 1000)
            }
        },
        mounted() {
            this.timer();
        }
    }
</script>

<style>
    .example {
        color: red;
    }
</style>

<custom1>
    This could be e.g. documentation for the component.
</custom1>