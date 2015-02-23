    
    var app = {};
    app.endPoint = "";


    app.startPoint = navigator.geolocation.getCurrentPosition(function(position) {
     console.log(position);
     app.lat = position.coords.latitude;
     app.lon = position.coords.longitude;
     app.setLocation();
    });

    app.getDestination = function() {
      app.endPoint = $('.destInput').val();
      codeAddress();
      calcRoute();

    };
  


var directionsDisplay;
var geocoder;
var service;
var directionsService = new google.maps.DirectionsService();
var map;
app.toronto = new google.maps.LatLng(43.648285,-79.397899);


app.setLocation = function(){
  app.toronto = new google.maps.LatLng(app.lat, app.lon);
}


function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  geocoder = new google.maps.Geocoder();
  var mapOptions = {
    zoom: 10,
    center: app.toronto,
        styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.bus",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.bus",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#6e769e"
            },
            {
                "visibility": "on"
            }
        ]
    }
]
    };

    var mapElement = document.getElementById('map');
  
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);

}

function codeAddress() {
   app.address = app.endPoint;
   geocoder.geocode( { 'address': app.address}, function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
       map.setCenter(results[0].geometry.location);
        app.endResults= (results[0].geometry.location);
        
     } else {
       alert("Geocode was not successful for the following reason: " + status);
     }

   });
 }

function calcRoute() {
  var request = {
      origin: app.toronto,
      destination: app.endPoint,
      travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
     
      app.ne = app.toronto.k.toFixed(2) + "," + app.toronto.D.toFixed(2);
      app.sw = app.endResults.k.toFixed(2) + "," + app.endResults.D.toFixed(2);
      app.getCoffee(app.ne);
      app.getCoffee(app.sw);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

app.getCoffee = function(location) {
  $.ajax({
    url: 'https://api.foursquare.com/v2/venues/search',
    dataType: 'jsonp',
    type: 'GET',
    data: {
      client_id: 'M01QAACEECGNTWIG3C3GEC5BEX3SNLI2EZ4SJ0WHVQEY3ZA5',
      client_secret: 'YKEJGAP4EJ12E4QR1ZZ3K5WR0W0AZSPDZCOEXKYX3TISEMRU',
      v: '20151010',
      ll:location,
      radius: 1000,
      limit:3,
      query:"coffee"
    },
    success: function(shops){
      console.log('this is shops' + shops);
      app.totalShops = shops;
      app.displayShops(shops);
      app.markCoffee(shops);
     
    }
  })
}
app.markCoffee = function(shops) {
  app.shops = shops.response.venues;
  // console.log(app.shops);
  console.log('I am length' + app.shops.length);
  for (var i = 0; i < app.shops.length; i++) {  
    
    console.log('i am the name' + app.shops[i].name);
    // console.log(infowindow);
    console.log('i am inside the loop' + i)
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(app.shops[i].location.lat,app.shops[i].location.lng),
        icon: 'mapMarker.svg',
        title: app.shops[i].name
    });
    //only works on the second object of each call
    google.maps.event.addListener(marker, 'click', function() {
      console.log(marker);
       var infowindow = new google.maps.InfoWindow({
        content: this.title
       });
       infowindow.open(map, this);
     });
  }
}

app.displayShops = function(shops){
  // $('.shops').html(' ');
  app.coffeeShops = shops.response.venues
  // console.log(app.coffeeShops);
//only works on one call for get coffee
  for(var i=0; i< app.coffeeShops.length; i++) {
    app.div = $('<div>').addClass('coffeeShops');
    app.h2 = $('<h2>').text(app.coffeeShops[i].name);
    app.address = $('<p class = "address">').text(app.coffeeShops[i].location.address);
    app.div.append(app.h2);
    app.div.append(app.address);
    $('.shops').append(app.div);
  }
   
};

app.append = function(){
 
}

google.maps.event.addDomListener(window, 'load', initialize);



$('.navicon').on('click', function(){
  $('.dropDown').slideToggle(600);
});

$('.link').on('click', function(){
  $('.about').slideToggle(600);
  console.log('whoop there it is')
});

$('.close').on('click',function(){
  $('.about').slideToggle(600);
});



    $(function() {
    $('form').on('submit', function(e){
      e.preventDefault();
      app.getDestination(function(){
        $('body').scrollTo('#dynamic');
      });
      $('.destInput').val(' ');
      $('html, body').animate({
          scrollTop: $("#dynamic").offset().top
      }, 1000);
    });//end submit

    }); //end ready


