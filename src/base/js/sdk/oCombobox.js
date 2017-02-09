/*
 * oCombobox
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:27
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oCombobox = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oCombobox"; // tag
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
    this.sValue = "";
    this.iReadonly = 0;

    this.evChange = null;

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

            this.refresh();
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
            var i = 0;

            sHtml += "<select id=\"" + this.getName() + "_Input\"";
            sHtml += " name=\"" + this.getName() + "_Input\"";
            sHtml += " style=\"width: 100%; height: 100%;\"";

            if (this.iReadonly > 0) {
                sHtml += " readonly";
            }

            sHtml += ">";

            loopData: for (i = 0; i < this.aData.length; i++) {
                    sHtml += "<option value=\"" + this.aData[i][0] + "\"" + ((this.aData[i][0] === this.sValue) ? " selected" : "") + ">" + this.aData[i][1] + "</option>";
                } //loopData

            sHtml += "</select>";

            this.eleHTML.innerHTML = sHtml;
            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.getFloat());

            // update the internal value
            document.getElementById(this.getName() + "_Input").addEventListener("change", function() {
                self.sValue = this.value;
            });

            if (!isNull(this.evChange)) {
                document.getElementById(this.getName() + "_Input").addEventListener("change", this.evChange);
            }
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * return the current combobox value
     */
    this.getComboboxValue = function() {
        try {
            var ele = document.getElementById(self.getName() + "_Input");
            if (!isNull(ele)) {
                return ele.value;
            }
        } catch (err) {
            self.onException(err);
        }
        return "";
    }; //getComboboxValue

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
     * getter for EvChange
     */
    this.getEvChange = function() {
        return this.evChange;
    }; // getEvChange

    /**
     * setter for EvChange
     */
    this.setEvChange = function(v) {
        this.evChange = v;
        this.refresh();
    }; // setEvChange

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
            var jsonData = JSON.parse(d);
            if (!jsonData.aRes) {
                return;
            }
            // console.log(jsonData);
            // map the received data and populate component
            // sValue = getValueByColName(jsonData.aRes[0], 0, "sValue");
            // sCaption = getValueByColName(jsonData.aRes[0], 0, "sCaption");

            // self.setValue(sValue);
            // self.setCaption(sCaption);
            self.setData(jsonData.aRes[0].aRows);
        } catch (err) {
            this.onException(err);
        }
    }; // populateData


    //create
    this.create(sParent, sName);

}; //oCombobox

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oCombobox = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oCombobox(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setHeight("40px");
    self.pnlContentDesigner[iDi].setData([
        ["a", "a caption"]
    ]);

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oCombobox
/**
 * END DESIGN TIME
 */
