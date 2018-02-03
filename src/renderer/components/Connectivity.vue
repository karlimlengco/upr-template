<template>
  <div id="app">
    Connection: <span v-if="online">Online</span> <span v-if="!online">Offline</span>
  </div>
</template>

<script>
var internetAvailable = require("internet-available");
const isOnline = require('is-online');

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
            e.online = 'online'
        }).catch(function(e){
            e.online = false
        });
    }.bind(this), 5000)
  }
}


</script>