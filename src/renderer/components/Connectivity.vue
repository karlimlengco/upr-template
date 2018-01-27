<template>
  <div id="app">
    Connection: <span v-if="online">Online</span> <span v-if="!online">Offline</span>
  </div>
</template>

<script>
var internetAvailable = require("internet-available");

export default {
  name: 'app',
  data (){
    return {
      online:false
    }
  },
  computed: {
  },
  mounted: function () {
    var e = this

    setInterval(function () {
        
        internetAvailable({
            timeout: 1000,
            retries: 10,
        }).then(function(){
            console.log("Internet available");
            e.online = 'online'
        }).catch(function(e){
            console.log("No internet");
            e.online = 'offline'
        });
    }.bind(this), 5000)
  }
}


</script>