var castleList = [
    { name: "Warkworth Castle", lat: 55.345211, lng: -1.611844 },
    { name: "Dunstanburgh Castle", lat: 55.491568, lng: -1.592444 },
    { name: "Creswell Castle", lat: 55.233493, lng: -1.540052},
    { name: "Halton Castle", lat: 55.005216, lng: -2.005442 },
    { name: "Wark on Tweed Castle", lat: 55.64287, lng: -2.283561 },
    { name: "Wark in Tyndale Castle", lat: 55.085894, lng: -2.218507 },
    { name: "Haltwhistle Castle", lat: 54.9706, lng: -2.4515 },
    { name: "Bellingham Castle", lat: 55.1428, lng: -2.251 },
    { name: "Dally Castle", lat: 55.1533, lng: -2.3549 },
    { name: "Chipchase Castle", lat: 55.0756, lng: -2.186 },
    { name: "Tarset Castle", lat: 55.163, lng: -2.334 },
    { name: "Ponteland Castle", lat: 55.0503, lng: -1.7417 },
    { name: "Thirlwall Castle", lat: 54.989, lng: -2.532 },
    { name: "Aydon Castle", lat: 54.9904, lng: -2 },
    { name: "Norham Castle", lat: 55.722, lng: -2.149 },
    { name: "Belsay Castle", lat: 55.102, lng: -1.869 },
    { name: "Chillingham Castle", lat: 55.526, lng: -1.905 },
    { name: "Prudhoe Castle", lat: 54.9642, lng: -1.8547 },
    { name: "Berwick Castle", lat: 55.7738, lng: -2.0116 },
    { name: "Bywell Castle", lat: 54.951, lng: -1.925 },
    { name: "Langley Castle", lat: 54.956, lng: -2.259 },
    { name: "Featherstone Castle", lat: 54.943, lng: -2.51 },
    { name: "Blenkinsopp Castle", lat: 54.974, lng: -2.525 },
    { name: "Twizell Castle", lat: 55.683, lng: -2.188 },
    { name: "Callaly Castle", lat: 55.383, lng: -1.921 },
    { name: "Morpeth Castle", lat: 55.164, lng: -1.686 },
    { name: "Haughton Castle", lat: 55.05053, lng: -2.12988 },
    { name: "Cartington Castle", lat: 55.335, lng: -1.94 },
    { name: "Coupland Castle", lat: 55.574, lng: -2.103 },
    { name: "Bamburgh Castle", lat: 55.608, lng: -1.709 },
    { name: "Ford Castle", lat: 55.631, lng: -2.091 },
    { name: "Etal Castle", lat: 55.6481, lng: -2.1207 },
    { name: "Elsdon Castle", lat: 55.2356, lng: -2.0974 },
    { name: "Edlingham Castle", lat: 55.379, lng: -1.82 },
    { name: "Mitford Castle", lat: 55.164, lng: -1.734 },
    { name: "Lindisfarne Castle", lat: 55.669, lng: -1.785 },
    { name: "Dilston Castle", lat: 54.965, lng: -2.039 },
    { name: "Alnwick Castle", lat: 55.41575, lng: -1.70607 },
    { name: "Harbottle Castle", lat: 55.337, lng: -2.109 },
    { name: "Bothal Castle", lat: 55.173, lng: -1.625 }
];

function viewModel()  {
    var self = this;

    self.castles = castleList.sort(function (l, r) { return l.name > r.name ? 1 : -1 });
    self.index = ko.observable();
    self.wiki = ko.observable();
    self.flickr = ko.observableArray();
    self.selectedCastle = ko.observable();
    self.options = self.castles.map(function(element) {
        // JQuery.UI.AutoComplete expects label & value properties, but we can add our own
        return {
            label: element.name,
            value: element.name,
            // This way we still have access to the original object
            object: element
        };
    });
};

var map,
    arrMarkers = [],
    previousMarkerIndex = 0;

ko.bindingHandlers.googlemap = {
    init: function (element, valueAccessor) {
        var
          castleObject = valueAccessor(),
          mapOptions = {
            zoom: 10,
            center: convertToLatLng(castleObject.centerLat, castleObject.centerLng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(element, mapOptions); //global variable

        // Call resize function
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });

        var castleSites = castleObject.castles.sort(function (l, r) { return l.name > r.name ? 1 : -1 });
        for (castle in castleSites)
        {
            var latLng = convertToLatLng(
                castleSites[castle].lat,
                castleSites[castle].lng
            );
            marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: 'images/castle-black15x15.png',
                id: castle
            });

            // Add event listeners for the markers
            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    var index = marker.id,
                        markerLat = marker.position.lat(),
                        markerLng = marker.position.lng(),
                        castle = self.castles[index];

                    assignSelectedCastle(castle);
                    infobubble.close(map, marker);
                    markerSelect(index, castle.name, markerLat, markerLng);
                }
            })(marker));

            google.maps.event.addListener(marker, 'mouseover', (function(castle, marker) {
                return function() {
                    var castleName = castleSites[castle].name;
                    loadWiki(castleName, marker);
                }
            })(castle, marker));

            google.maps.event.addListener(marker, 'mouseout', (function(marker) {
                return function(castleName) {
                    markerMouseOut(marker);
                }
            })(marker));
            arrMarkers.push(marker);
        }
    }
};

