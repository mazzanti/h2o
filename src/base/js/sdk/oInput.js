/*
 * oInput
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 15:39:24
 * @Description: template
 */

//http://www.w3schools.com/html/html_form_input_types.asp
//<input type="number" name="points" min="0" max="100" step="10" value="30">
//<input type="date" name="bday">
//<input type="date" name="bday" max="1979-12-31">
//<input type="color" name="favcolor">
//<input type="range" name="points" min="0" max="10">
//<input type="month" name="bdaymonth">
//<input type="week" name="week_year">
//<input type="time" name="usr_time">
//<input type="datetime" name="bdaytime">
//<input type="datetime-local" name="bdaytime">
//<input type="email" name="email">
//<input type="search" name="googlesearch">
//<input type="tel" name="usrtel">
//<input type="url">

var nsNessuno = nsNessuno || {};

nsNessuno.oInputTypes = {
    aTypes: ["text", "password", "checkbox", "radio", "hidden", "button", "submit",
        "number", "date", "color", "range", "month", "week", "time", "datetime",
        "datetime-local", "email", "search", "tel", "url"
    ]
};

nsNessuno.oInput = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oInput"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "20px";
    this.iSequence = 0;
    this.sSqlFill = "";
    this.iIntervalFill = 0;
    this.sSqlChangeHandler = "";

    this.aData = [];
    this.aFields = [];
    this.aTypes = nsNessuno.oInputTypes.aTypes;

    this._iCountIncludes = 0;
    this.aIncludes = [];

    this.sType = "text";
    this.sCaption = "";
    this.sValue = "";
    this.sPlaceholder = "";
    this.iReadonly = 0;
    this.iRequired = 0;
    this.sBackground = "";
    this.sBorder = "";
    this.sColor = "";
    this.sInputColor = "";
    this.sInputBackground = "";
    this.sMessage = "";
    this.sRegExPattern = "";

    this.sCaptionTextAlign = "left";
    this.sCaptionEditable = "1";
    this.sCaptionMode = "left";
    this.sSizeCaption = "20%";
    this.sSizeInput = "80%";
    this.sMaxLength = "";

    this.sMin = "";
    this.sMax = "";
    this.sStep = "";
    this.sFloat = "";
    this.sClear = "";
    this.sDisplay = "";

    this.evChange = null;
    this.evChangeHandler = null;

    this.tmrIntervalFill = null;

    this._eleInput = null;

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
     * getter for IntervalFill
     */
    this.getIntervalFill = function() {
        if (typeof this.iIntervalFill === "string") {
            this.iIntervalFill = parseInt(this.iIntervalFill);
        }
        return this.iIntervalFill;
    }; // getIntervalFill

    /**
     * setter for IntervalFill
     */
    this.setIntervalFill = function(v) {
        if (typeof v === "string") {
            v = parseInt(v);
        }
        this.iIntervalFill = v;
    }; // setIntervalFill

    /**
     * getter for RegExPattern
     */
    this.getRegExPattern = function() {
        return this.sRegExPattern;
    }; // getRegExPattern

    /**
     * setter for RegExPattern
     */
    this.setRegExPattern = function(v) {
        this.sRegExPattern = v;
    }; // setRegExPattern

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
     * get name cleaned by parent
     */
    this.getNameClean = function() {
        return this.getName().replace(this.getParent() + "_", "");
    }; //getNameClean

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
            if (!isNull(ele)) {
                ele.removeChild(this.eleHTML);
            }

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

            this.refresh();
        } catch (err) {
            this.onException(err);
        }
    }; //createHtmlElement

    /**
     * getter for CaptionMode
     */
    this.getCaptionMode = function() {
        return this.sCaptionMode;
    }; // getCaptionMode

    /**
     * setter for CaptionMode
     */
    this.setCaptionMode = function(v) {
        this.sCaptionMode = v;
    }; // setCaptionMode

    /**
     * getter for CaptionEditable
     */
    this.getCaptionEditable = function() {
        return this.sCaptionEditable;
    }; // getCaptionEditable

    /**
     * setter for CaptionEditable
     */
    this.setCaptionEditable = function(v) {
        this.sCaptionEditable = v;
    }; // setCaptionEditable

    /**
     * update editable captions
     */
    this.updateCaptionEditable = function(e) {
        this.setCaption(e.target.value);

        var ele = null;
        ele = document.getElementById(e.target.id);
        if (!isNull(ele)) {
            ele.parentElement.removeChild(ele);
        }

        // update value ajax, user,form,field
    }; //updateCaptionEditable

    /**
     * drawCaptionEditable description
     */
    this.drawCaptionEditable = function() {
        try {

            var ele = document.getElementById(this.getName() + "_Caption");
            if (ele) {


                ele.addEventListener("click", function(e) {
                    var initialvalue = ele.innerHTML;
                    ele.innerHTML = "";

                    var node = document.createElement('input');
                    node.className = "captionEditableInput";
                    node.id = "captionEditableInput";
                    node.type = "text";
                    node.value = initialvalue;

                    setCssProperty(node, "width", "100%");
                    setCssProperty(node, "boxSizing", "border-box");

                    e.target.parentElement.appendChild(node);

                    // focusout
                    node.addEventListener("focusout", function(e) {
                        self.updateCaptionEditable(e);
                    }); // focusout

                    // keypress
                    node.addEventListener("keypress", function(e) {
                        if (e.keyCode === 13) {
                            self.updateCaptionEditable(e);
                        }
                    }); // keypress

                    node.focus();
                });
            }
        } catch (err) {
            this.onException(err);
        }
    }; // drawCaptionEditable

    /**
     * refresh description
     */
    this.refresh = function() {
        var sHtml = "";
        var sStyle = "";

        var sStyleInput = "";
        var sStyleCaption = "";
        var sClassInput = "";

        if (isMobile()) {
            this.setCaptionMode("top");
        }

        if (this.getCaptionMode() === "left") {
            if (this.sSizeInput === "100%") {
                this.sSizeInput = "80%";
                this.sSizeCaption = "20%";
                this.setHeight("20px");
            }
            sStyleInput = "float: left; width: " + this.sSizeInput + ";";
            sStyleCaption = "float: left; width: " + this.sSizeCaption + ";";
        }

        if (this.getCaptionMode() === "top") {
            this.sSizeCaption = "100%";
            this.sSizeInput = "100%";

            sStyleInput = "width: " + this.sSizeInput + ";";
            sStyleCaption = "width: " + this.sSizeCaption + ";";

            this.setHeight("");
        }

        if (this.getCaptionMode() === "none") {
            this.sSizeCaption = "100%";
            this.sSizeInput = "100%";

            sStyleInput = "width: " + this.sSizeInput + ";";
            sStyleCaption = "display: none;";

            this.setHeight("");
        }

        //other...
        sStyleCaption += " text-align: " + this.getCaptionTextAlign() + ";";

        if (this.getRequired() === 1) {
            sClassInput += " inputRequired";
        }
        if (this.getReadonly() === 1) {
            sClassInput += " readonly";
        }

        try {
            if (!this.eleHTML) {
                return;
            }

            sStyle = "width: 100%;";
            sStyle += " box-sizing : border-box;";
            sStyle += " margin : 0px auto;";
            sStyle += " color: " + this.getInputColor() + ";";
            sStyle += " background: " + this.getInputBackground() + ";";

            if (!isEmpty(this.sBorder)) {
                sStyle += " border: 1px solid " + this.sBorder + ";\"";
            }

            sHtml += "<div style=\"" + sStyleCaption + "; cursor: pointer;\">";
            sHtml += "<span id=\"" + this.getName() + "_Caption\">" + this.getCaption() + "</span>";
            sHtml += "</div>";
            sHtml += "<div style=\"" + sStyleInput + ";\">";

            sHtml += "<input";
            sHtml += " class=\"" + sClassInput + "\"";
            sHtml += " id=\"" + this.getName() + "_Input\"";
            sHtml += " name=\"" + this.getName() + "_Input\"";
            sHtml += " style=\"" + sStyle + "\"";
            sHtml += " type=\"" + this.getType() + "\"";
            sHtml += " value=\"" + this.getValue() + "\"";
            sHtml += " placeholder=\"" + this.getPlaceholder() + "\"";

            if (this.getReadonly() === 1) {
                sHtml += " readonly";
            }

            // max length
            if (this.sMaxLength !== "") {
                sHtml += " maxlength=\"" + this.sMaxLength + "\"";
            }

            sHtml += " />";

            sHtml += "<div id=\"" + this.getName() + "_Message\">" + this.getMessage() + "</div>";

            sHtml += "</div>";

            this.eleHTML.innerHTML = sHtml;

            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.getFloat());
            setCssProperty(this.eleHTML, "clear", this.getClear());
            setCssProperty(this.eleHTML, "display", this.getDisplay());
            setCssProperty(this.eleHTML, "background", this.getBackground());
            setCssProperty(this.eleHTML, "color", this.getColor());
            setCssProperty(this.eleHTML, "overflow", "hidden");


            this._eleInput = document.getElementById(this.getName() + "_Input");
            this._eleMessage = document.getElementById(this.getName() + "_Message");
            //
            this.setEvents();

            //
            if (this.getCaptionEditable() === "1") {
                this.drawCaptionEditable();
            }
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * startIntervalFill description
     */
    this.startIntervalFill = function() {
        try {
            this.stopIntervalFill();
            if (this.getIntervalFill() > 0 && self.getSqlFill() !== "") {
                this.tmrIntervalFill = setInterval(function() {
                    // self.setValue(new Date().getTime()); //TEST

                    //
                    var param = btoa(JSON.stringify({ idvar: self.getSqlFill(), id_form: self._owner._owner.getIdForm(), sname: self.getNameClean() }));
                    self._owner._owner.manager.connection1.callHttpRequest(param, self.populateData);
                }, this.iIntervalFill);
            }
        } catch (err) {
            this.onException(err);
        }
    }; // startIntervalFill

    /**
     * stopIntervalFill description
     */
    this.stopIntervalFill = function() {
        try {
            clearInterval(this.tmrIntervalFill);
            this.tmrIntervalFill = null;
        } catch (err) {
            this.onException(err);
        }
    }; // stopIntervalFill

    /**
     * setEvents description
     */
    this.setEvents = function() {
        try {
            // events
            if (this._eleInput) {
                // change
                this._eleInput.addEventListener("change", function(e) {
                    self.sValue = self._eleInput.value;

                    // if a RegExpattern is specified...
                    if (!isEmpty(self.getRegExPattern())) {
                        // test the value with RegExpattern
                        self.testValueWithRegExPattern();
                    } // check RegExpattern

                    if (self.evChange) {
                        self.evChange(e, self.getNameClean());
                    }
                });

                // is not readonly
                if (this.getReadonly() !== 1) {
                    // keyup
                    this._eleInput.addEventListener("keyup", function() {
                        self.sValue = self._eleInput.value;
                        // if a RegExpattern is specified...
                        if (!isEmpty(self.getRegExPattern())) {
                            // test the value with RegExpattern
                            self.testValueWithRegExPattern();
                        } // check RegExpattern
                    });
                }

            }
        } catch (err) {
            this.onException(err);
        }
    }; // setEvents

    /**
     * testValueWithRegExPattern
     * tests current value with RegExpattern
     */
    this.testValueWithRegExPattern = function() {
        try {
            var res = null;
            var sText = self.getValue();
            var sPat = self.getRegExPattern();
            var regEx = new RegExp(sPat, "gi");

            res = sText.match(regEx);
            if (res) {
                // ok
                self.testValueWithRegExPatternIsOk();
            } else {
                // ko
                self.testValueWithRegExPatternIsKo();
            }
        } catch (err) {
            self.onException(err);
        }
    }; // testValueWithRegExPattern

    /**
     * test passed
     */
    this.testValueWithRegExPatternIsOk = function() {
        this._eleInput.style.background = null;
    }; //testValueWithRegExPatternIsOk

    /**
     * test negative
     */
    this.testValueWithRegExPatternIsKo = function() {
        this._eleInput.style.background = "red";
    }; //testValueWithRegExPatternIsKo

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
        if (this._eleInput) {
            this._eleInput.value = this.getValue();
        } else {
            this.refresh();
        }
    }; // setValue

    /**
     * getter for Message
     */
    this.getMessage = function() {
        return this.sMessage;
    }; // getMessage

    /**
     * setter for Message
     */
    this.setMessage = function(v) {
        this.sMessage = v;
        if (this._eleMessage) {
            this._eleMessage.innerHTML = this.getMessage();
        } else {
            this.refresh();
        }
    }; // setMessage

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
        this.iReadonly = castInt(this.iReadonly);
        return this.iReadonly;
    }; // getReadonly

    /**
     * setter for Readonly
     */
    this.setReadonly = function(v) {
        v = castInt(v);
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
     * getter for Required
     */
    this.getRequired = function() {
        return this.iRequired;
    }; // getRequired

    /**
     * setter for Required
     */
    this.setRequired = function(v) {
        this.iRequired = v;
        this.refresh();
    }; // setRequired

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
     * getter for Min
     */
    this.getMin = function() {
        return this.sMin;
    }; // getMin

    /**
     * setter for Min
     */
    this.setMin = function(v) {
        this.sMin = v;
        this.refresh();
    }; // setMin

    /**
     * getter for Max
     */
    this.getMax = function() {
        return this.sMax;
    }; // getMax

    /**
     * setter for Max
     */
    this.setMax = function(v) {
        this.sMax = v;
        this.refresh();
    }; // setMax

    /**
     * getter for Step
     */
    this.getStep = function() {
        return this.sStep;
    }; // getStep

    /**
     * setter for Step
     */
    this.setStep = function(v) {
        this.sStep = v;
        this.refresh();
    }; // setStep

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
     * getter for MaxLength
     */
    this.getMaxLength = function() {
        return this.sMaxLength;
    }; // getMaxLength

    /**
     * setter for MaxLength
     */
    this.setMaxLength = function(v) {
        this.sMaxLength = v;
    }; // setMaxLength

    /**
     * getter for SqlChangeHandler
     */
    this.getSqlChangeHandler = function() {
        return this.sSqlChangeHandler;
    }; // getSqlChangeHandler

    /**
     * setter for sSqlChangeHandler
     */
    this.setSqlChangeHandler = function(v) {
        this.sSqlChangeHandler = v;
        this.refresh();
    }; // setSqlChangeHandler

    /**
     * getter for evChangeHandler
     */
    this.getEvChangeHandler = function() {
        return this.evChangeHandler;
    }; // getEvChangeHandler

    /**
     * setter for evChangeHandler
     */
    this.setEvChangeHandler = function(v) {
        this.evChangeHandler = v;
        this.refresh();
    }; // setEvChangeHandler

    /**
     * getter for change
     */
    this.getEvChange = function() {
        return this.evChange;
    }; // getEvChange

    /**
     * setter for event change
     */
    this.setEvChange = function(v) {
        this.evChange = v;
        this.refresh();
    }; // setEvChange

    /**
     * getTypes description
     */
    this.getTypes = function() {
        try {
            return this.aTypes;
        } catch (err) {
            this.onException(err);
        }
    }; // getTypes

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
            if (d === "") {
                return;
            }
            var sValue = "";
            var jsonData = JSON.parse(d);
            if (!jsonData.aRes) {
                return;
            }

            // map the received data and populate component
            sValue = getValueByColName(jsonData.aRes[0], 0, "sValue");

            self.setValue(sValue);
        } catch (err) {
            self.onException(err);
        }
    }; // populateData

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
     * show
     */
    this.show = function() {
        this.sDisplay = "";
        this.refresh();
    }; //show

    /**
     * hide
     */
    this.hide = function() {
        this.sDisplay = "none";
        this.refresh();
    }; //hide

    /**
     * getter for InputBackground
     */
    this.getInputBackground = function() {
        return this.sInputBackground;
    }; // getInputBackground

    /**
     * setter for InputBackground
     */
    this.setInputBackground = function(v) {
        this.sInputBackground = v;
    }; // setInputBackground

    /**
     * getter for InputColor
     */
    this.getInputColor = function() {
        return this.sInputColor;
    }; // getInputColor

    /**
     * setter for InputColor
     */
    this.setInputColor = function(v) {
        this.sInputColor = v;
    }; // setInputColor

    /**
     * getter for CaptionTextAlign
     */
    this.getCaptionTextAlign = function() {
        return this.sCaptionTextAlign;
    }; // getCaptionTextAlign

    /**
     * setter for CaptionTextAlign
     */
    this.setCaptionTextAlign = function(v) {
        this.sCaptionTextAlign = v;
    }; // setCaptionTextAlign

    //create
    this.create(sParent, sName);

}; //oInput


/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oInput = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oInput(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setType("text");
    self.pnlContentDesigner[iDi].setCaption(iDi);

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oInput
/**
 * END DESIGN TIME
 */
