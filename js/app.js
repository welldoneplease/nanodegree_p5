function initialize() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var geoLat = position.coords.latitude,
      geoLng = position.coords.longitude;

    var mapOptions = {
      center: {
        lat: geoLat,
        lng: geoLng
      },
      zoom: 15
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