ko.bindingHandlers.autoComplete = {
    // Only using init event because the Jquery.UI.AutoComplete widget will take care of the update callbacks
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // valueAccessor = { selected: myselectedCastleObservable, options: myArrayOfLabelValuePairs }
        var settings = valueAccessor();

        self.selectedCastle = settings.selected;
        self.options = settings.options;

        var updateElementValueWithLabel = function (event, ui) {
            // Stop the default behavior
            event.preventDefault();

            // Update the value of the html element with the label
            // of the activated option in the list (ui.item)
            if(ui.item === null) {
                ui.item = '';
            }
            $(element).val(ui.item.label);

            // Update our selectedCastle observable
            if(typeof ui.item !== "undefined") {
                // ui.item - id|label|...
                assignSelectedCastle(ui.item.object)
            }
        };

        $(element).autocomplete({
            source: options,
            delay: 0,
            select: function (event, ui) {
                updateElementValueWithLabel(event, ui);
                var selectedLat = self.selectedCastle().lat,
                    selectedLng = self.selectedCastle().lng,
                    selectedName = self.selectedCastle().name,
                    selectedIndex = findIndex(self.castles, selectedName);
                markerSelect(selectedIndex, selectedName, selectedLat, selectedLng);
            },
            focus: function (event, ui) {
                updateElementValueWithLabel(event, ui);
            },
            change: function (event, ui) {
                updateElementValueWithLabel(event, ui);
            },
        });
    }
};

function assignSelectedCastle(object) {
    self.selectedCastle(object);
}

//Finds the index of teh object in the array
function findIndex(array, comparator) {
    indexes = $.map(array, function(castle, index) {
        if(castle.name == comparator) {
            return index;
        }
    })
    return indexes;
}

//Converts lat & long to LatLng for Google maps
function convertToLatLng(lat, lng) {
    return new google.maps.LatLng(lat, lng);
}

var loadFlickr = function(imgTag, imgLat, imgLng) {
    var query = imgTag.replace(/ /g,'+');
    var flickrRequestTimeout = setTimeout(function() {
        alert("Flickr images could not be loaded");
    }, 8000);

    $.ajax({
        url: 'https://api.flickr.com/services/rest/',
        data: {
            method: 'flickr.photos.search',
            api_key: 'c5d5dfb581a7a72e8afd495ac82b1cde',
            tags: query,
            lat: imgLat,
            lon: imgLng,
            accuracy: 16,
            safe_search: 1,
            content_type: 1,
            radius: 2,
            per_page: 6,
            format:'json'},
        dataType: 'jsonp',
        success: clearTimeout(flickrRequestTimeout)
    });
};

function jsonFlickrApi (response) {
    console.log(
        "Got response from Flickr-API with the following photos: %o", 
        response.photos
    );
    var photoset = response.photos.photo
    var i = 0;
    self.flickr.removeAll();
    console.log(self.flickr());
    for(image in photoset) {
        var photoURL = 'http://farm' + photoset[image].farm + '.static.flickr.com/' + photoset[image].server + '/' + photoset[image].id + '_' + photoset[image].secret + '.jpg';
        self.flickr.push(photoURL);
        console.log(self.flickr());
    }
    console.log(self.flickr()[0]);
}

var loadWiki = function(castle, marker) {
    var query = castle.replace(/ /g,'%20');
    var wikiRequestTimeout = setTimeout(function() {
        self.wiki("Wikipedia articles could not be loaded");
    }, 8000);

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: { action: 'opensearch', search: castle, format: 'json', redirects: 'resolve'},
        dataType: 'jsonp',
        success : function(e) {
            var title = e[1][0],
                content = e[2][0],
                link = e[3][0];
            var wikiContent = formatWikiArticle(title, content, link);
            self.wiki(wikiContent);
            markerMouseOver(marker);
            clearTimeout(wikiRequestTimeout);
        }
    });
};

function formatWikiArticle(title, description, url) {
    var HTMLwikiArticle = '<h1 class="castle-title">%title%</h1><span class="castle-description">%description%</span><p><div><a href=%url% target="_blank">Link to Wikipedia article</a>';
    var wikiEntry = HTMLwikiArticle.replace('%title%', title);
    wikiEntry = wikiEntry.replace('%description%',description);
    wikiEntry = wikiEntry.replace('%url%',url);
    return wikiEntry;
}

function markerSelect(index, name, lat, lng) {
    var latLng = convertToLatLng(lat, lng);
    centerMap(latLng);
    arrMarkers[previousMarkerIndex].setIcon('images/castle-black15x15.png');
    arrMarkers[index].setIcon('images/castle-red15x15.png');
    loadFlickr(name, lat, lng);
    console.log("done");
    previousMarkerIndex = index;
}

function markerMouseOver(marker) {
    infobubble.open(map, marker);
    infobubble2.open();
    infobubble.setContent(self.wiki());
}

function markerMouseOut() {
    infobubble.close(map, marker);
}

function centerMap(pos) {
    map.panTo(pos);
}

function focusMarker(pos) {
    marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: 'images/castle-red15x15.png',
        zIndex: 999
    });
    marker.icon ='images/castle-black15x15.png';
}

var infobubble = new InfoBubble({
        maxWidth: 300,
        hideCloseButton: true,
        backgroundClassName: 'phoney'
});

var infobubble2 = new InfoBubble();

ko.applyBindings(viewModel);