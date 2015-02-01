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
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAwAAAAMADO7oxXAAAB2ElEQVRo3u2ZsU4CQRCGP4wxUWOsLWy0s7BAEzsjoYBQWPESloaSigpegXcgFPZaWFARWyChszCBhtBhTLRgLlFiYJbb2cN4XzLNsjvz/3PscXtASsr/JuM5Xxa4Ba6BI+BYxl+BN+AZeABekja+2IQyMAA+lTGQNb4b6MwJ0HEQvhgdyZEIN8A4hvgoxpIrKDlg5kF8FDPJGYRTYORRfBQjyW1Khnjfec2eMN3YZUPxUZQtDfQDGOhbic86iHhgvin3JXIypl2ftTBQUxavLslRVeaoWRh4VHZ+FZor8WhhQPOooLmX5xR5BhYGporCB4o8B4o8U62oLQcD2xZdiVvLxcBYMefS0xxNLWcDQ8Wce09zNLWcaRDuNtqwMFBUFvfxQ1a0MLADTBxErBsTqaXCZQ+8A22LzizQllomXGF/Ba6sO9Q1FN+1Fg9QMjRQCmEAbE5lnVDiAfIGBvIhDQA8eRT/FFo8wDnz211c8e+SKxHqHgzUkxIPsMv8wWtd8UPJkSiFGAYKSYuPaK4hvpm06O/sAT0H8T1Zs1FcoHvhO5O5G0lFYaCStMhlZIDWEvEtNuBfmVUc8vs71L589ic44+fpbSJjf4oi8CFhcsYNwZ1ESkqKEV9w01rm50sn9gAAAABJRU5ErkJggg==',
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

  // san francisco
  var myLocation = {lat: 37.7900, lng: -122.4176};

  // create our map
  this.map = new google.maps.Map(document.getElementById('map-canvas'),
      {center: myLocation, zoom: 12, disableDefaultUI: true});


  this.infoWindow = new InfoWindow();

  // show the infowindow on either marker or list item click
  this.showInfoWindow = function() {
    self.infoWindow.showMarkerWindow(self.map, self.currentMarker());
  };

  // add click handler for 'closeclick' of infowindow
  google.maps.event.addListener(this.infoWindow, 'closeclick', function() {
    self.setCurrentMarker('');
  });


  this.markerList = ko.observableArray([]);

  // populate our markerList
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


  // filter for search results
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


  this.currentMarker = ko.observable('');

  // set current marker as the active marker
  this.setCurrentMarker = function(marker) {
    self.currentMarker() && self.currentMarker().setOpacity(0.7);
    self.currentMarker(marker);
    marker && marker.setOpacity(1);
  };
};

ko.applyBindings(new MapViewModel());

