/*
 * oProgressbar
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:23
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oProgressbar = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oProgressbar"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "20px";

    this.aData = [];
    this.aFields = [];

    this.iCountIncludes = 0;
    this.aIncludes = [];

    this.sPercent = "50%";
    this.sColor = "#5D82B2";
    this.sColorBackground = "#86ADDF";

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
        this.refresh();
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
            setCssProperty(node, "width", this.getWidth());
            setCssProperty(node, "height", this.getHeight());
            setCssProperty(node, "clear", "both");

            document.getElementById(this.sParent).appendChild(node);

            this.eleHTML = node;

            this.refresh();
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
     * refresh description
     */
    this.refresh = function() {
        try {
            var sHtml = "";

            // sHtml += "<div style=\"text-align: center; position: relative;\">" + this.sPercent + "</div>";
            sHtml += "<div style=\"width: " + this.sPercent + "; height:" + this.sHeight + "; background: " + this.sColor + ";\">";
            sHtml += "</div>";

            // sHtml += "<div style=\"text-align: center; position: absolute; width: " + this.sWidth + ";\">" + this.sPercent + "</div>";
            // sHtml += "<div style=\"width: " + this.sPercent + "; height:" + this.sHeight + "; background: " + this.sColor + ";\">";
            // sHtml += "</div>";

            this.eleHTML.innerHTML = sHtml;
            setCssProperty(this.eleHTML, "background", this.sColorBackground);
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * getter for Percent
     */
    this.getPercent = function() {
        return this.sPercent;
    }; // getPercent

    /**
     * setter for Percent
     */
    this.setPercent = function(v) {
        this.sPercent = v;
        this.refresh();
    }; // setPercent

    /**
     * getter for Color
     */
    this.getColor = function() {
        return this.sColor;
    }; // getColor

    /**
     * setter for Color
     */
    this.setColor = function(v) {
        this.sColor = v;
        this.refresh();
    }; // setColor

    /**
     * getter for ColorBackground
     */
    this.getColorBackground = function() {
        return this.sColorBackground;
    }; // getColorBackground

    /**
     * setter for ColorBackground
     */
    this.setColorBackground = function(v) {
        this.sColorBackground = v;
        this.refresh();
    }; // setColorBackground

    /**
     * setPercentCalc description
     */
    this.setPercentCalc = function(v, max) {
        try {
            var perc = (v * 100) / max;
            this.setPercent(perc + "%");
        } catch (err) {
            this.onException(err);
        }
    }; // setPercentCalc

    //create
    this.create(sParent, sName);

}; //oProgressbar
