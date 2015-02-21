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
    // use own image for markers
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QAAAAAAAD5Q7t/'+
          'AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAkAAAAJAB4BxuPAAABdUlEQVRYw+2WPWoCQRSAP1OkSJYUpgw'+
          'BCTlAbuG2Yrkn8C4BG7HyBAHFzs6cIGBnE1KJnUHFYOFKUuxbWCQ7s87PWugHr5n39s23w8wwcOFMCIAIeAOmwEZiKm'+
          'OR1HinArSAOfCribnUVnyuSr+AyGH0fazWNTA2kEljLD2c0bGQSaPjSuYF2DsQ2ksvawaaiXbAh8ROUzuwlQmArWKCd6CWqa/'+
          'JWF79FssNHiqaf+Y0DySX912omvBKI/SoyL2SXIaHbCRn0lMrdK/IfRnmVD21Qj+K3JNhTtVTSx33e6huI1QFYtydslh6Wj'+
          'HC3T00spWB5Clhe0unEbkQugXWDmTW0kuJ7pRBciq6Dn6si+UJy1IFVhars6LgZi6yQgDfQNvih9rSwyl3wMxgdWbyrRcaBkIN'+
          'XzIpwyNkhr5lAB6ARQGZhdSWQrOAULMsmZSeQqZXtgzADTD5R2YiuZPwDCwzMksZOykhybMiRvNeLpOWxIXz4w8DMUFS/q2ywQAAAABJRU5ErkJggg==',
    opacity: 0.7,
    // embed own properties within maps Marker object
    title: data.name,
    wiki: data.wiki
  });
};



var InfoWindow = function() {

  var obj = new google.maps.InfoWindow();


  // InfoWindow template
  var template =
    '<div id="content">'+
      '<h2 id="firstHeading" class="firstHeading">%title%</h2>'+
        '<div id="bodyContent">'+
          '<div id="flickr">'+
            '%flickrImg%'+
          '</div>'+
          '<p>%content%</p>'+
        '</div>'+
    '</div>';


  obj.showMarkerWindow = function(map, marker) {

    var self = this;

    // URL to request flickr images for the POIs
    // queries by:
    // tag= title of the marker
    // position= lat/lng
    // sorts by 'interestingness'
    var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search'+
                    '&api_key=b61b48dd3f3b59e56ecd655157bc97c6&tags=%myTag%&sort=interestingness-desc&lat=%myLat%&lon=%myLng%&'+
                    'per_page=1&format=json&nojsoncallback=1';

    // replace the templates title with actual marker title
    var modTpl = template.replace('%title%', marker.title);

    // modify the flickr request url for this markers needs
    var modFlickr = flickrURL.replace('%myTag%', (marker.title.split(' ').join('_')))
                    .replace('%myLat%', marker.position.k)
                    .replace('%myLng%', marker.position.D);

    // make two ajax calls to flickr and wiki
    // THEN replace the template content with the results
    $.when(
      // flickr ajax call
      $.ajax({
        url: modFlickr,
        dataType: "json",
        error: function() {
          alert('error with the flickr API');
        }
      }),
      $.ajax({
        // wiki ajax call
        url: marker.wiki,
        dataType: "jsonp",
        jsonp: "callback",
        error: function() {
          alert('error with the wiki API');
        }
      })
    // we need a 'when' 'then' structure
    // otherwise the info window might be opened without the result
    // of one of the calls - only if both return successfully it will open
    ).then(function(flickrRsp, wikiRsp) {
        var flickrImg = flickrRsp[0].photos.photo[0],
            wikiContent = wikiRsp[0][2][0],
            wikiLink = wikiRsp[0][3][0];

        // flickr replace
        modTpl = modTpl.replace(
          '%flickrImg%',
          '<img src="https://farm' +flickrImg.farm+
          '.staticflickr.com/' +flickrImg.server+
          '/'+flickrImg.id+'_'+flickrImg.secret+'_q.jpg">'
         );

        // wiki replace
        modTpl = modTpl.replace('%content%', wikiContent+ ' <a href="' +wikiLink+ '" target="_blank">Read more</a>');

        // set the content of the infowindow to be our modified template
        self.setContent(modTpl);

        // finally open the infowindow
        self.open(map, marker);
    });
  };

  return obj;
};



var MapViewModel = function() {
  var self = this;

  // INITIALIZE LOGIC
  // initialize func - executed IF the google API responeded
  this.initialize = function() {
    // san francisco
    var myLocation = {lat: 37.7900, lng: -122.4176};

    // create our map
    self.map = new google.maps.Map(document.getElementById('map-canvas'),
        {center: myLocation, zoom: 12, disableDefaultUI: true});

    // populate our markerList
    poi.forEach(function(point) {
      // set up markers
      var marker = new Marker(point);

      marker.setMap(self.map);

      // add click event listener to markers
      google.maps.event.addListener(marker, 'click', function() {
        self.setCurrentMarker(marker);
        self.showInfoWindow();
      });

      self.markerList.push(marker);
    });
  };

  // MARKER LOGIC
  this.markerList = ko.observableArray([]);

  this.currentMarker = ko.observable('');

  // set current marker as the active marker
  this.setCurrentMarker = function(marker) {
    self.currentMarker() && self.currentMarker().setOpacity(0.7);
    self.currentMarker(marker);
    marker && marker.setOpacity(1);
  };


  // INFOWINDOW LOGIC
  this.infoWindow = new InfoWindow();

  // show the infowindow on either marker or list item click
  this.showInfoWindow = function() {
    self.infoWindow.showMarkerWindow(self.map, self.currentMarker());
  };

  // add click handler for 'closeclick' of infowindow
  google.maps.event.addListener(this.infoWindow, 'closeclick', function() {
    self.setCurrentMarker('');
  });


  // FILTER LOGIC
  this.filter = ko.observable('');

  this.filteredList = function() {
    // creating a filtered list based on search string
    // utilizing knockouts array filter utiliry function
    return ko.utils.arrayFilter(self.markerList(), function(marker) {
      // markers that match the string are left untouched
      if (marker.title.toLowerCase().indexOf(self.filter().toLowerCase()) > -1) {
        marker.setOpacity(0.7);
        return marker;
      } else {
        // markers that are not within search are made more transparent
        marker.setOpacity(0.1);
      }
    });
  };
};


// SET UP FUNCTION
// make sure to show a message to the user if google API is unreachable
function setUp() {
  var map = new MapViewModel();
  google.maps.event.addDomListener(window, 'load', map.initialize);
  ko.applyBindings(map);
}

$.ajax({
  url: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCoGtqcCPsUMHR3Qyu29Y6Ogtqk_7dBsgw&callback=setUp',
  dataType: 'script',
  error: function () {
    alert('There seems to be an issue with your connection, we can\'t reach Google -  please check it and try again');
  }
});
