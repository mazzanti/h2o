/*
 * oPlant
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:23
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oPlant = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oPlant"; // tag
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

    this.sFloat = "";
    this.sClear = "both";
    this.sFloat = "";
    this.sDisplay = "";

    this.sPlantImage = "";

    this.sSqlFill = "";


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
        this.refresh();
        // this.eleHTML.style.width = this.sWidth;
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
        this.refresh();
        // this.eleHTML.style.height = this.sHeight;
    }; //setHeight

    /**
     * get height
     */
    this.getHeight = function() {
        return this.sHeight;
    }; //getHeight

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
     * refresh
     */
    this.refresh = function() {
        var sTmp = "";
        this.eleHTML.innerHTML = "";

        // set properties...
        setCssProperty(this.eleHTML, "width", this.getWidth());
        setCssProperty(this.eleHTML, "height", this.getHeight());
        setCssProperty(this.eleHTML, "float", this.getFloat());
        setCssProperty(this.eleHTML, "clear", this.getClear());
        setCssProperty(this.eleHTML, "display", this.getDisplay());

        sTmp = this.getPlantImage();
        if (sTmp.indexOf("url") < 0) {
            sTmp = "url('" + sTmp + "')";
        }
        this.eleHTML.style.background = sTmp;
        this.eleHTML.style.backgroundRepeat = "no-repeat";
        this.eleHTML.style.backgroundPosition = "top right";

        this.eleHTML.style.cursor = "default";

        this.eleHTML.style.backgroundSize = sprintf("{0} {1}", this.getWidth(), this.getHeight());
        // this.draw();
    }; //refresh

    /**
     * getter for Data
     */
    this.getData = function() {
        return this.aData;
    }; // getData

    /**
     * setter for Data
     */
    this.setData = function(v) {
        this.aData = v;
        this.refresh();
    }; // setData

    /**
     * refreshItems redraw items over the plant image using X and Y
     */
    this.refreshItems = function() {
        try {
            if (!this.aData) {
                return;
            }

            var i = 0;
            this.eleItems = [];
            loopItems: for (i = 0; i < this.aData.aRows.length; i++) {
                    this.eleItems[i] = document.createElement('div');
                    this.eleItems[i].className = this.TAG + "_Item";
                    this.eleItems[i].id = this.sName + "_Item_" + i;
                    this.eleItems[i].style.width = "20px";
                    this.eleItems[i].style.height = "20px";

                    this.eleItems[i].style.opacity = "0.8";
                    this.eleItems[i].style.borderRadius = "5px";

                    this.eleItems[i].style.position = "relative";

                    this.eleItems[i].innerHTML = this.getValueByColName(this.aData, i, "sCaption");

                    this.eleItems[i].style.textAlign = "center";
                    this.eleItems[i].style.left = this.getValueByColName(this.aData, i, "sLeft");
                    this.eleItems[i].style.top = this.getValueByColName(this.aData, i, "sTop");

                    this.eleItems[i].style.width = this.getValueByColName(this.aData, i, "sWidth");
                    this.eleItems[i].style.height = this.getValueByColName(this.aData, i, "sHeight");

                    this.eleItems[i].style.color = this.getValueByColName(this.aData, i, "sColor");
                    this.eleItems[i].style.background = this.getValueByColName(this.aData, i, "sBackground");

                    this.eleHTML.appendChild(this.eleItems[i]);
                } //loopItems
                //
        } catch (err) {
            this.onException(err);
        }
    }; // refreshItems

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
     * getter for PlantImage
     */
    this.getPlantImage = function() {
        return this.sPlantImage;
    }; // getPlantImage

    /**
     * setter for PlantImage
     */
    this.setPlantImage = function(v) {
        this.sPlantImage = v;
        this.refresh();
    }; // setPlantImage

    /**
     * getter for SqlFill
     */
    this.getSqlFill = function() {
        return this.sSqlFill;
    }; // getSqlfill

    /**
     * setter for SqlFill
     */
    this.setSqlFill = function(v) {
        this.sSqlFill = v;
    }; // setSqlfill

    /**
     * getter for Display
     */
    this.getDisplay = function() {
        return this.sDisplay;
    }; // getDisplay

    /**
     * setter for Display
     */
    this.setDisplay = function(v) {
        this.sDisplay = v;
        this.refresh();
    }; // setDisplay

    /**
     * get value by colname
     */
    this.getValueByColName = function(obj, irow, sColName) {
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

    /**
     * populate data from a sqlfill
     */
    this.populateData = function(d) {

        try {
            var jsonData = JSON.parse(d);
            if (!jsonData.aRes) {
                return;
            }
            // console.log(jsonData);
            // map the received data and populate component

            self.setData(jsonData.aRes[0]);

            // refresh items
            self.refreshItems();
        } catch (err) {
            self.onException(err);
        }
    }; // populateData

    //create
    this.create(sParent, sName);

}; //oPlant

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oPlant = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oPlant(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setHeight("40px");


    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oPlant
/**
 * END DESIGN TIME
 */
