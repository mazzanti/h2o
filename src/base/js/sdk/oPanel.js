/*
 * oPanel
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:22
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oPanel = function(sParent, sName) {
    "use strict";

    var self = this;

    this.TAG = "oPanel"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;

    this.sWidth = "100%";
    this.sHeight = "100%";
    this.iSequence = 0;

    this.sMaxWidth = "";
    this.sMaxHeight = "";

    this.aData = [];
    this.aFields = [];

    this.iCountIncludes = 0;
    this.aIncludes = [];

    this.sFloat = "";
    this.sBorder = "";
    this.sClear = "";
    this.sOverflow = "";
    this.sBackground = "";

    this.sShowAnimation = "fadeIn 0.5s"; //"fadeIn 1s"

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        // shortcut passing object and variable name ex:
        // this.pnlFiles1 = new nsNessuno.oPanel(this.pnlContent, "pnlFiles1");
        if (typeof sParent === "object") {
            this._owner = sParent;
            sParent = this._owner.getName();
            sName = this._owner.getChildName(sName);
        }
        // end shortcut

        //
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
     * set MaxWidth
     */
    this.setMaxWidth = function(v) {
        this.sMaxWidth = v;
        setCssProperty(this.eleHTML, "maxWidth", this.getMaxWidth());
    }; //setMaxWidth

    /**
     * get MaxWidth
     */
    this.getMaxWidth = function() {
        return this.sMaxWidth;
    }; //getMaxWidth

    /**
     * set MaxHeight
     */
    this.setMaxHeight = function(v) {
        this.sMaxHeight = v;
        setCssProperty(this.eleHTML, "maxHeight", this.getMaxHeight());
    }; //setMaxHeight

    /**
     * get MaxHeight
     */
    this.getMaxHeight = function() {
        return this.sMaxHeight;
    }; //getMaxHeight

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
            setCssProperty(node, "overflow", "hidden");
            setCssProperty(node, "boxSizing", "border-box");

            document.getElementById(this.sParent).appendChild(node);

            this.eleHTML = node;
        } catch (err) {
            this.onException(err);
        }
    }; //createHtmlElement

    /**
     * setFloat description
     */
    this.setFloat = function(v) {
        try {
            this.sFloat = v;
            this.eleHTML.style.float = v;
        } catch (err) {
            this.onException(err);
        }
    }; // setFloat

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
        setCssProperty(this.eleHTML, "border", this.getBorder());
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
        setCssProperty(this.eleHTML, "clear", this.getClear());
    }; // setClear

    /**
     * getter for Overflow
     */
    this.getOverflow = function() {
        return this.sOverflow;
    }; // getOverflow

    /**
     * setter for Overflow
     */
    this.setOverflow = function(v) {
        this.sOverflow = v;
        setCssProperty(this.eleHTML, "overflow", this.getOverflow());
    }; // setOverflow

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
        setCssProperty(this.eleHTML, "background", this.getBackground());
    }; // setBackground

    /**
     * get client width in px
     */
    this.getWidthPx = function() {
        return document.getElementById(this.getName()).clientWidth;
    }; //getWidthPx

    /**
     * get client height in px
     */
    this.getHeightPx = function() {
        return document.getElementById(this.getName()).clientHeight;
    }; //getHeightPx

    /**
     * hide
     */
    this.hide = function() {
        setCssProperty(this.eleHTML, "display", "none");
    }; //hide

    /**
     * show
     */
    this.show = function() {
        setCssProperty(this.eleHTML, "display", "");
        setCssProperty(this.eleHTML, "animation", this.getShowAnimation());
        // this.eleHTML.style.display = "";
        // this.eleHTML.style.animation = this.getShowAnimation();
    }; //show


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
     * getter for ShowAnimation
     */
    this.getShowAnimation = function() {
        return this.sShowAnimation;
    }; // getShowAnimation

    /**
     * setter for ShowAnimation
     */
    this.setShowAnimation = function(v) {
        this.sShowAnimation = v;
    }; // setShowAnimation

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
     * refresh
     */
    this.refresh = function() {
        // set properties...
        setCssProperty(this.eleHTML, "width", this.getWidth());
        setCssProperty(this.eleHTML, "height", this.getHeight());
        setCssProperty(this.eleHTML, "float", this.getFloat());
        setCssProperty(this.eleHTML, "clear", this.getClear());
        setCssProperty(this.eleHTML, "background", this.getBackground());
    }; //refresh

    //create
    this.create(sParent, sName);

}; //oPanel

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oPanel = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();

    self.pnlContentDesigner[iDi] = new nsNessuno.oPanel(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setClear("both");
    self.pnlContentDesigner[iDi].setWidth("100%");
    self.pnlContentDesigner[iDi].setHeight("300px");


    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oPanel
/**
 * END DESIGN TIME
 */
