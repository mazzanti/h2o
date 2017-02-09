/*
 * oGoogleMaps
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:28
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oGoogleMaps = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oGoogleMaps"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";
    this.iSequence = 0;

    this.aData = [];
    this.aFields = [];

    this._iCountIncludes = 0;
    this.aIncludes = [];

    this.oMap = {};
    this.iLat = 0;
    this.iLng = 0;
    this.iZoom = 12;

    this.sFloat = "";

    this.aMarker = [];

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

        this.createHtmlElement();
    }; // create

    /**
     * getChildName
     */
    this.getChildName = function(v) {
        try {
            return this.getName() + "_" + v;
        } catch (err) {
            this.onException(err);
        }
    }; // getChildName

    /**
     * getter for Name
     */
    this.getName = function() {
        return this.sName;
    }; // getName

    /**
     * setter for Name
     */
    this.setName = function(v) {
        this.sName = v;
    }; // setName

    /**
     * getter for Parent
     */
    this.getParent = function() {
        return this.sParent;
    }; // getParent

    /**
     * setter for Parent
     */
    this.setParent = function(v) {
        this.sParent = v;
    }; // setParent

    /**
     * set width
     */
    this.setWidth = function(v) {
        this.sWidth = v;
        setCssProperty(this.eleHTML, "width", this.getWidth());
    }; //setWidth

    /**
     * get width
     */
    this.getWidth = function() {
        return this.sWidth;
    }; //getWidth

    /**
     * set height
     */
    this.setHeight = function(v) {
        this.sHeight = v;
        setCssProperty(this.eleHTML, "height", this.getHeight());
    }; //setHeight

    /**
     * get height
     */
    this.getHeight = function() {
        return this.sHeight;
    }; //getHeight

    /**
     * on exception
     */
    this.onException = function(e) {
        console.log(e.stack);
    }; // onException

    /**
     * destroy
     */
    this.destroy = function() {
        try {
            // dom element
            var ele = null;
            ele = document.getElementById(this.sParent);
            if (!isNull(ele)) { ele.removeChild(this.eleHTML); }

            for (var property in this) {
                if (this.hasOwnProperty(property)) {
                    if (property.startsWith("tmr")) {
                        // by convention tmr is timer or
                        clearInterval(this[property]);
                        clearTimeout(this[property]);
                    }
                    if ((property !== "_owner") && (property !== "manager")) {
                        if (!isNull(this[property]) && !isUndefined(this[property].destroy)) {
                            this[property].destroy();
                            this[property] = null;
                            this[property] = undefined;
                            delete this[property];
                        }
                    }
                }
            }
        } catch (err) {
            this.onException(err);
        }
    }; // destroy

    /**
     * create html element
     */
    this.createHtmlElement = function() {
        try {
            var node = document.createElement('div');
            node.className = this.TAG;
            node.id = this.sName;
            // set properties...
            setCssProperty(node, "width", this.getWidth());
            setCssProperty(node, "height", this.getHeight());

            document.getElementById(this.sParent).appendChild(node);

            this.eleHTML = node;
        } catch (err) {
            this.onException(err);
        }
    }; //createHtmlElement

    /**
     * getter for Owner
     */
    this.getOwner = function() {
        return this._owner;
    }; // getOwner

    /**
     * setter for Owner
     */
    this.setOwner = function(v) {
        this._owner = v;
    }; // setOwner

    /**
     * setLatLng description
     */
    this.setLatLng = function(lat, lng) {
        try {
            this.iLat = lat;
            this.iLng = lng;
        } catch (err) {
            this.onException(err);
        }
    }; // setLatLng

    /**
     * setZoom description
     */
    this.setZoom = function(v) {
        try {
            this.iZoom = v;
        } catch (err) {
            this.onException(err);
        }
    }; // setZoom

    /**
     * draw
     */
    this.draw = function(v) {
        v = v || null;

        var doIt = function() {
            self.oMap.latlng = new google.maps.LatLng(self.iLat, self.iLng);

            self.oMap.options = {
                zoom: self.iZoom,
                center: self.oMap.latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            self.oMap.map = new google.maps.Map(document.getElementById(self.getName()), self.oMap.options);

            //
            self.getCoordinatesFromAddress("Ferrara, Via Dell'Indipendenza, 5");

            //
            if (!isNull(v)) {
                v();
            }
        };

        if (!includeJs(this.TAG, "http://maps.google.com/maps/api/js?sensor=false", function() {
                doIt();
            })) {
            doIt();
        }
    }; // draw

    /**
     * addMarker description
     */
    this.addMarker = function() {
        try {
            var marker = new google.maps.Marker({
                position: self.oMap.latlng,
                map: self.oMap.map,
                title: 'Questo è un testo di suggerimento'
            });
        } catch (err) {
            this.onException(err);
        }
    }; // addMarker

    /**
     * refresh
     */
    this.refresh = function() {
        this.eleHTML.innerHTML = "";

        // set properties...
        setCssProperty(this.eleHTML, "width", this.getWidth());
        setCssProperty(this.eleHTML, "height", this.getHeight());
        setCssProperty(this.eleHTML, "float", this.getFloat());

        this.draw();
    }; //refresh


    /**
     * getter for Sequence
     */
    this.getSequence = function() {
        return this.iSequence;
    }; // getSequence

    /**
     * setter for Sequence
     */
    this.setSequence = function(v) {
        this.iSequence = v;
    }; // setSequence

    /**
     * get object properties
     */
    this.getProperties = function() {
        var tmp = {};
        var aBlackList = ["TAG", "sName", "sParent", "_owner", "manager"];

        tmp.sName = self.getName();
        tmp.sName = tmp.sName.replace(self.getParent() + "_", "");

        for (var property in self) {
            if (self.hasOwnProperty(property)) {
                if (aBlackList.indexOf(property) > -1) {
                    continue;
                }
                if (property.startsWith("_") ||
                    property.startsWith("tmr")) {
                    continue;
                }

                if ((typeof self[property] === "string") ||
                    (typeof self[property] === "number")) {
                    tmp[property] = self[property];
                }
            }
        }
        return (tmp);
    }; //getProperties

    /**
     * set object properties
     */
    this.setProperties = function(v) {
        var tmp = v || {};
        var aBlackList = ["TAG", "sName", "sParent", "_owner", "manager"];
        for (var property in tmp) {
            if (tmp.hasOwnProperty(property)) {
                if (aBlackList.indexOf(property) > -1) {
                    continue;
                }

                self[property] = tmp[property];
            }
        }
        self.refresh();
    }; //setProperties

    /**
     * set Float
     */
    this.setFloat = function(v) {
        this.sFloat = v;
        this.eleHTML.style.float = this.sFloat;
    }; //setFloat

    /**
     * get Float
     */
    this.getFloat = function() {
        return this.sFloat;
    }; //getFloat

    /**
     * getCoordinatesFromAddress description
     */
    this.getCoordinatesFromAddress = function(v) {

        try {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                "address": v
            }, function(results, status) {

                console.log(status,
                    results[0].geometry.location,
                    results[0].geometry.location.lat(),
                    results[0].geometry.location.lng()); //LatLng

                self.oMap.map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: self.oMap.map,
                    position: results[0].geometry.location
                });
            });
        } catch (err) {
            this.onException(err);
        }
    }; // getCoordinatesFromAddress

    //create
    this.create(sParent, sName);

}; //oGoogleMaps

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oGoogleMaps = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    // google maps
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oGoogleMaps(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setHeight("200px");
    self.pnlContentDesigner[iDi].setLatLng(42.745334, 12.738430);
    self.pnlContentDesigner[iDi].setZoom(12);
    self.pnlContentDesigner[iDi].draw(function() {
        self.pnlContentDesigner[iDi].addMarker();
    });

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oGoogleMaps
/**
 * END DESIGN TIME
 */
