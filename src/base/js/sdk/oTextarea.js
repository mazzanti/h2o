/*
 * oTextarea
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:23
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oTextarea = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oTextarea"; // tag
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

    this.sSizeCaption = "20%";
    this.sSizeInput = "80%";

    this.sCaption = "";
    this.sValue = "";
    this.sPlaceholder = "";
    this.iReadonly = 0;

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
    }; //setHeight

    /**
     * get height
     */
    this.getHeight = function() {
        return this.sHeight;
    }; //getHeight

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
     * refresh description
     */
    this.refresh = function() {
        try {
            var sHtml = "";
            var sStyle = "width: 100%; height: 100%; box-sizing: border-box;";

            sHtml += "<div style=\"float: left; cursor: pointer; width: " + this.sSizeCaption + ";\"><span id=\"" + this.getName() + "_Caption\">" + this.getCaption() + "</span></div>";
            sHtml += "<div style=\"float: left; width: " + this.sSizeInput + "; height: 100%;\">";

            sHtml += "<textarea";
            sHtml += " id=\"" + this.getName() + "_Input\"";
            sHtml += " name=\"" + this.getName() + "_Input\"";
            sHtml += " style=\"" + sStyle + "\"";

            if (this.iReadonly > 0) {
                sHtml += " readonly";
            }

            sHtml += ">";

            sHtml += this.sValue;

            sHtml += "</textarea>";

            sHtml += "</div>";

            this.eleHTML.innerHTML = sHtml;
            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * getter for Readonly
     */
    this.getReadonly = function() {
        return this.iReadonly;
    }; // getReadonly

    /**
     * setter for Readonly
     */
    this.setReadonly = function(v) {
        this.iReadonly = v;
        this.refresh();
    }; // setReadonly

    /**
     * getter for Caption
     */
    this.getCaption = function() {
        return this.sCaption;
    }; // getCaption

    /**
     * setter for Caption
     */
    this.setCaption = function(v) {
        this.sCaption = v;
        this.refresh();
    }; // setCaption

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
        this.sValue = v;
        this.refresh();
    }; // setValue

    /**
     * getter for Placeholder
     */
    this.getPlaceholder = function() {
        return this.sPlaceholder;
    }; // getPlaceholder

    /**
     * setter for Placeholder
     */
    this.setPlaceholder = function(v) {
        this.sPlaceholder = v;
        this.refresh();
    }; // setPlaceholder

    /**
     * getter for Readonly
     */
    this.getReadonly = function() {
        return this.iReadonly;
    }; // getReadonly

    /**
     * setter for Readonly
     */
    this.setReadonly = function(v) {
        this.iReadonly = v;
        this.refresh();
    }; // setReadonly


    /**
     * getter for SizeCaption
     */
    this.getSizeCaption = function() {
        return this.sSizeCaption;
    }; // getSizeCaption

    /**
     * setter for SizeCaption
     */
    this.setSizeCaption = function(v) {
        this.sSizeCaption = v;
        this.refresh();
    }; // setSizeCaption

    /**
     * getter for SizeInput
     */
    this.getSizeInput = function() {
        return this.sSizeInput;
    }; // getSizeInput

    /**
     * setter for SizeInput
     */
    this.setSizeInput = function(v) {
        this.sSizeInput = v;
        this.refresh();
    }; // setSizeInput

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
            // var sCaption = "";
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

}; //oTextarea

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oTextarea = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oTextarea(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setHeight("40px");
    self.pnlContentDesigner[iDi].setCaption(iDi);

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oTextarea
/**
 * END DESIGN TIME
 */
