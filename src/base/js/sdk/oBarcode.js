/*
 * oBarcode
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:26
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oBarcodeFormat = {
    aTypes: [
        "CODE39",
        "CODE128",
        "CODE128C"
    ]
};

nsNessuno.oBarcode = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oBarcode"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";
    this.iSequence = 0;
    this.sSqlFill = "";

    this.aData = [];
    this.aFields = [];

    this._iCountIncludes = 0;
    this.aIncludes = [];

    this.sFloat = "";
    this.sValue = "0";
    this.iBarWidth = 1;
    this.iMarginBottom = 15;
    this.sFontSize = "100%";
    this.sBarcodeFormat = "CODE128";

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

        //
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
     * on exception
     */
    this.onException = function(e) {
        console.log(e.stack);
    }; // onException

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
     * getter for Value
     */
    this.getValue = function() {
        return this.sValue;
    }; // getValue

    /**
     * setter for Value
     */
    this.setValue = function(v) {
        v = v || "0";
        this.sValue = v;
        this.refresh();
    }; // setValue

    /**
     * draw description
     */
    this.draw = function(v) {
        v = v || null;
        try {

            var iW = document.getElementById(self.getName()).clientWidth;
            var iH = document.getElementById(self.getName()).clientHeight;

            iH = iH - this.iMarginBottom;

            var sIdImage = this.getName() + "_Image";
            this.eleHTML.innerHTML = "<img id=\"" + sIdImage + "\" />";

            new JsBarcode("#" + sIdImage, self.getValue(), {
                width: self.getBarWidth(),
                height: iH,
                quite: 10,
                format: self.getBarcodeFormat(),
                displayValue: true,
                fontOptions: "",
                font: "monospace",
                textAlign: "center",
                textPadding: 0,
                fontSize: 12,
                backgroundColor: "",
                lineColor: "#000000"
            });
            // new JsBarcode("#" + sIdImage, "12345", { width: 1, height: 25, format: "EAN", displayValue: true, fontSize: 24, lineColor: "#0cc" });

        } catch (err) {
            this.onException(err);
        }
    }; // draw

    /**
     * getter for BarWidth
     */
    this.getBarWidth = function() {
        return this.iBarWidth;
    }; // getBarWidth

    /**
     * setter for BarWidth
     */
    this.setBarWidth = function(v) {
        this.iBarWidth = v;
        this.refresh();
    }; // setBarWidth

    /**
     * getter for MarginBottom
     */
    this.getMarginBottom = function() {
        return this.iMarginBottom;
    }; // getMarginBottom

    /**
     * setter for MarginBottom
     */
    this.setMarginBottom = function(v) {
        this.iMarginBottom = v;
        this.refresh();
    }; // setMarginBottom

    /**
     * getter for Format
     */
    this.getBarcodeFormat = function() {
        return this.sBarcodeFormat;
    }; // getBarcodeFormat

    /**
     * setter for Format
     */
    this.setBarcodeFormat = function(v) {
        this.sBarcodeFormat = v;
        this.refresh();
    }; // setBarcodeFormat

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
            var sValue = "";
            var sCaption = "";
            var jsonData = JSON.parse(d);
            if (!jsonData.aRes) {
                return;
            }
            // console.log(jsonData);
            // map the received data and populate component
            sValue = getValueByColName(jsonData.aRes[0], 0, "sValue");
            // sCaption = getValueByColName(jsonData.aRes[0], 0, "sCaption");

            self.setValue(sValue);
            // self.setCaption(sCaption);
        } catch (err) {
            this.onException(err);
        }
    }; // populateData

    //create
    this.create(sParent, sName);

}; //oBarcode

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oBarcode = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oBarcode(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setHeight("100px");
    self.pnlContentDesigner[iDi].setValue("123");
    self.pnlContentDesigner[iDi].draw();

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oBarcode
/**
 * END DESIGN TIME
 */
