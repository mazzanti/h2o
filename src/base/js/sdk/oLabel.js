/*
 * oLabel
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:22
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oLabel = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oLabel"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "";
    this.iSequence = 0;
    this.sSqlFill = "";

    this.aData = [];
    this.aFields = [];

    this._iCountIncludes = 0;
    this.aIncludes = [];

    this.sCaption = "";
    this.sFloat = "";
    this.sVerticalAlign = "";

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

        this.createHtmlElement();
    }; // create

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
     * getter for SqlFill
     */
    this.getSqlFill = function() {
        return this.sSqlFill;
    }; // getSqlFill

    /**
     * setter for SqlFill
     */
    this.setSqlFill = function(v) {
        this.sSqlFill = v;
    }; // setSqlFill


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
     * refresh description
     */
    this.refresh = function() {
        try {
            var sHtml = "";

            sHtml = this.sCaption;

            if (this.sVerticalAlign !== "") {
                sHtml = "<div style=\"display: table; width: 100%; height: 100%;\"><div style=\"display: table-cell; vertical-align: " + this.sVerticalAlign + "; width: 100%; height: 100%;\">" + this.sCaption + "</div></div>";
            }

            this.eleHTML.innerHTML = sHtml;

            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.getFloat());
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * setCaption description
     */
    this.setCaption = function(v) {
        try {
            this.sCaption = v;
            this.refresh();
        } catch (err) {
            this.onException(err);
        }
    }; // setCaption

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
        setCssProperty(this.eleHTML, "float", this.getFloat());
    }; // setFloat


    /**
     * getter for VerticalAlign
     */
    this.getVerticalAlign = function() {
        return this.sVerticalAlign;
    }; // getVerticalAlign

    /**
     * setter for VerticalAlign
     */
    this.setVerticalAlign = function(v) {
        this.sVerticalAlign = v;
        this.refresh();
    }; // setVerticalAlign

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
     * populate data from a sqlfill
     */
    this.populateData = function(d) {
        var getValueByColName = function(obj, irow, sColName) {
            var i = 0;
            var iFound = -1;
            for (i = 0; i < obj.aColNames.length; i++) {
                if (obj.aColNames[i] === sColName) {
                    iFound = i;
                    break;
                }
            }

            if (iFound > -1) {
                return obj.aRows[irow][iFound];
            }

            return "";
        }; //getValueByColName

        try {
            // var sValue = "";
            var sCaption = "";
            var jsonData = JSON.parse(d);
            if (!jsonData.aRes) {
                return;
            }
            // console.log(jsonData);
            // map the received data and populate component
            // sValue = getValueByColName(jsonData.aRes[0], 0, "sValue");
            sCaption = getValueByColName(jsonData.aRes[0], 0, "sCaption");

            // self.setValue(sValue);
            self.setCaption(sCaption);
        } catch (err) {
            this.onException(err);
        }
    }; // populateData

    //create
    this.create(sParent, sName);

}; //oLabel

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oLabel = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oLabel(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setHeight("40px");
    self.pnlContentDesigner[iDi].setCaption(iDi);

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oLabel
/**
 * END DESIGN TIME
 */
