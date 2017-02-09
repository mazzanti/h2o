/*
 * oCodeMirror
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-30 21:27:20
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oCodeMirror = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oCodeMirror"; // tag
    this.manager = null;
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "200px";
    this.iSequence = 0;

    this.aData = [];
    this.aFields = [];

    this._iCountIncludes = 0;
    this.aIncludes = [];

    this.sFloat = "";
    this.sClear = "both";
    this.sFloat = "";

    this.sSqlFill = "";

    this.aModes = ["javascript","text/x-sql","text/x-mysql","text/x-mssql","text/x-pgsql"];
    this.sTheme = "";
    this.sMode = "javascript";
    this.sValue = "";

    this.iReadonly = 0;
    this.iLineNumbers = 0;
    this.iLineWrapping = 1;

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
     * getter for Theme
     */
    this.getTheme = function() {
        return this.sTheme;
    }; // getTheme

    /**
     * setter for Theme
     */
    this.setTheme = function(v) {
        this.sTheme = v;
        this.refresh();
    }; // setTheme

    /**
     * getter for Mode
     */
    this.getMode = function() {
        return this.sMode;
    }; // getMode

    /**
     * setter for Mode
     */
    this.setMode = function(v) {
        this.sMode = v;
        this.refresh();
    }; // setMode

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
     * getter for LineNumbers
     */
    this.getLineNumbers = function() {
        this.iLineNumbers = castInt(this.iLineNumbers);
        return this.iLineNumbers;
    }; // getLineNumbers

    /**
     * setter for LineNumbers
     */
    this.setLineNumbers = function(v) {
        v = castInt(v);
        this.iLineNumbers = v;
        this.refresh();
    }; // setLineNumbers

    /**
     * getter for LineWrapping
     */
    this.getLineWrapping = function() {
        this.iLineWrapping = castInt(this.iLineWrapping);
        return this.iLineWrapping;
    }; // getLineWrapping

    /**
     * setter for LineWrapping
     */
    this.setLineWrapping = function(v) {
        v = castInt(v);
        this.iLineWrapping = v;
        this.refresh();
    }; // setLineWrapping

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

            document.getElementById(this.sParent).appendChild(node);

            this.eleHTML = node;

            this.draw();
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
     * getter for Manager
     */
    this.getManager = function() {
        return this.manager;
    }; // getManager

    /**
     * setter for Manager
     */
    this.setManager = function(v) {
        this.manager = v;
    }; // setManager

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
     * refresh description
     */
    this.refresh = function() {
        try {
            this.eleHTML.innerHTML = "<textarea id=\"" + this.getName() + "_textarea\" style=\"width: 100%; height: 100%; display: none;\"></textarea>";

            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.getFloat());
            setCssProperty(this.eleHTML, "clear", this.getClear());

            if (window.CodeMirror) {
                //
                // draw codemirror
                //

                var te = document.getElementById(this.getName() + "_textarea");
                te.value = this.getValue();

                window.editor = window.CodeMirror.fromTextArea(te, {
                    mode: self.getMode(), //javascript
                    lineNumbers: self.getLineNumbers(),
                    lineWrapping: self.getLineWrapping(),
                    matchBrackets: true,
                    autoCloseBrackets: true
                        // extraKeys: { "Ctrl-Q": function(cm) { cm.foldCode(cm.getCursor()); } },
                });
                window.editor.setSize("100%", "100%");
                // theme
                if (this.sTheme !== "") {
                    window.editor.setOption("theme", "default");
                }

                // readonly
                if (this.getReadonly() === 1) {
                    window.editor.setOption("readOnly", true);
                }


            }
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * load modules
     */
    this.loadModule = function(i) {
        var sUrl = "";
        var sExtension = "";
        var sWhat = "";

        if (i >= self.aIncludes.length) {
            return;
        }

        if (!self.aIncludes[i]) {
            return;
        }

        window.nsNessuno.externalIncludes = window.nsNessuno.externalIncludes || [];

        if (window.nsNessuno.externalIncludes.indexOf(self.aIncludes[i]) === -1) {
            // if ((self.aIncludes[i] in window.nsNessuno) === false) {
            sUrl = self.aIncludes[i];
            sExtension = getFileExtension(sUrl);
            if (sExtension === "js") {
                sWhat = "includeJs";
            } else {
                sWhat = "includeCss";
            }

            window.nsNessuno.externalIncludes.push(sUrl);

            window[sWhat](self.TAG, sUrl, function() {
                self._iCountIncludes++;

                // if all scripts are loaded, create the main
                if (self._iCountIncludes >= self.aIncludes.length) {
                    self.refresh();
                } else {
                    // load next script
                    self.loadModule(self._iCountIncludes);
                }
            });
        } else {
            console.log("module already in memory:", self.aIncludes[i]);
            self._iCountIncludes++;
            self.loadModule(self._iCountIncludes);
        }
    }; //loadModule

    /**
     * load includes
     */
    // this.loadIncludes = function() {
    //     try {
    //         var i = 0;
    //         self._iCountIncludes = 0;
    //         // for (i = 0; i < this.aIncludes.length; i++) {
    //         this.loadModule(i);
    //         // }
    //     } catch (err) {
    //         this.onException(err);
    //     }
    // }; //loadIncludes

    /**
     * draw description
     */
    this.draw = function() {
        try {
            //
            this.aIncludes = [
                "https://codemirror.net/lib/codemirror.css",
                "https://codemirror.net/addon/hint/show-hint.css",

                "https://codemirror.net/lib/codemirror.js",
                "https://codemirror.net/addon/hint/show-hint.js",
                "https://codemirror.net/addon/hint/javascript-hint.js",
                "https://codemirror.net/addon/hint/sql-hint.js",

                //
                "https://codemirror.net/addon/edit/matchbrackets.js",
                "https://codemirror.net/addon/edit/closebrackets.js",

                //
                "https://codemirror.net/mode/javascript/javascript.js",
                "https://codemirror.net/mode/htmlmixed/htmlmixed.js",
                "https://codemirror.net/mode/xml/xml.js",
                "https://codemirror.net/mode/css/css.js",
                "https://codemirror.net/mode/clike/clike.js",
                "https://codemirror.net/mode/php/php.js",
                "https://codemirror.net/mode/sql/sql.js"

            ];

            self._iCountIncludes = 0;
            this.loadModule(self._iCountIncludes);

            //
            // this.refresh();
        } catch (err) {
            this.onException(err);
        }
    }; // draw

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
            var jsonData = JSON.parse(d);
            if (!jsonData.aRes) {
                return;
            }
            // map the received data and populate component
            sValue = getValueByColName(jsonData.aRes[0], 0, "sValue");

            self.setValue(sValue);
        } catch (err) {
            this.onException(err);
        }
    }; // populateData

    //create
    this.create(sParent, sName);

}; //oCodeMirror

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oCodeMirror = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oCodeMirror(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oCodeMirror
/**
 * END DESIGN TIME
 */
