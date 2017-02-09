/*
 * oImg
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:28
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oImg = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oImg"; // tag
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

    this.sValue = "";
    this.sFloat = "";
    this.sClear = "both";
    this.iStretch = 0;
    this.sHint = "";
    this.sText = "";

    this._sDefaultImage = "base/images/image_placeholder.jpg";

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

        // set value
        this.setValue(this._sDefaultImage);

        // create element
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
     * getter for Text
     */
    this.getText = function() {
        return this.sText;
    }; // getText

    /**
     * setter for Text
     */
    this.setText = function(v) {
        this.sText = v;
    }; // setText

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
     * getter for evClick
     */
    this.getEvClick = function() {
        return this.evClick;
    }; // getEvClick

    /**
     * setter for evClick
     */
    this.setEvClick = function(v) {
        this.evClick = v;
        if(this.evClick) {
            this.eleHTML.addEventListener("click",function(){self.evClick();});    
        }
        
        // this.eleHTML.onclick = this.evClick;
    }; // setEvClick

    /**
     * getter for Stretch
     */
    this.getStretch = function() {
        return this.iStretch;
    }; // getStretch

    /**
     * setter for Stretch
     */
    this.setStretch = function(v) {
        this.iStretch = v;
        this.refresh();
    }; // setStretch

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
     * refresh
     */
    this.refresh = function() {
        if (this.eleHTML) {
            var sTmp = "";
            this.eleHTML.innerHTML = "&nbsp;";
            if (this.sText !== "") {
                this.eleHTML.innerHTML = "<div style=\"padding-left: "+this.getWidth()+";\">" + this.getText() + "</div>";
            }

            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.getFloat());
            setCssProperty(this.eleHTML, "clear", this.getClear());

            sTmp = this.sValue;
            if (sTmp.indexOf("url") < 0) {
                sTmp = "url('" + sTmp + "')";
            }
            this.eleHTML.style.background = sTmp;
            this.eleHTML.style.backgroundRepeat = "no-repeat";
            this.eleHTML.style.backgroundPosition = "top right";
            this.eleHTML.setAttribute("title", this.getHint());
            this.eleHTML.style.cursor = "default";
            // cursor: auto (uses what is set by user)
            // cursor: crosshair (should produce a cross)
            // cursor: default (cursor remains as it is)
            // cursor: e-resize (arrow pointing right)
            // cursor: hand (the traditional pointing hand)
            // cursor: help (a Question Mark should appear)
            // cursor: move (a cross with arrows on the tips)
            // cursor: n-resize (an arrow pointing north or up)
            // cursor: ne-resize (an arrow pointing northeast)
            // cursor: nw-resize (an arrow pointing northwest)
            // cursor: pointer (that hand again)
            // cursor: s-resize (an arrow pointing south or down)
            // cursor: se-resize (an arrow pointing southeast)
            // cursor: sw-resize (an arrow pointing southwest)
            // cursor: text (looks like the end of an I-beam)
            // cursor: w-resize (an arrow pointing west)
            // cursor: wait (an hourglass)

            if (this.getStretch() > 0) {
                setCssProperty(this.eleHTML, "backgroundSize", sprintf("{0} {1}", this.getWidth(), this.getHeight()));
            }
        }
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
     * getter for Hint
     */
    this.getHint = function() {
        return this.sHint;
    }; // getHint

    /**
     * setter for Hint
     */
    this.setHint = function(v) {
        this.sHint = v;
        this.refresh();
    }; // setHint

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

}; //oImg

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oImg = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oImg(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setWidth("170px");
    self.pnlContentDesigner[iDi].setHeight("100px");
    self.pnlContentDesigner[iDi].setStretch(1);


    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oImg
/**
 * END DESIGN TIME
 */
