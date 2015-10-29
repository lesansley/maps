#Neighbourhood Map Project
This is a single-page application featuring a map of Northumberland county in the UK. Map markers identify castles and there is an autocomplete search function for easy lookup of the castles. Third-party APIs provide additional information (Wikipedia) and images (Flickr) about each of these locations. (Where available.)

Hovering over a marker will identiy the castle and provide a summary from Wikipedia along with a link to the full article. Clicking on a marker or selecting the castle from the seach box will centre the map on the slected castle, change the icon colour from black to red and display up to six Flickr images of the castle and surrounding areas above the map. If there are no imgaes then just teh Castle name will appear in the heading.

Knockout.js has been utilised to bind values to the DOM.

Open `/dist/index.html` to view the map.

# Resources and Attributions
## KO with Google Maps
http://jsfiddle.net/stesta/p3ZT4/

## Responsive maps
http://codepen.io/anon/pen/EVwRpP

## Infobubble documentation
https://developer.here.com/javascript-apis/documentation/v3/maps/topics_api_nlp/h-ui-infobubble.html#h-ui-infobubble__setcontent

## Flickr photo wall
http://kylerush.net/blog/tutorial-flickr-api-javascript-jquery-ajax-json-build-detailed-photo-wall/

## Autocomplete search bar
http://cameron-verhelst.be/blog/2014/04/20/knockoutjs-autocomplete/
