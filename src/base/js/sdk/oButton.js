/*
 * oButton
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:26
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oButton = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oButton"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "";
    this.iSequence = 0;

    this.aData = [];
    this.aFields = [];

    this._iCountIncludes = 0;
    this.aIncludes = [];

    this.sCaption = "";
    this.sBorder = "";
    this.sBackground = "";
    this.sColor = "";
    this.sFloat = "";
    this.sClear = "";
    this.sTextAlign = "";
    this.sIcon = "";

    this.evClick = null;

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
                        if (!isNull(this[property])) {
                            if (!isNull(this[property]) && !isUndefined(this[property].destroy)) {
                                this[property].destroy();
                                this[property] = null;
                                this[property] = undefined;
                                delete this[property];
                            }
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
     * refresh description
     */
    this.refresh = function() {
        try {
            var sHtml = "";
            var sStyle = "";

            if (!isEmpty(this.sTextAlign)) {
                sStyle += " text-align: " + this.sTextAlign + ";";
            }
            if (!isEmpty(this.sBackground)) {
                sStyle += " background: " + this.sBackground + ";";
            }
            if (!isEmpty(this.sIcon)) {
                sStyle += " background-image: url('" + this.sIcon + "');";
                sStyle += " background-repeat: no-repeat;";
                // sStyle += " background-attachment: fixed;";
                sStyle += " background-position: left;";
                sStyle += " padding-left: 16px;";
            }
            if (!isEmpty(this.sColor)) {
                sStyle += " color: " + this.sColor + ";";
            }
            if (!isEmpty(this.sBorder)) {
                sStyle += " border: " + this.sBorder;
            }

            sHtml += "<button id=\"" + this.getName() + "_Button\"";
            sHtml += " style=\"width: 100%; height: 100%;" + sStyle + "\">";
            sHtml += this.getCaption();
            sHtml += "</button>";

            this.eleHTML.innerHTML = sHtml;
            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.sFloat);
            setCssProperty(this.eleHTML, "clear", this.sClear);
            setCssProperty(this.eleHTML, "overflow", "hidden");

            if (!isNull(this.evClick)) {
                document.getElementById(this.getName() + "_Button").addEventListener("click", this.evClick);
            }
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

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
     * getter for EvClick
     */
    this.getEvClick = function() {
        return this.evClick;
    }; // getEvClick

    /**
     * setter for EvClick
     */
    this.setEvClick = function(v) {
        this.evClick = v;
        this.refresh();
    }; // setEvClick

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

    //create
    this.create(sParent, sName);

    /**
     * getter for Background
     */
    this.getBackground = function() {
        return this.sBackground;
    }; // getBackground

    /**
     * setter for Background
     */
    this.setBackground = function(v) {
        this.sBackground = v;
        this.refresh();
    }; // setBackground

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
     * getter for Border
     */
    this.getBorder = function() {
        return this.sBorder;
    }; // getBorder

    /**
     * setter for Border
     */
    this.setBorder = function(v) {
        this.sBorder = v;
        this.refresh();
    }; // setBorder

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
     * getter for TextAlign
     */
    this.getTextAlign = function() {
        return this.sTextAlign;
    }; // getTextAlign

    /**
     * setter for TextAlign
     */
    this.setTextAlign = function(v) {
        this.sTextAlign = v;
        this.refresh();
    }; // setTextAlign

    /**
     * getter for Icon
     */
    this.getIcon = function() {
        return this.sIcon;
    }; // getIcon

    /**
     * setter for Icon
     */
    this.setIcon = function(v) {
        this.sIcon = v;
    }; // setIcon

}; //oButton


/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oButton = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oButton(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setCaption(iDi);

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oButton
/**
 * END DESIGN TIME
 */
