/*
 * oManager
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-24 18:42:48
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oManager = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oManager"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";

    this.iCountHandle = -1;
    this.iIncZIndex = 0;

    this.aData = [];
    this.aFields = [];
    this.aCaptions = [];

    this.aForms = [];
    this.oActiveForm = null;

    this.connection1 = null;
    this.theme1 = null;

    this.sSqlFormCreate = "FormCreate";

    // form type to open...
    this.EnumFormtype = {
        MAIN_CONTENT: "MAIN_CONTENT",
        MAIN_CONTENT_WITHMENU: "MAIN_CONTENT_WITHMENU",
        FULLSCREEN: "FULLSCREEN",
        WINDOWED: "WINDOWED",
        WINDOWED_MINIMIZED: "WINDOWED_MINIMIZED",
        WINDOWED_MAXIMIZED: "WINDOWED_MAXIMIZED"
    }; //EnumFormtype

    this.iCountIncludes = 0;
    this.aIncludes = [
        ["oConnection", "base/js/sdk/oConnection.js"],
        ["oParserForm", "base/js/sdk/oParserForm.js"],
        ["oTheme", "base/js/sdk/oTheme.js"],

        ["oDummyForm", "base/js/sdk/oDummyForm.js"],
        ["oDummy", "base/js/sdk/oDummy.js"],

        ["oFormDesigner", "base/js/sdk/form/oFormDesigner.js"],
        ["oFormSettings", "base/js/sdk/form/oFormSettings.js"],
        ["oFormStandard", "base/js/sdk/form/oFormStandard.js"],
        ["oFormGeneric", "base/js/sdk/form/oFormGeneric.js"],
        ["oFormLogin", "base/js/sdk/form/oFormLogin.js"],
        ["oFormMain", "base/js/sdk/form/oFormMain.js"],

        ["oChartShowReel", "base/js/sdk/oChartShowReel.js"],
        ["oChartStacked", "base/js/sdk/oChartStacked.js"],
        ["oChartDonut", "base/js/sdk/oChartDonut.js"],

        ["oCodeMirror", "base/js/sdk/oCodeMirror.js"],

        ["oInputAutocomplete", "base/js/sdk/oInputAutocomplete.js"],
        ["oRadialProgress", "base/js/sdk/oRadialProgress.js"],
        ["oProgressbar", "base/js/sdk/oProgressbar.js"],
        ["oGaugeLiquid", "base/js/sdk/oGaugeLiquid.js"],
        ["oGeoLocation", "base/js/sdk/oGeoLocation.js"],
        ["oDatePicker", "base/js/sdk/oDatePicker.js"],
        ["oGoogleMaps", "base/js/sdk/oGoogleMaps.js"],
        ["oSeparator", "base/js/sdk/oSeparator.js"],
        ["oMainMenu", "base/js/sdk/oMainMenu.js"],
        ["oCombobox", "base/js/sdk/oCombobox.js"],
        ["oTextarea", "base/js/sdk/oTextarea.js"],
        ["oToolbar", "base/js/sdk/oToolbar.js"],
        ["oBarcode", "base/js/sdk/oBarcode.js"],
        ["oQrCode", "base/js/sdk/oQrCode.js"],
        ["oJqGrid", "base/js/sdk/oJqGrid.js"],
        ["oButton", "base/js/sdk/oButton.js"],
        ["oUpload", "base/js/sdk/oUpload.js"],
        ["oAudio", "base/js/sdk/oAudio.js"],
        ["oPlant", "base/js/sdk/oPlant.js"],
        ["oVideo", "base/js/sdk/oVideo.js"],
        ["oGauge", "base/js/sdk/oGauge.js"],
        ["oPanel", "base/js/sdk/oPanel.js"],
        ["oLabel", "base/js/sdk/oLabel.js"],
        ["oInput", "base/js/sdk/oInput.js"],
        ["oTable", "base/js/sdk/oTable.js"],
        ["oGrid", "base/js/sdk/oGrid.js"],
        ["oDraw", "base/js/sdk/oDraw.js"],
        ["oImg", "base/js/sdk/oImg.js"],
        ["oPdf", "base/js/sdk/oPdf.js"],

        //
        ["JsBarcode", "base/common/jsbarcode/JsBarcode.all.min.js"], //oBarcode
        ["qrcode", "base/common/qrcodejs/qrcode.js"] //oQrCode
    ]; //aIncludes

    /**
     * load a module
     */
    this.loadModule = function(i) {
        if ((self.aIncludes[i][0] in window.nsNessuno) === false) {
            includeJs(self.TAG, self.aIncludes[i][1], function() {
                self.iCountIncludes++;
                // if all scripts are loaded, create the main
                if (self.iCountIncludes >= self.aIncludes.length) {
                    self.startMain();
                }
            });
        } else {
            console.log("module already in memory:", self.aIncludes[i][0]);
        }
    }; //loadModule

    /**
     * load includes
     */
    this.loadIncludes = function() {
        try {
            var i = 0;
            for (i = 0; i < this.aIncludes.length; i++) {
                this.loadModule(i);
            }
        } catch (err) {
            this.onException(err);
        }
    }; //loadIncludes

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

        this.createHtmlElement();
        if (!g_oGlobal.release) {
            // not in release
            this.loadIncludes();
        } else {
            // in release
            console.log("release: ", g_oGlobal.release);
            self.startMain();
        }
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

            document.getElementById(this.sParent).appendChild(node);

            this.eleHTML = node;
        } catch (err) {
            this.onException(err);
        }
    }; //createHtmlElement

    /**
     * create a form
     */
    this.createForm = function(sIdForm, oFormParam, oFormReferer, cb) {
        sIdForm = sIdForm || "-1";
        oFormParam = oFormParam || null;
        oFormReferer = oFormReferer || null;
        cb=cb || null;

        var sMode;
        var sComponent;
        var sProperties;

        // var sSqlFill;
        // var sSqlSelect;
        // var sSqlInsert;
        // var sSqlUpdate;
        // var sSqlDelete;

        var iFormHandle = 0;
        var iFound = 0;

        // increment the zindex
        this.getNewZIndex();

        /**
         * login form
         */
        if (sIdForm === "-1") {
            iFound++;
            self.destroyForms();

            freeObj(self.frmMain1);
            if (!isNull(self.frmMain1) && !isUndefined(self.frmMain1)) {
                self.frmMain1 = null;
                self.frmLogin1 = undefined;
                delete self.frmMain1;
            }

            freeObj(self.frmLogin1);
            self.frmLogin1 = new nsNessuno.oFormLogin(self.getName(), self.getChildName("frmLogin1"));
            self.frmLogin1.setOwner(self);
            self.frmLogin1.setManager(self);
        }

        /**
         * creating the main form
         */
        if (sIdForm === "0") {
            iFound++;
            this.setCookie("username", "giulio", 24); //FIXME
            freeObj(self.frmLogin1);
            if (!isNull(self.frmLogin1) && !isUndefined(self.frmLogin1)) {
                self.frmLogin1 = null;
                self.frmLogin1 = undefined;
                delete self.frmLogin1;
            }
            freeObj(self.frmMain1);
            self.frmMain1 = new nsNessuno.oFormMain(self.getName(), self.getChildName("frmMain1"));
            self.frmMain1.setOwner(self);
            self.frmMain1.setManager(self);
            self.frmMain1.draw();

            //
            self.refreshCaptions();
        }

        /**
         * form standard test
         */
        if (sIdForm === "1") {
            iFound++;

            iFormHandle = this.aForms.length;
            if (sMode === this.EnumFormtype.MAIN_CONTENT) {
                //
                self.frmMain1.pnlContent1a.hide();
                self.frmMain1.pnlContent1b.hide();
                //
                this.aForms[iFormHandle] = new nsNessuno.oFormStandard(self.frmMain1.pnlContent1.getName(), self.frmMain1.pnlContent1.getChildName("frmStandard1_" + iFormHandle));
                this.aForms[iFormHandle].setOwner(self);
                this.aForms[iFormHandle].setManager(self);
                this.aForms[iFormHandle].draw();
            } else {
                // popup
                this.aForms[iFormHandle] = new nsNessuno.oFormStandard(self.frmMain1.getName(), self.frmMain1.getChildName("frmStandard1_" + iFormHandle));
                this.aForms[iFormHandle].setOwner(self);
                this.aForms[iFormHandle].setManager(self);
                this.aForms[iFormHandle].eleHTML.style.position = "absolute";
                this.aForms[iFormHandle].eleHTML.style.left = "50px";
                this.aForms[iFormHandle].eleHTML.style.top = "50px";
                this.aForms[iFormHandle].eleHTML.style.border = "1px solid " + themeCurrent.input_border;
                this.aForms[iFormHandle].setWidth("");
                this.aForms[iFormHandle].setHeight("");

                this.aForms[iFormHandle].setMaxHeight((window.innerHeight - 100) + "px");

                this.aForms[iFormHandle].setTitle("Standard form concept popup");
                this.aForms[iFormHandle].showTitleBar();
                this.aForms[iFormHandle].draw();
            }
        }


        /**
         * settings form
         */
        if (sIdForm === "3") {
            iFound++;
            iFormHandle = this.aForms.length;
            if (sMode === this.EnumFormtype.MAIN_CONTENT) {
                //
                self.frmMain1.pnlContent1a.hide();
                self.frmMain1.pnlContent1b.hide();
                //
                this.aForms[iFormHandle] = new nsNessuno.oFormSettings(self.frmMain1.pnlContent1.getName(), self.frmMain1.pnlContent1.getChildName("frmSettings1_" + iFormHandle));
                this.aForms[iFormHandle].setOwner(self);
                this.aForms[iFormHandle].setManager(self);
                this.aForms[iFormHandle].draw();
            } else {
                // popup
                this.aForms[iFormHandle] = new nsNessuno.oFormSettings(self.frmMain1.getName(), self.frmMain1.getChildName("frmSettings1_" + iFormHandle));
                this.aForms[iFormHandle].setOwner(self);
                this.aForms[iFormHandle].setManager(self);
                this.aForms[iFormHandle].setWidth("");
                this.aForms[iFormHandle].setHeight("");
                this.aForms[iFormHandle].setMaxHeight((window.innerHeight - 100) + "px");

                this.aForms[iFormHandle].setTitle("Settings");
                this.aForms[iFormHandle].showTitleBar();
                this.aForms[iFormHandle].draw();

                // centered
                this.aForms[iFormHandle].eleHTML.style.position = "fixed";
                this.aForms[iFormHandle].eleHTML.style.zIndex = "100";
                this.aForms[iFormHandle].eleHTML.style.top = "100px";
                this.aForms[iFormHandle].eleHTML.style.left = "100px";

            }
        }


        if (iFound === 0) {
            iFound++;
            iFormHandle = this.aForms.length;

            // do callback
            var param = "";
            param = btoa(JSON.stringify({ idvar: self.sSqlFormCreate, id_form: sIdForm }));
            self.connection1.callHttpRequest(param, function(d) {

                var jsonData = JSON.parse(d);
                var oProperties = null;

                sMode = self.connection1.getValueByColName(jsonData.aRes[0], 0, "mode");
                sComponent = self.connection1.getValueByColName(jsonData.aRes[0], 0, "component");
                sProperties = self.connection1.getValueByColName(jsonData.aRes[0], 0, "sproperties");
                if (sProperties && sProperties !== "") {
                    oProperties = JSON.parse(sProperties);
                }

                if (!isUndefined(nsNessuno[sComponent])) {

                    self.aForms[iFormHandle] = new nsNessuno[sComponent](self.frmMain1.pnlContent1.getName(), self.frmMain1.pnlContent1.getChildName(sComponent + "_" + iFormHandle));

                    self.aForms[iFormHandle].setOwner(self);
                    self.aForms[iFormHandle].setManager(self);

                    self.aForms[iFormHandle].setMode(sMode);
                    self.aForms[iFormHandle].setIdForm(sIdForm);

                    // set properties ...
                    if (self.aForms[iFormHandle].setProperties) {
                        if (oProperties) {
                            self.aForms[iFormHandle].setProperties(oProperties);
                        }
                    }

                    // form params, passing params between forms!
                    if (self.aForms[iFormHandle].setFormParam) {
                        if (oFormParam) {
                            self.aForms[iFormHandle].setFormParam(oFormParam);
                        }
                    }

                    // form referer!
                    if (self.aForms[iFormHandle].setFormReferer) {
                        if (oFormParam) {
                            self.aForms[iFormHandle].setFormReferer(oFormReferer);
                        }
                    }

                    self.aForms[iFormHandle].draw();

                    if (self.frmMain1) {
                        self.frmMain1.showCurrentTransaction(sIdForm);
                    }

                    if(cb) {
                        cb(self.aForms[iFormHandle]); // returns created form pointer
                    }

                } //check defined component
            }); //callback
        }

        //
        postCreateForm(sIdForm);
    }; //createForm

    /**
     * cleanMobile description
     */
    this.cleanMobile = function() {
        try {

            //
            if (this.frmMain1.pnlMenuMobile) {
                this.frmMain1.pnlMenuMobile.hide();
            }

        } catch (err) {
            this.onException(err);
        }
    }; // cleanMobile

    /**
     * action form: CLOSE, HIDE, SHOW, MINIMIZE, MAXIMIZE
     */
    this.actionForm = function(v, sAction) {
        sAction = sAction || "CLOSE";
        var property = null;
        try {
            loopForms: for (property in self.aForms) {
                    if (!isUndefined(self.aForms[property].destroy)) {
                        if (self.aForms[property].getName() === v.getName()) {
                            if (sAction === "CLOSE") {
                                self.aForms[property].destroy();
                                self.aForms[property] = null;
                                self.aForms[property] = undefined;
                                self.aForms.splice(property, 1);
                                // delete self.aForms[property];
                                return 1;
                            } // CLOSE
                        }
                    }
                } // loopForms

                loopProp: for (property in self) {
                    if (self.hasOwnProperty(property)) {
                        if (!isUndefined(self[property].destroy)) {
                            if (self.getChildName(property) === v.getName()) {
                                if (sAction === "CLOSE") {
                                    self[property].destroy();
                                    self[property] = null;
                                    self[property] = undefined;
                                    delete self[property];
                                    return 1;
                                } // CLOSE
                            }
                        }
                    }
                } // loopProp

                return 0;
        }
        catch (err) {
            self.onException(err);
        }
    }; //actionForm

    /**
     * hide all forms!!
     */
    this.hideForms = function() {
        var i = 0;
        for (i = 0; i < this.aForms.length; i++) {
            this.aForms[i].hide();
        }
    }; //hideForms

    /**
     * destroy all forms!!
     */
    this.destroyForms = function() {
        var i = 0;
        for (i = 0; i < this.aForms.length; i++) {
            this.aForms[i].destroy();
        }
        for (i = 0; i < this.aForms.length; i++) {
            self.aForms.splice(i, 1);
        }
        self.aForms = [];
    }; //destroyForms

    /**
     * set a cookie
     */
    this.setCookie = function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }; //setCookie

    /**
     * get a cookie
     */
    this.getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') { c = c.substring(1); }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }; //getCookie

    /**
     * delete a cookie
     */
    this.deleteCookie = function() {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }; //deleteCookie

    /**
     * start
     */
    this.startMain = function(v) {
        v = v || 0;
        //
        this.connection1 = new nsNessuno.oConnection(this.getName(), this.getChildName("connection1"));

        //
        this.theme1 = new nsNessuno.oTheme(this.getName(), this.getChildName("theme1"));

        document.title = "jstest";
        document.body.style.overflow = "hidden";
        // callGetData("", function(a) {
        //     console.log(a);
        //     self.createForm("1");
        // });

        if (document.cookie !== "") {
            self.createForm("0");
        } else {
            self.createForm("-1");
        }
    }; //startMain

    /**
     * get all captions
     */
    this.refreshCaptions = function() {
        // variable name
        // locale
        // idform
        // user

        //FIXME: get all captions in one time, maybe not good
        // packet
        var param = btoa(JSON.stringify({
            idvar: 'CaptionSelect'
        }));

        self.connection1.callHttpRequest(param, function(d) {
            var jsonData = JSON.parse(d);
            self.aCaptions = jsonData.aRes[0];
        }); // call

    }; //refreshCaptions

    /**
     * get caption by params
     */
    this.getCaptionByParams = function(params) {
        var res = "";
        var getIndexByColname = function(sColName) {
            var i = 0;
            var iFound = -1;
            for (i = 0; i < self.aCaptions.aColNames.length; i++) {
                if (self.aCaptions.aColNames[i] === sColName) {
                    iFound = i;
                    break;
                }
            }
            return iFound;
        }; //getIndexByColname

        // get each column index ...
        var iColIdVar = getIndexByColname("idvar");
        var iColCaption = getIndexByColname("caption");
        var iColLocale = getIndexByColname("locale");
        var iColIdForm = getIndexByColname("idform");
        var iColUser = getIndexByColname("user");

        // search by filter
        var j = 0;
        loopRows: for (j = 0; j < self.aCaptions.aRows.length; j++) {
                // found match with idvar
                if (self.aCaptions.aRows[j][iColIdVar] === "var1") {
                    res = self.aCaptions.aRows[j][iColCaption];
                    break;
                }
            } //loopRows

        return res;
    }; //getCaptionByParams

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
     * getNewHandle description
     */
    this.getNewHandle = function() {
        try {
            this.iCountHandle++;
            return this.iCountHandle;
        } catch (err) {
            this.onException(err);
        }
    }; // getNewHandle

    /**
     * return entire window area
     */
    this.getClientRect = function() {
        return [window.innerWidth, window.innerHeight];
    }; //getClientRect

    /**
     * doOpenWindow description
     */
    this.doOpenWindow = function() {
        try {
            window.open(document.location.href);
        } catch (err) {
            this.onException(err);
        }
    }; // doOpenWindow

    /**
     * doLogout description
     */
    this.doLogout = function() {
        try {
            self.deleteCookie();

            self.createForm("-1");
        } catch (err) {
            this.onException(err);
        }
    }; // doLogout

    /**
     * doMainMenu description
     */
    this.doMainMenu = function() {
        try {
            var oActive = null;
            var iChanges = 0;

            oActive = self.getActiveForm();
            if (oActive) {
                if (oActive.getChanges) {
                    iChanges = oActive.getChanges();
                    // check active form has changes...
                    if (iChanges === 1) {
                        if (!confirm("Form has changed, exit without saving?")) {
                            return;
                        }
                    }
                }
            }

            self.destroyForms();
            // self.hideForms();
            self.showMainMenu();
            self.frmMain1.showCurrentTransaction(self.frmMain1.getIdForm());
        } catch (err) {
            this.onException(err);
        }
    }; // doMainMenu

    /**
     * showMainMenu description
     */
    this.showMainMenu = function() {
        try {
            self.frmMain1.pnlContent1a.show();
            self.frmMain1.pnlContent1b.show();
        } catch (err) {
            this.onException(err);
        }
    }; // showMainMenu

    /**
     * hideMainMenu description
     */
    this.hideMainMenu = function() {
        try {
            self.frmMain1.pnlContent1a.hide();
            self.frmMain1.pnlContent1b.hide();
        } catch (err) {
            this.onException(err);
        }
    }; // hideMainMenu

    /**
     * doSave
     */
    this.doSave = function() {
        try {
            var oActive = null;

            oActive = self.getActiveForm();
            if (oActive) {
                if (oActive.saveFun) {
                    oActive.saveFun();
                }
            }

            // self.manager.destroyForms();
            // self.pnlContent1a.show();
            // self.pnlContent1b.show();
        } catch (err) {
            this.onException(err);
        }
    }; //doSave

    /**
     * doSetModeWindow
     */
    this.doSetModeWindow = function(v) {
        try {
            var oActive = null;

            oActive = self.getActiveForm();
            if (oActive) {
                if (oActive.setMode) {
                    oActive.setMode(v);
                }
            }
        } catch (err) {
            this.onException(err);
        }
    }; //doSetModeWindow

    /**
     * doBack
     */
    this.doBack = function() {
        self.doMainMenu();
    }; //doBack

    /**
     * doCancel
     */
    this.doCancel = function() {
        self.doMainMenu();
    }; //doCancel

    /**
     * doDelete
     */
    this.doDelete = function() {
        try {
            var oActive = null;

            oActive = self.getActiveForm();
            if (oActive) {
                if (oActive.deleteFun) {
                    oActive.deleteFun();
                }
            }
        } catch (err) {
            this.onException(err);
        }
    }; //doDelete

    /**
     * doOptions description
     */
    this.doOptions = function() {
        try {
            self.createForm("3", self.EnumFormtype.WINDOWED);
        } catch (err) {
            this.onException(err);
        }
    }; // doOptions

    /**
     * doPrint description
     */
    this.doPrint = function() {
        try {

            var oForm = self.getActiveForm();
            if (oForm && oForm.pnlContent) {

                var data = oForm.pnlContent.eleHTML.innerHTML;
                var sTitle = "print";

                var mywindow = window.open('', sTitle, 'height=400,width=600');
                mywindow.document.write('<html><head><title>' + sTitle + '</title>');
                /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
                mywindow.document.write('</head><body >');
                mywindow.document.write(data);
                mywindow.document.write('</body></html>');

                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10

                mywindow.print();
                mywindow.close();

            }
            return true;
        } catch (err) {
            this.onException(err);
        }
    }; // doPrint

    /**
     * showModalDialog description
     */
    this.showModalDialog = function(sText) {
        try {
            return confirm(sText);
        } catch (err) {
            this.onException(err);
        }
    }; // showModalDialog

    /**
     * getter for ActiveForm
     */
    this.getActiveForm = function() {
        return this.oActiveForm;
    }; // getActiveForm

    /**
     * get new incremented zindex
     */
    this.getNewZIndex = function() {
        this.iIncZIndex++;
        if (this.iIncZIndex > 20) {
            this.iIncZIndex = 3;
        }
        return this.iIncZIndex;
    }; //getNewZIndex

    /**
     * setter for ActiveForm
     */
    this.setActiveForm = function(v) {
        this.oActiveForm = v;

        v.setZIndex(this.getNewZIndex());
    }; // setActiveForm

    /**
     * getter for Forms
     */
    this.getForms = function() {
        return this.aForms;
    }; // getForms

    /**
     * setter for Forms
     */
    this.setForms = function(v) {
        this.aForms = v;
    }; // setForms

    //create
    this.create(sParent, sName);

}; //oManager
