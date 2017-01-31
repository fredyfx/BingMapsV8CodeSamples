/// <reference path="../../Resources/typings/MicrosoftMaps/Microsoft.Maps.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * A simple class that defines a HTML pushpin.
 */
var HtmlPushpin = (function () {
    /**********************
    * Constructor
    ***********************/
    /**
     * @constructor
     * @param loc The location of the pushpin.
     * @param html The HTML to display as the pushpin.
     * @param anchor An anchor to offset the position of the html so that it aligns with the location.
     */
    function HtmlPushpin(loc, html, anchor) {
        this.location = loc;
        this.anchor = anchor;
        //A property for storing data relative to the pushpin.
        this.metadata = null;
        //Create the pushpins DOM element.
        this._element = document.createElement('div');
        this._element.innerHTML = html;
        this._element.style.position = 'absolute';
    }
    return HtmlPushpin;
}());
/**
 * A reusable class for overlaying HTML elements as pushpins on the map.
 */
var HtmlPushpinLayer = (function (_super) {
    __extends(HtmlPushpinLayer, _super);
    /**********************
    * Constructor
    ***********************/
    /**
    * @constructor
    */
    function HtmlPushpinLayer() {
        _super.call(this, { beneathLabels: false });
        /**********************
        * Private Properties
        ***********************/
        /** Store the pushpins. */
        this._pushpins = null;
        /** A variable to store the viewchange event handler id. */
        this.viewChangeEventHandler = null;
        /** A variable to store a reference to the container for the HTML pushpins. */
        this.container = null;
    }
    /**********************
    * Overridden functions
    ***********************/
    /**
    * Layer added to map. Setup rendering container.
    */
    HtmlPushpinLayer.prototype.onAdd = function () {
        //Create a div that will hold the pushpins.
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.left = '0px';
        this.container.style.top = '0px';
        this.setHtmlElement(this.container);
    };
    /**
     * Layer loaded, add map events for updating position of data.
     */
    HtmlPushpinLayer.prototype.onLoad = function () {
        var self = this;
        //Reset pushpins as overlay is now loaded.
        self.setPushpins(self._pushpins);
        //Update the position of the pushpin when the view changes.
        this.viewChangeEventHandler = Microsoft.Maps.Events.addHandler(self.getMap(), 'viewchange', function () {
            self._updatePositions();
        });
    };
    /**
     * Layer removed from map. Release resources.
     */
    HtmlPushpinLayer.prototype.onRemove = function () {
        this.setHtmlElement(null);
        //Remove the event handler that is attached to the map.
        Microsoft.Maps.Events.removeHandler(this.viewChangeEventHandler);
    };
    /**********************
    * Public Functions
    ***********************/
    //Method to define the pushpins to display in the layer.
    /**
    * Sets the pushpins to be overlaid on top of the map.
    * @param pushpins The HTML pushpins to overlay on the map.
    */
    HtmlPushpinLayer.prototype.setPushpins = function (pushpins) {
        //Store the pushpin data.
        this._pushpins = pushpins;
        //Clear the container.
        if (this.container) {
            this.container.innerHTML = '';
            if (pushpins) {
                //Add the pushpins to the container.
                for (var i = 0, len = pushpins.length; i < len; i++) {
                    this.container.appendChild(pushpins[i]._element);
                }
            }
        }
        this._updatePositions();
    };
    /**********************
    * Private Functions
    ***********************/
    /**
    * Updates the position of a HTML pushpin element on the map.
    */
    HtmlPushpinLayer.prototype._updatePushpinPosition = function (pin) {
        var map = this.getMap();
        if (map) {
            //Calculate the pixel location of the pushpin.
            var topLeft = map.tryLocationToPixel(pin.location, Microsoft.Maps.PixelReference.control);
            //Offset position to account for anchor.
            topLeft.x -= pin.anchor.x;
            topLeft.y -= pin.anchor.y;
            //Update the position of the pushpin element.
            pin._element.style.left = topLeft.x + 'px';
            pin._element.style.top = topLeft.y + 'px';
        }
    };
    /**
     * Updates the positions of all HTML pushpins in the layer.
     */
    HtmlPushpinLayer.prototype._updatePositions = function () {
        if (this._pushpins) {
            for (var i = 0, len = this._pushpins.length; i < len; i++) {
                this._updatePushpinPosition(this._pushpins[i]);
            }
        }
    };
    return HtmlPushpinLayer;
}(Microsoft.Maps.CustomOverlay));
//Call the module loaded function.
Microsoft.Maps.moduleLoaded('HtmlPushpinLayerModule');
