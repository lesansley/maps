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
    console.log(self.castles);
    self.selectedCastle = ko.observable();
    self.index = ko.observable();
    self.wiki = ko.observable();
    self.selectedOption = ko.observable();
    self.options = self.castles.map(function(element) {
        // JQuery.UI.AutoComplete expects label & value properties, but we can add our own
        return {
            label: element.name,
            value: element.name,
            // This way we still have acess to the original object
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
            center: new google.maps.LatLng(castleObject.centerLat, castleObject.centerLng),
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
            var latLng = new google.maps.LatLng(
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
                    var pos = marker.getPosition();
                    var index = marker.id;
                    // Close all info bubble windows
                    infobubble.close(map, marker);
                    index++;
                    $('.castleSelect').prop('selectedIndex', index);
                    $('.castleSelect').trigger('change');
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
        // valueAccessor = { selected: mySelectedOptionObservable, options: myArrayOfLabelValuePairs }
        var settings = valueAccessor();

        var selectedOption = settings.selected;
        var options = settings.options;

        var updateElementValueWithLabel = function (event, ui) {
            // Stop the default behavior
            event.preventDefault();

            // Update the value of the html element with the label 
            // of the activated option in the list (ui.item)
            $(element).val(ui.item.label);

            // Update our SelectedOption observable
            if(typeof ui.item !== "undefined") {
                // ui.item - id|label|...
                selectedOption(ui.item);
            }
        };

        $(element).autocomplete({
            source: options,
            delay: 0,
            select: function (event, ui) {
                updateElementValueWithLabel(event, ui);
                console.log(self.selectedOption().object);
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

function markerClick(index, latLng) {
    arrMarkers[previousMarkerIndex].setIcon('images/castle-black15x15.png')
    console.log("A sidebar will slide open with information and images of the castle");
    centerMap(latLng);
    arrMarkers[index].setIcon('images/castle-red15x15.png');
    previousMarkerIndex = index;
    //focusMarker(latLng);
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

// Obtain the index of the selected item. Offset by one.
ko.bindingHandlers.selectedIndex = {
    init: function(element, valueAccessor, allBindings) {
        ko.utils.registerEventHandler(element, "change", function() {
            var value = valueAccessor();
            if (ko.isWriteableObservable(value) && element.selectedIndex != 0)   {
                var index = element.selectedIndex - 1,
                    selectedCastle = allBindings().options[index],
                    selectedCastleName = allBindings().options[index].name,
                    selectedLat = selectedCastle.lat,
                    selectedLng = selectedCastle.lng,
                    latLng = new google.maps.LatLng(selectedLat, selectedLng);
                centerMap(latLng);
                markerClick(index, latLng);
            }
        });
    }
};

var infobubble = new InfoBubble({
        maxWidth: 300,
        hideCloseButton: true,
        backgroundClassName: 'phoney'
});

var infobubble2 = new InfoBubble();

ko.applyBindings(viewModel);