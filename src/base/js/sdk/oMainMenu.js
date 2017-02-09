/*
 * oMainMenu
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:22
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oMainMenu = function(sParent, sName) {
    "use strict";

    var self = this;

    this.TAG = "oMainMenu"; // tag
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

    this.oMenu = {
        "File": {
            "Open...": "showOpen",
            "Save": "showSave",
            "Import": {
                "CSV": "",
                "Excel": ""
            },
            "Export": {
                "CSV": "",
                "Excel": ""
            },
            "Logout": "doLogout"
        },
        "Edit": {
            "Copy": "doCopy",
            "Cut": "doCut",
            "Paste": "doPaste"
        },
        "Goto": {
            "Main menu": "doMainmenu"
        },
        "System": {
            "Options": "doOptions"
        },
        "View": {
            "New window": "doOpenWindow",
            "Form list": "showActiveForms"
        },
        "?": {
            "About": "showAbout"
        }
    };

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
     * addMenuItemEvClick
     */
    this.addMenuItemEvClick = function(ele, sAction) {
        ele.addEventListener("click", function(a) {
            if (sAction === "#doLogout") {
                self.manager.doLogout();
            }
            if (sAction === "#doOpenWindow") {
                self.manager.doOpenWindow();
            }
            if (sAction === "#doMainmenu") {
                self.manager.doMainMenu();
            }
            if (sAction === "#doOptions") {
                self.manager.doOptions();
            }
            if (sAction === "#doPrint") {
                self.manager.doPrint();
            }
        });
    }; //addMenuItemEvClick

    /**
     * refresh description
     */
    this.refresh = function() {
        try {
            var sHtml = "";
            // var sStyle = "display: block; float: left; padding: 3px;";
            var sClass = "";

            var getSubItems = function(myParam) {
                if (typeof myParam === "object") {
                    sHtml += "<ul>";
                    for (var property in myParam) {
                        if (myParam.hasOwnProperty(property)) {
                            sClass = (typeof myParam[property] !== "object") ? myParam[property] : "";
                            sHtml += "<li><a href=\"#" + sClass + "\">" + property + "</a>";
                            getSubItems(myParam[property]);
                            sHtml += "</li>";
                        }
                    }
                    sHtml += "</ul>";
                }
            };

            sHtml += "<nav>";
            getSubItems(this.oMenu);
            sHtml += "</nav>";

            this.eleHTML.innerHTML = sHtml;

            //
            var eles = document.getElementById(this.getName()).getElementsByTagName("a");
            var i = 0;
            var sHref = "";
            for (i = 0; i < eles.length; i++) {
                sHref = eles[i].getAttribute("href");
                if ((sHref !== "") && (sHref !== "#")) {
                    this.addMenuItemEvClick(eles[i], sHref);
                }
            }
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * draw description
     */
    this.draw = function() {
        try {
            this.refresh();
        } catch (err) {
            this.onException(err);
        }
    }; // draw
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
    //create
    this.create(sParent, sName);

}; //oMainMenu
