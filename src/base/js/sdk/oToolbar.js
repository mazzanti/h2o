/*
 * oToolbar
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 15:34:09
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oToolbar = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oToolbar"; // tag
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

    this.aItems = [];
    this.sBasePath = "base/images/icon/";

    this.sBtnClear = "";
    this.sBtnFloat = "left";
    this.sBtnShowCaption = "0";
    this.sBtnMargin = "3px";


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
     * getter for btnFloat
     */
    this.getBtnFloat = function() {
        return this.sBtnFloat;
    }; // getBtnFloat

    /**
     * setter for btnFloat
     */
    this.setBtnFloat = function(v) {
        this.sBtnFloat = v;
    }; // setBtnFloat

    /**
     * getter for btnClear
     */
    this.getBtnClear = function() {
        return this.sBtnClear;
    }; // getBtnClear

    /**
     * setter for btnClear
     */
    this.setBtnClear = function(v) {
        this.sBtnClear = v;
    }; // setBtnClear

    /**
     * getter for btnShowCaption
     */
    this.getBtnShowCaption = function() {
        return this.sBtnShowCaption;
    }; // getBtnShowCaption

    /**
     * setter for btnShowCaption
     */
    this.setBtnShowCaption = function(v) {
        this.sBtnShowCaption = v;
    }; // setBtnShowCaption
    /**
     * getter for btnMargin
     */
    this.getBtnMargin = function() {
        return this.sBtnMargin;
    }; // getBtnMargin

    /**
     * setter for btnMargin
     */
    this.setBtnMargin = function(v) {
        this.sBtnMargin = v;
    }; // setBtnMargin

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
     * add Button
     */
    this.addButton = function(simage, fun, sText, cb) {
        sText = sText || "";
        cb = cb || null;

        var sname = this.aItems.length;
        var tmp = new nsNessuno.oImg(this.getName(), this.getChildName("btn" + sname));
        tmp.setClear(this.getBtnClear());
        if (this.getBtnShowCaption() === "1") {
            tmp.setText(sText);
        }
        tmp.setFloat(this.getBtnFloat());
        tmp.setHeight("16px");
        tmp.setWidth("16px");
        tmp.setHint(sText);
        tmp.setValue(this.sBasePath + simage);
        tmp.setEvClick(fun);
        tmp.eleHTML.style.margin = this.getBtnMargin();

        this.aItems.push(tmp);
    }; // addButton
    /**
     * add Separator
     */
    this.addSeparator = function(simage) {
        simage = simage || "i_separator.png";

        var sname = this.aItems.length;
        var tmp = new nsNessuno.oImg(this.getName(), this.getChildName("btn" + sname));
        tmp.setClear(this.getBtnClear());
        tmp.setFloat(this.getBtnFloat());
        tmp.setWidth("7px");
        tmp.setHeight("16px");
        tmp.setValue(this.sBasePath + simage);
        tmp.eleHTML.style.margin = this.getBtnMargin();

        this.aItems.push(tmp);
    }; // addSeparator


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


    //create
    this.create(sParent, sName);

}; //oToolbar


/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oToolbar = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oToolbar(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oToolbar
/**
 * END DESIGN TIME
 */
