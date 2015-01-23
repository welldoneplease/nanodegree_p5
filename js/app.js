var poi = [
  {
    name: 'Alcatraz Island',
    coords: {lat: 37.826978, lng: -122.422956}
  },
  {
    name: 'California Academy of Sciences',
    coords: {lat: 37.769865, lng: -122.466095}
  },
  {
    name: 'Lombard Street',
    coords: {lat: 37.802139, lng: -122.41874}
  },
  {
    name: 'The Castro Theatre',
    coords: {lat: 37.762014, lng: -122.434642}
  },
  {
    name: 'St Francis Fountain',
    coords: {lat: 37.752855, lng: -122.408336}
  },
]

var Marker = function(data) {
  var obj = new google.maps.Marker({
    position: new google.maps.LatLng(data.coords.lat, data.coords.lng),
    title: data.name,
    loggy: function() {
    }
  });
  return obj;
};


var InfoWindow = function() {
  var obj = new google.maps.InfoWindow();
  return obj;
}




var MapViewModel = function() {
  var self = this;

  this.map = new google.maps.Map(document.getElementById('map-canvas'),
      {center: {lat: 37.7577, lng: -122.4376}, zoom: 12});

  this.markerList = ko.observableArray([]);

  this.infoWindow = new InfoWindow();

  poi.forEach(function(point) {
    var currentMarker = new Marker(point);
        currentMarker.setMap(this.map)

    google.maps.event.addListener(currentMarker, 'click', function() {
      self.infoWindow.setContent('<div id="content"><h1>'+currentMarker.title+'</h1><div>')
      self.infoWindow.open(self.map, currentMarker);
    });

    this.markerList.push(currentMarker);
  }, this)

  this.showInfoWindow = function() {
    self.infoWindow.setContent('<div id="content"><h1 id="firstHeading" class="firstHeading">'+this.title+'</h1><div>')
    self.infoWindow.open(self.map, this);
  }
};

ko.applyBindings(new MapViewModel());

