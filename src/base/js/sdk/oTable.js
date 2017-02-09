/*
 * oTable
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:23
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oTable = function(sParent, sName) {
  "use strict";
    var self = this;

    this.TAG = "oTable"; // tag
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

    this.sValue = "";
    this.iReadonly = 0;

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
                    if (!isNull(this[property])&&!isUndefined(this[property].destroy)) {
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
            var j = 0;

            sHtml += "<table id=\"" + this.getName() + "_Table\"";
            sHtml += " name=\"" + this.getName() + "_Table\"";
            sHtml += " style=\"width: 100%;\">";

            loopData: for (i = 0; i < this.aData.length; i++) {
                    sHtml += "<tr>";

                    loopCol: for (j = 0; j < this.aData[i].length; j++) {
                        if (i === 0) {
                            sHtml += "<th>";
                            sHtml += this.aData[i][j];
                            sHtml += "</th>";
                        } else {
                            sHtml += "<td>";
                            sHtml += this.aData[i][j];
                            sHtml += "</td>";
                        }
                    }

                    sHtml += "</tr>";
                } //loopData

            sHtml += "</table>";

            this.eleHTML.innerHTML = sHtml;

            this.startResizable();

        } catch (err) {
            this.onException(err);
        }
    }; // refresh

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
     * startResizable description
     */
    this.startResizable = function() {
        try {

            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            $("table th").mousedown(function(e) {

                start = $(this);
                pressed = true;
                startX = e.pageX;
                startWidth = $(this).width();
            });

            $(document).mousemove(function(e) {
                if (pressed) {
                    $(start).width(startWidth + (e.pageX - startX));
                }
            });

            $(document).mouseup(function() {
                if (pressed) {
                    pressed = false;
                }
            });
        } catch (err) {
            this.onException(err);
        }
    }; // startResizable

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

}; //oTable
