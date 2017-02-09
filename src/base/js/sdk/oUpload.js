/*
 * oUpload
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:24
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oUpload = function(sParent, sName) {
  "use strict";
    var self = this;

    this.TAG = "oUpload"; // tag
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
     * refresh description
     */
    this.refresh = function() {
        try {
            var sHtml = "<div class=\"container\">" +
                "<p>" +
                "Select File: <input type=\"file\" id=\""+this.getName()+"_file\"> <input type=\"button\" id=\""+this.getName()+"_submit\" value=\"Upload!\">" +
                "</p>" +
                "<div class=\"progress_outer\">" +
                "<div id=\""+this.getName()+"_progress\" class=\"progress\"></div>" +
                "</div>" +
                "</div>";
            this.eleHTML.innerHTML = sHtml;

            var _submit = document.getElementById(this.getName()+'_submit'),
                _file = document.getElementById(this.getName()+'_file'),
                _progress = document.getElementById(this.getName()+'_progress');

            var upload = function() {
                if (_file.files.length === 0) {
                    return;
                }

                var data = new FormData();
                data.append('SelectedFile', _file.files[0]);

                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                        try {
                            var resp = JSON.parse(request.response);
                        } catch (e) {
                            var resp = {
                                status: 'error',
                                data: 'Unknown error occurred: [' + request.responseText + ']'
                            };
                        }
                        console.log(resp.status + ': ' + resp.data);
                    }
                };

                request.upload.addEventListener('progress', function(e) {
                    _progress.style.width = Math.ceil(e.loaded / e.total) * 100 + '%';
                }, false);

                request.open('POST', 'upload.php');
                request.send(data);
            };

            _submit.addEventListener('click', upload);
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    //create
    this.create(sParent, sName);

}; //oUpload
