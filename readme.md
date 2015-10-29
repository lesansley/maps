#Neighbourhood Map Project
I have developed a single-page application featuring a map of Northumberland county in the UK. Map markers identify castles and there is an autocomplete search function for easy lookup of the castles. Third-party APIs provide additional information (Wikipedia) and images (Flickr) about each of these locations. (Where available.)

Hovering over a marker will identiy the castle and provide a summary from Wikipedia along with a link to the full article. Clicking on a marker or selecting the castle from the seach box will centre the map on the slected castle, change the icon colour from black to red and display up to six Flickr images of the castle and surrounding areas above the map. If there are no imgaes then just teh Castle name will appear in the heading.

Knockout.js has been utilised to bind values to the DOM.

Open `/dist/index.html` to view the map.

##Installed Packages

* `bower install knockout`
* `bower install jquery`
* `git init`
* `sudo npm update -g npm` //ensure that npm is up-to-date
Install Grunt (http://mattbailey.io/a-beginners-guide-to-grunt-redux/)
* `npm install -g grunt-cli` //install grunt-cli globally
* `sudo gem install sass`
* cd to project root
* Create folder directory
    * grunt/
    * src/
    * src/images/
    * src/scripts/
    * src/styles/
* Create Grunfile.js for project and add dependency configuration
* Create package.json file to contain dependencies
* Add dependencies //install to project root folder
    * `npm install grunt --save-dev`
    * `npm install time-grunt --save`
    * `npm install load-grunt-config --save-dev` //It allows us to put the config for each of our tasks in separate files, which is far more manageable than having everything in one long Gruntfile.
    * `npm install grunt-concurrent --save-dev`
    * `npm install grunt-contrib-clean --save-dev`
    * `npm install grunt-contrib-imagemin --save-dev`
    * `npm install grunt-sass --save-dev`
    * `npm install grunt-contrib-uglify --save-dev`
    * `npm install grunt-contrib-jshint --save-dev`
    * `npm install jshint-stylish --save`
    * `npm install grunt-contrib-watch --save-dev`
* Create files:
    * `touch grunt/aliases.yaml` //defines various aliases for the tasks
    * `touch grunt/concurrent.js`
    * `touch grunt/clean.js` //removes all the contents of the dist/ directory
    * `touch grunt/imagemin.js` //optimises all images in src/images/ and saves them to dist/images/
    * `touch grunt/jshint.js` //validates the Javascript
    * `touch grunt/sass.js`
    * `touch grunt/uglify.js` //minifies Javascript files
    * `touch grunt/watch.js` //runs specified tasks whenever watched files are changed in any way


# Resources and Attributions
## KO with Google Maps
http://jsfiddle.net/stesta/p3ZT4/

## Responsive maps
http://codepen.io/anon/pen/EVwRpP

## Infobubble documentation
https://developer.here.com/javascript-apis/documentation/v3/maps/topics_api_nlp/h-ui-infobubble.html#h-ui-infobubble__setcontent

## Flickr photo wall
http://kylerush.net/blog/tutorial-flickr-api-javascript-jquery-ajax-json-build-detailed-photo-wall/
