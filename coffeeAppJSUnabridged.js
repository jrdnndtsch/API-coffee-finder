    
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
  // service = new google.maps.places.PlacesService(map);
  // google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
  var mapOptions = {
    zoom: 12,
    center: app.toronto
    
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);

}

function codeAddress() {
   app.address = app.endPoint;
   geocoder.geocode( { 'address': app.address}, function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
       map.setCenter(results[0].geometry.location);
        app.endResults= (results[0].geometry.location);
        console.log(results[0].geometry.location)
    
       // var marker = new google.maps.Marker({
       //     map: map,
       //     position: results[0].geometry.location,
       //     icon: 'mapMarker.svg'

       // });
     } else {
       alert("Geocode was not successful for the following reason: " + status);
     }

   });
 }

function calcRoute() {
  var request = {
      origin: app.toronto,
      destination: app.endPoint,
      travelMode: google.maps.TravelMode.DRIVING
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
      limit:2,
      query:"coffee"
    },
    success: function(shops){
      console.log(shops);
      app.displayShops(shops);
      app.markCoffee(shops);
     
    }
  })
}
app.markCoffee = function(shops) {
  app.shops = shops.response.venues;

  for (var i = 0; i < app.shops.length; i++) {  
    var infowindow = new google.maps.InfoWindow({
          content:app.shops[i].name
      });
    console.log(infowindow);
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(app.shops[i].location.lat,app.shops[i].location.lng),
        icon: 'mapMarker.svg'

    });
    //only works on the second object of each call
    google.maps.event.addListener(marker, 'click', function() {
       infowindow.open(map, marker);
     });
  }
}
// app.getCoffee2 = function() {
 
//   $.ajax({
//     url: 'https://api.foursquare.com/v2/venues/search',
//     dataType: 'jsonp',
//     type: 'GET',
//     data: {
//       client_id: 'M01QAACEECGNTWIG3C3GEC5BEX3SNLI2EZ4SJ0WHVQEY3ZA5',
//       client_secret: 'YKEJGAP4EJ12E4QR1ZZ3K5WR0W0AZSPDZCOEXKYX3TISEMRU',
//       v: '20151010',
//       ll:app.sw,
//       radius: 1000,
//       limit:5,
//       query:"coffee"
//     },
//     success: function(shops){
//       console.log(shops);
//       app.markCoffee2(shops);
//       app.displayShops(shops);
//     }
//   })
// }


// app.markCoffee2 = function(shops) {
//   var cShops = shops.response.venues;

//   for (var i = 0; i < cShops.length; i++) {
    
//     var marker = new google.maps.Marker({
//         map: map,
//         position: new google.maps.LatLng(cShops[i].location.lat,cShops[i].location.lng),

//     });
//   }
// }

app.displayShops = function(shops){
  $('.shops').html(' ');
  var coffeeShops = shops.response.venues
//only works on one call for get coffee
  for(var i=0; i< coffeeShops.length; i++) {
    app.div = $('<div>').addClass('coffeeShops');
    app.h2 = $('<h2>').text(coffeeShops[i].name);
    app.address = $('<p class = "address">').text(coffeeShops[i].location.address);
    app.div.append(app.h2);
    app.div.append(app.address);
    $('.shops').append(app.div);
  }
   
};

app.append = function(){
 
}



// app.drawPoly = function(){
//   app.ne1 = new google.maps.LatLng(app.toronto.k, app.toronto.D);
//   app.sw1 = new google.maps.LatLng(app.endResults.k, app.endResults.D);

//   console.log(app.ne1 + " " + app.sw1);
    
//   app.bounds = new google.maps.LatLngBounds(app.ne1, app.sw1);
//     console.log(app.bounds);
// }

// app.places = function() {

// var request = {
//     location:app.toronto ,
//     radius: 500,
//     types: ['store']
//   };
//   infowindow = new google.maps.InfoWindow();
//   var service = new google.maps.places.PlacesService(map);
//   service.nearbySearch(request, callback);
//   }
//   function callback(results, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//       for (var i = 0; i < results.length; i++) {
//         createMarker(results[i]);
//       }
//     }
//   }
//   function createMarker(place) {
//     var placeLoc = place.geometry.location;
//     var marker = new google.maps.Marker({
//       map: map,
//       position: place.geometry.location
//     });
//   }

google.maps.event.addDomListener(window, 'load', initialize);
 
 // app.shape = function(){
  // app.weird = if (app.endResults.k > app.toronto.k){
  // new google.maps.LatLng(app.endResults.k, app.endResults.D),
  // new google.maps.LatLng(app.toronto.k, app.toronto.D)
  // } else {
  // new google.maps.LatLng(app.toronto.k, app.toronto.D),
  // new google.maps.LatLng(app.endResults.k, app.endResults.D)
  // };
//  app.rectangle = new google.maps.Rectangle({

//     strokeColor: '#FF0000',
//     strokeOpacity: 0.8,
//     strokeWeight: 2,
//     fillColor: '#FF0000',
//     fillOpacity: 0.35,
//     map: map,
//     bounds: new google.maps.LatLngBounds(
//       new google.maps.LatLng(app.endResults.k, app.endResults.D),
//       new google.maps.LatLng(app.toronto.k, app.toronto.D))

//   });
// }


$('.navicon').on('click', function(){
  $('.dropDown').slideToggle(600);
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