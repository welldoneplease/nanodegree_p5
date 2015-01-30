var poi = [
  {
    name: 'Alcatraz Island',
    coords: {lat: 37.826978, lng: -122.422956},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=alcatraz_island&format=json&callback=wikiCallback'
  },
  {
    name: 'California Academy of Sciences',
    coords: {lat: 37.769865, lng: -122.466095},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=california_academy_of_sciences&format=json&callback=wikiCallback'
  },
  {
    name: 'Lombard Street',
    coords: {lat: 37.802139, lng: -122.41874},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=lombard_street_(san_francisco)&format=json&callback=wikiCallback'
  },
  {
    name: 'The Castro Theatre',
    coords: {lat: 37.762014, lng: -122.434642},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=castro_theatre&format=json&callback=wikiCallback'
  },
  {
    name: 'The Fillmore',
    coords: {lat: 37.783999, lng: -122.433017},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=the_fillmore&format=json&callback=wikiCallback'
  },
  {
    name: 'Pier 39',
    coords: {lat: 37.808673, lng: -122.409821},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=pier_39&format=json&callback=wikiCallback'
  },
  {
    name: 'Golden Gate Bridge',
    coords: {lat: 37.819929, lng: -122.478255},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=golden_gate_bridge&format=json&callback=wikiCallback'
  },
  {
    name: 'SFMOMA',
    coords: {lat: 37.785718, lng: -122.401051},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=san_francisco_museum_of_modern_art&format=json&callback=wikiCallback'
  },
  {
    name: 'The Presidio',
    coords: {lat: 37.7989746, lng: -122.4661868},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=presidio_of_san_francisco&format=json&callback=wikiCallback'
  },
  {
    name: 'San Francisco Zoo',
    coords: {lat: 37.732957, lng: -122.502955},
    wiki: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=san_francisco_zoo&format=json&callback=wikiCallback'
  }
];

var Marker = function(data) {
  return new google.maps.Marker({
    position: new google.maps.LatLng(data.coords.lat, data.coords.lng),
    title: data.name,
    wiki: data.wiki,
    opacity: 0.7
  });
};


var InfoWindow = function() {

  var obj = new google.maps.InfoWindow({maxWidth: 580});

  var template =
    '<div id="content">'+
      '<h2 id="firstHeading" class="firstHeading">%title%</h2>'+
        '<div id="bodyContent"><p>%content%</p>'+
          '<h4>Images</h4>'+
          '<div id="streetView">'+
            '<img src="http://maps.googleapis.com/maps/api/streetview?size=100x150&location=%myImage%&heading=450">'+
          '</div>'+
          '<div id="flickr">'+
            '%flickrImg%'+
          '</div>'+
        '</div>'+
    '</div>';


  function replaceContent(data) {
    var modifiedTpl = template.replace('%title%', data.title)
                      .replace('%myImage%', data.position.k+','+data.position.D);
    return modifiedTpl;
  }


  obj.showMarkerWindow = function(map, marker) {

    var self = this;

    var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search'+
                    '&api_key=b61b48dd3f3b59e56ecd655157bc97c6&tags=%myTag%&sort=interestingness-desc&lat=%myLat%&lon=%myLng%&'+
                    'per_page=3&format=json&nojsoncallback=1';

    var modTpl = replaceContent(marker);

    var newFlickr = flickrURL.replace('%myTag%', (marker.title.split(' ').join('_')));
    var modFlickr = newFlickr.replace('%myLat%', marker.position.k).replace('%myLng%', marker.position.D);

    console.log(modFlickr);

    $.when(
      $.ajax({
        url: modFlickr,
        dataType: "json",
        error: function() {
          console.log('error with the flickr API');
        }
      }),
      $.ajax({
        url: marker.wiki,
        dataType: "jsonp",
        jsonp: "callback",
        error: function() {
          console.log('error with the wiki API');
        }
      })
    ).then(function(flickrRsp, wikiRsp) {
        var photos = flickrRsp[0].photos.photo;

        imageSnippet = '';
        photos.forEach(function(photo) {
          imageSnippet += '<img src="https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_q.jpg">';
        });

        modTpl = modTpl.replace('%flickrImg%', imageSnippet);
        //console.log(wikiRsp);

        self.setContent(modTpl.replace('%content%', wikiRsp[0][2][0]+' <a href="'+wikiRsp[0][3][0]+'" target="_blank">Read more<a/>'));
        self.open(map, marker);
    });
  };

  return obj;
};




var MapViewModel = function() {
  var self = this;

  // san francisco
  var myLocation = {lat: 37.7900, lng: -122.4176};

  this.map = new google.maps.Map(document.getElementById('map-canvas'),
      {center: myLocation, zoom: 12});

  this.markerList = ko.observableArray([]);

  this.filter = ko.observable('');

  this.infoWindow = new InfoWindow();

  poi.forEach(function(point) {
    // set up markers
    var marker = new Marker(point);

    marker.setMap(this.map);

    // add click event listener to markers
    google.maps.event.addListener(marker, 'click', function() {
      self.setCurrentMarker(marker);
      self.showInfoWindow();
    });

    this.markerList.push(marker);
  }, this);

  this.currentMarker = ko.observable('');

  this.filteredList = function() {
    return ko.utils.arrayFilter(self.markerList(), function(marker) {
      if (marker.title.toLowerCase().indexOf(self.filter().toLowerCase()) > -1) {
        marker.setOpacity(0.7);
        return marker;
      } else {
        marker.setOpacity(0.1);
      }
    });
  };

  this.setCurrentMarker = function(marker) {
    self.currentMarker() && self.currentMarker().setOpacity(0.7);
    self.currentMarker(marker);
    marker.setOpacity(1);
  };

  this.showInfoWindow = function() {
    self.infoWindow.showMarkerWindow(self.map, self.currentMarker());
  };
};

ko.applyBindings(new MapViewModel());

