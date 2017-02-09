/*
 * oFormLogin
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-17 19:59:52
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oFormLogin = function(sParent, sName) {
    "use strict";

    var self = this;

    this.TAG = "oFormLogin"; // tag
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

        this.createHtmlElement();

        //
        this.eleHTML.style.width = "80%";
        this.eleHTML.style.margin = "auto";
        this.eleHTML.style.boxShadow = "0px 0px 9px rgba(0, 0, 0, 0.15)";

        this.pnlHead = new nsNessuno.oPanel(this.getName(), this.getChildName("pnlHead"));
        this.pnlHead.setClear("both");

        this.pnlHeadLeft = new nsNessuno.oPanel(this.pnlHead.getName(), this.pnlHead.getChildName("pnlHeadLeft"));
        this.pnlHeadLeft.setFloat("left");
        this.pnlHeadLeft.setWidth("50%");
        //
        this.imgLogo1 = new nsNessuno.oImg(this.pnlHeadLeft.getName(), this.pnlHeadLeft.getChildName("imgLogo1"));
        this.imgLogo1.setWidth("226px");
        this.imgLogo1.setHeight("131px");
        this.imgLogo1.setStretch(1);
        this.imgLogo1.setValue("base/images/logo.png");
        //
        this.imgOsLogos1 = new nsNessuno.oImg(this.pnlHeadLeft.getName(), this.pnlHeadLeft.getChildName("imgOsLogos1"));
        this.imgOsLogos1.setWidth("auto");
        this.imgOsLogos1.setHeight("31px");
        this.imgOsLogos1.setStretch(1);
        this.imgOsLogos1.setValue("base/images/oslogos.png");

        this.pnlHeadRight = new nsNessuno.oPanel(this.pnlHead.getName(), this.pnlHead.getChildName("pnlHeadRight"));
        this.pnlHeadRight.setFloat("left");
        this.pnlHeadRight.setWidth("50%");
        //
        this.grid1 = new nsNessuno.oGrid(this.pnlHeadRight.getName(), this.pnlHeadRight.getChildName("grid1"));
        this.grid1.setMulti(0);
        this.grid1.setShowColHeadings(1);
        this.grid1.setShowRowHeadings(0);
        this.grid1.setColNames(["description", "connection"]);
        this.grid1.setData([
            ["127.0.0.1 Locale", "host=127.0.0.1&schema=jstest"],
            ["127.0.0.1 Dev", "host=127.0.0.1&schema=jstestDev"],
            ["127.0.0.1 Gateway", "host=127.0.0.1&schema=jstestGateway"]
        ]);

        //
        this.lblTitle1 = new nsNessuno.oLabel(this.getName(), this.getChildName("lblTitle1"));
        this.lblTitle1.setCaption("Login to jstest: a Giulio Mazzanti creation");

        //
        this.txtUsername = new nsNessuno.oInput(this.getName(), this.getChildName("txtUsername"));
        this.txtUsername.setCaption("username");
        // this.txtUsername.setValue("user");
        this.txtUsername.setPlaceholder("your username");
        // this.txtUsername.setBackground(themeCurrent.input_background);
        this.txtUsername.setBorder(themeCurrent.input_border);

        //
        this.txtPasswd = new nsNessuno.oInput(this.getName(), this.getChildName("txtPasswd"));
        this.txtPasswd.setCaption("password");
        // this.txtPasswd.setValue("pass");
        this.txtPasswd.setType("password");
        this.txtPasswd.setPlaceholder("your password");
        // this.txtPasswd.setBackground(themeCurrent.input_background);
        this.txtPasswd.setBorder(themeCurrent.input_border);

        //
        this.cboLanguage = new nsNessuno.oCombobox(this.getName(), this.getChildName("cboLanguage"));
        this.cboLanguage.setData([
            ["en_EN", "EN"],
            ["it_IT", "IT"],
            ["de_DE", "DE"],
            ["fr_FR", "FR"]
        ]);
        this.cboLanguage.setValue("it_IT");
        this.cboLanguage.setHeight("30px");
        // $( "#"+this.cboLanguage.getName() ).combobox();

        //
        this.btnLogin1 = new nsNessuno.oButton(this.getName(), this.getChildName("btnLogin1"));
        this.btnLogin1.setCaption("Login");
        this.btnLogin1.setHeight("30px");
        this.btnLogin1.setEvClick(function(e) {
            // console.log(e, "clic!");
            self._owner.createForm("0");
        });
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
        this.eleHTML.style.width = this.sWidth;
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
        this.eleHTML.style.height = this.sHeight;
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
            node.style.width = this.sWidth;
            node.style.height = this.sHeight;

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
     * show
     */
    this.show = function() {
        this.eleHTML.style.display = "";
    }; //show
    /**
     * hide
     */
    this.hide = function() {
        this.eleHTML.style.display = "none";
    }; //hide
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

}; //oFormLogin
