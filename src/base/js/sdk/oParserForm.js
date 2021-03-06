/*
 * oParserForm
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:22
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oParserForm = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oParserForm"; // tag
    this.manager = null;
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";

    this.aData = [];
    this.aFields = [];

    this.iCountIncludes = 0;
    this.aIncludes = [];

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

        // this.createHtmlElement();
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
     * get value by col name
     */
    this.getValueByColName = function(obj, irow, sColName) {
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

    /**
     * init description
     */
    this.build = function(jsonForm, cont, callback) {
        callback = callback || null;

        var j = 0;
        var sCName = "";
        var sCType = 0;
        var sCProperties = "";
        try {

            if (!jsonForm.aRows) {
                return;
            }

            // associate each component to his parent container
            for (j = 0; j < jsonForm.aRows.length; j++) {
                sCName = self.getValueByColName(jsonForm, j, "sname");
                sCType = self.getValueByColName(jsonForm, j, "stype");
                sCProperties = self.getValueByColName(jsonForm, j, "sproperties");
                if (cont[sCName]) {
                    cont[sCName].destroy();
                }

                if (nsNessuno[sCType]) {
                    cont[sCName] = new nsNessuno[sCType](cont.getName(), cont.getChildName(sCName));
                }

                if (cont[sCName]) {
                    cont[sCName].setOwner(cont);
                    if (cont[sCName].setProperties) {
                        sCProperties = JSON.parse(sCProperties);
                        cont[sCName].setProperties(sCProperties);
                    }
                }
            } //loop

            if (callback) {
                callback();
            }
        } catch (err) {
            console.log("Error on", sCName, sCType);
            this.onException(err);
        }
    }; // init

    //create
    this.create(sParent, sName);

}; //oParserForm
