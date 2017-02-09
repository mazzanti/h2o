/*
 * oDatePicker
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:27
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oDatePicker = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oDatePicker"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "20px";

    this.aData = [];
    this.aFields = [];

    this.iCountIncludes = 0;
    this.aIncludes = [];

    this.sCaption = "";
    this.sValue = "";
    this.sPlaceholder = "";
    this.iReadonly = 0;
    this.sBackground = "";
    this.sBorder = "";
    this.sColor = "";

    this.sSizeCaption = "20%";
    this.sSizeInput = "80%";

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
            setCssProperty(node, "clear", "both");
            setCssProperty(node, "borderBottom", "1px solid #ddd");

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
        var sStyleInput = "float: left; width: " + this.sSizeInput;
        var sStyleCaption = "float: left; width: " + this.sSizeCaption;

        if (isMobile()) {
            this.sSizeCaption = "100%";
            this.sSizeInput = "100%";

            sStyleInput = "width: " + this.sSizeInput;
            sStyleCaption = "width: " + this.sSizeCaption;

            this.setHeight("");
        }
        try {
            var sHtml = "";

            sHtml += sprintf("<div style=\"{0};\">{1}</div>", sStyleCaption, self.sCaption);
            sHtml += sprintf("<div style=\"{0};\">", sStyleInput);
            sHtml += "<input type=\"text\"";
            sHtml += " id=\"{NAME}_Input\" name=\"{NAME}_Input\"".replace(/{NAME}/g, self.getName());

            sHtml += sprintf(" style=\"width: 100%; color: {0}; background: {1}; border: 1px solid {2}; box-sizing : border-box;margin : 0px auto;\"",
                this.sColor,
                this.sBackground,
                this.sBorder
            );

            sHtml += " value=\"" + this.getValue() + "\"";
            sHtml += " placeholder=\"" + this.getPlaceholder() + "\"";

            if (this.iReadonly > 0)
                sHtml += " readonly";

            sHtml += " />";
            sHtml += "</div>";

            this.eleHTML.innerHTML = sHtml;

            $("#" + this.getName() + "_Input").datepicker({
                dateFormat: 'dd/mm/yy',
                changeMonth: true,
                changeYear: true,
                showWeek: true,
                showButtonPanel: true

                // showOn: "button",
                // buttonImage: "images/calendar.gif",
                // buttonImageOnly: true,
                // buttonText: "Select date"
            });
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

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

    //create
    this.create(sParent, sName);

}; //oDatePicker
