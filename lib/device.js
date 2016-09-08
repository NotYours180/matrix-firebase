var refs = require('./util').refs;

module.exports = {
  ping: function(){
    var d = new Date();
    var now = Math.round(d.getTime() / 1000);
    refs.device.child('/runtime/lastConnectionEvent').set(now);
  },
  add: function (options, events) {
    require('./helpers').startDeviceRegister( options, events );    
  },
  get: function ( cb ) {
    refs.device.once( 'value', function ( s ) {
      if ( s.exists() ) cb( null, s.val() )
    }, function ( e ) {
       cb( e )
    } )
  },
  getConfig: function ( cb ) {
    refs.device.child('/config').once( 'value', function ( s ) {
      if ( s.exists() ) cb( null, s.val() )
    }, function ( e ) {
      cb( e )
    } )
  },
  getRuntime: function ( cb ) {
    refs.device.child('/runtime').once( 'value', function ( s ) {
      if ( s.exists() ) cb( null, s.val() )
    }, function ( e ) {
      cb( e )
    })
  },
  meta: function( cb ){
    refs.device.child('meta').once('value',  function ( s ) {
      if ( s.exists() ) cb( null, s.val() )
    }, function ( e ) {
      cb( e )
    })
  },

  // called by Matrix device
  goOnline: function(cb){
    refs.device.child('/runtime/online').set(true, cb);
  },
  goOffline: function(cb){
    refs.device.child('/runtime/online').set(false, cb);
  },


  list: function(cb){
    refs.userDevices.once('value', function( resp ){
      if (resp.exists()){
        cb(resp.val());
      } else { 
        cb(); 
      }
    })
  },

  lookup: function( deviceId, cb ){
    refs.base.ref('devices/' + deviceId + '/public').once('value', function (resp) {
      if ( !resp.exists() ){
        return cb('Device record not found ' + deviceId);
      }
      cb(null, resp.val())
    }, cb)
  }
}