/*
 * oInputAutocomplete
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:21
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oInputAutocomplete = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oInputAutocomplete"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "20px";

    this.aData = [];
    this.aDataAutocomplete = [];
    this.aFields = [];

    this.iCountIncludes = 0;
    this.aIncludes = [];

    this.sType = "text";
    this.sCaption = "";
    this.sValue = "";
    this.sPlaceholder = "";
    this.iReadonly = 0;
    this.sBackground = "";
    this.sBorder = "";
    this.sColor = "";
    this.iEnterAsTab = 1;

    this.sSizeCaption = "20%";
    this.sSizeInput = "80%";
    this.sFloat = "";
    this.sClear = "";

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
            setCssProperty(node, "width", this.getWidth());
            setCssProperty(node, "height", this.getHeight());
            setCssProperty(node, "clear", "both");
            setCssProperty(node, "borderBottom ", "1px solid #ddd");

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
            var sStyle = "";
            sStyle = "width: 100%;";
            sStyle += " box-sizing : border-box;";
            sStyle += " margin : 0px auto;";
            sStyle += " color: " + this.sColor + ";";
            sStyle += " background: " + this.sBackground + ";";
            if (!isEmpty(this.sBorder)) {
                sStyle += " border: 1px solid " + this.sBorder + ";\"";
            }

            var sHtml = "";

            sHtml += "<div style=\"float: left; cursor: pointer; width: " + this.sSizeCaption + ";\"><span id=\"" + this.getName() + "_Caption\">" + this.getCaption() + "</span></div>";
            sHtml += "<div style=\"float: left; width: " + this.sSizeInput + ";\">";

            sHtml += "<input";
            sHtml += " id=\"" + this.getName() + "_Input\"";
            sHtml += " name=\"" + this.getName() + "_Input\"";
            sHtml += " style=\"" + sStyle + "\"";
            sHtml += " type=\"" + this.getType() + "\"";
            sHtml += " value=\"" + this.getValue() + "\"";
            sHtml += " placeholder=\"" + this.getPlaceholder() + "\"";

            if (this.iReadonly > 0) {
                sHtml += " readonly";
            }

            sHtml += " />";
            sHtml += "</div>";

            this.eleHTML.innerHTML = sHtml;

            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.getFloat());
            setCssProperty(this.eleHTML, "clear", this.getClear());

            // build autocomplete...
            // var ele = document.getElementById("#" + this.getName() + "_Input");
            $("#" + this.getName() + "_Input").autocomplete({
                source: self.aDataAutocomplete,
                change: function(event, ui) {
                    self.sValue = this.value;
                    if (self.evChange) {
                        self.evChange();
                    }
                }
            });

            // ENTER as TAB
            if (this.iEnterAsTab === 1) {
                $("#" + this.getName() + "_Input").bind("keyup", function(e) {
                    if (e.keyCode === 13) {
                        $(this).blur();
                    }
                });
            } // EnterAsTab

        } catch (err) {
            this.onException(err);
        }
    }; // refresh

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
     * getter for Type
     */
    this.getType = function() {
        return this.sType;
    }; // getType

    /**
     * setter for Type
     */
    this.setType = function(v) {
        this.sType = v;
        this.refresh();
    }; // setType

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
     * setFocus description
     */
    this.setFocus = function() {
        try {
            this.eleHTML.focus();
            this.eleHTML.scrollIntoView();
        } catch (err) {
            this.onException(err);
        }
    }; // setFocus

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
    }; // setEvChange

    /**
     * setDataAutocomplete description
     */
    this.setDataAutocomplete = function(v) {
        try {
            this.aDataAutocomplete = v;
            this.refresh();
        } catch (err) {
            this.onException(err);
        }
    }; // setDataAutocomplete

    //create
    this.create(sParent, sName);

}; //oInputAutocomplete
