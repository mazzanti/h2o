/*
 * oAudio
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:26
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oAudio = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oAudio"; // tag
    this.manager = null;
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

    this.sList = "";
    this.sFloat = "";
    this.sClear = "";
    this.sIntervalStart = "";
    this.sIntervalStop = "";
    this.sMediaControls = "1";
    this.sMediaAutoplay = "0";
    this.sMediaLoop = "0";

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
        this.eleHTML.style.width = this.sWidth;
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
        this.eleHTML.style.height = this.sHeight;
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
            if (!isNull(ele)) {
                ele.removeChild(this.eleHTML);
            }

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
            node.style.width = this.sWidth;
            node.style.height = this.sHeight;

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
     * getter for Manager
     */
    this.getManager = function() {
        return this.manager;
    }; // getManager

    /**
     * setter for Manager
     */
    this.setManager = function(v) {
        this.manager = v;
    }; // setManager

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
     * getter for Float
     */
    this.getFloat = function() {
        return this.sFloat;
    }; // getFloat

    /**
     * setter for Float
     */
    this.setFloat = function(v) {
        this.sFloat = v;
        this.refresh();
    }; // setFloat

    /**
     * getter for Clear
     */
    this.getClear = function() {
        return this.sClear;
    }; // getClear

    /**
     * setter for Clear
     */
    this.setClear = function(v) {
        this.sClear = v;
        this.refresh();
    }; // setClear

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
     * refresh description
     */
    this.refresh = function() {
        try {
            this.eleHTML.style.width = this.getWidth();
            this.eleHTML.style.height = this.getHeight();
            this.eleHTML.style.float = this.getFloat();
            this.eleHTML.style.clear = this.getClear();
            this.draw();
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * draw description
     */
    this.draw = function() {
        var sHtml = "";
        var j = 0;
        var sUrl = "";

        this.aExtensions = {};
        this.aExtensions.ogg = "audio/ogg";
        this.aExtensions.wav = "audio/wav";
        this.aExtensions.mp3 = "audio/mpeg";

        //
        this.aData = this.sList.split(";");

        sHtml += "<audio style=\"width:100%; height:100%;\"";

        if (this.getMediaControls() === "1") {
            sHtml += " controls";
        }
        if (this.getMediaAutoplay() === "1") {
            sHtml += " autoplay";
        }
        if (this.getMediaLoop() === "1") {
            sHtml += " loop";
        }

        sHtml += ">";
        if (this.aData.length) {
            loopData: for (j = 0; j < this.aData.length; j++) {
                    sUrl = this.aData[j];
                    if (!isEmpty(this.getIntervalStart()) || !isEmpty(this.getIntervalStop())) {
                        sUrl += "#t=";
                        sUrl += this.getIntervalStart();
                        if (!isEmpty(this.getIntervalStop())) {
                            sUrl += "," + this.getIntervalStop();
                        }
                    }

                    sHtml += "<source src=\"" + sUrl + "\" >";
                } //loopData
        }
        sHtml += "Your browser does not support the audio element.";
        sHtml += "</audio>";

        this.eleHTML.innerHTML = sHtml;
    }; //draw

    /**
     * getter for IntervalStart
     */
    this.getIntervalStart = function() {
        return this.sIntervalStart;
    }; // getIntervalStart

    /**
     * setter for IntervalStart
     */
    this.setIntervalStart = function(v) {
        this.sIntervalStart = v;
    }; // setIntervalStart
    /**
     * getter for IntervalStop
     */
    this.getIntervalStop = function() {
        return this.sIntervalStop;
    }; // getIntervalStop

    /**
     * setter for IntervalStop
     */
    this.setIntervalStop = function(v) {
        this.sIntervalStop = v;
    }; // setIntervalStop

    /**
     * getter for MediaControls
     */
    this.getMediaControls = function() {
        return this.sMediaControls;
    }; // getMediaControls

    /**
     * setter for MediaControls
     */
    this.setMediaControls = function(v) {
        this.sMediaControls = v;
    }; // setMediaControls
    /**
     * getter for MediaAutoplay
     */
    this.getMediaAutoplay = function() {
        return this.sMediaAutoplay;
    }; // getMediaAutoplay

    /**
     * setter for MediaAutoplay
     */
    this.setMediaAutoplay = function(v) {
        this.sMediaAutoplay = v;
    }; // setMediaAutoplay

    /**
     * getter for MediaLoop
     */
    this.getMediaLoop = function() {
        return this.sMediaLoop;
    }; // getMediaLoop

    /**
     * setter for MediaLoop
     */
    this.setMediaLoop = function(v) {
        this.sMediaLoop = v;
    }; // setMediaLoop

    //create
    this.create(sParent, sName);

}; //oAudio

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oAudio = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();

    self.pnlContentDesigner[iDi] = new nsNessuno.oAudio(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setClear("both");
    self.pnlContentDesigner[iDi].setWidth("100%");
    self.pnlContentDesigner[iDi].setHeight("30px");


    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oAudio
/**
 * END DESIGN TIME
 */
