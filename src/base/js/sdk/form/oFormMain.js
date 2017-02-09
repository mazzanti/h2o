/*
 * oFormMain
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:25
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oFormMain = function(sParent, sName) {
    "use strict";

    var self = this;

    this.TAG = "oFormMain"; // tag
    this.manager = null;
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";

    this.sIdForm = "MAIN";
    this.aData = [];
    this.aFields = [];

    this.iCountIncludes = 0;
    this.aIncludes = [];

    this.aHeights = [30, 26, 500, 20];

    this.tmrUpdateClock = null;
    this.sClockContainer = "";

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
     * show messages in status bar...
     */
    this.showMessage = function(v) {
        var j = 0;
        var i = 0;
        var sMessage = "";
        var sImage = "";
        var sIcon = "";

        var doIt = function(obj, idx) {
            sMessage = self.getValueByColName(obj, idx, "sMessage");
            if (!isEmpty(sMessage)) {
                sImage = self.getValueByColName(obj, idx, "icon");
                sIcon = "<img src=\"base/images/icon/" + (sImage) + "\" style=\"height: 10px; width: auto;vertical-align:middle;\" />";

                self.lblStatusMessage.setCaption(((!isEmpty(sImage)) ? sIcon : "") + sMessage);
            }
        };

        if (v.aRes[1]) {
            if (v.aRes[1].aRows) {
                for (i = 0; i < v.aRes[1].aRows.length; i++) {
                    doIt(v.aRes[1], i);
                }
            }
        } else {
            for (j = 0; j < v.aRes.length; j++) {
                if (v.aRes[j].aRows) {
                    for (i = 0; i < v.aRes[j].aRows.length; i++) {
                        doIt(v.aRes[j], i);
                    }
                }
            }
        }
    }; //showMessage

    /**
     * showTransaction description
     */
    this.showCurrentTransaction = function(v) {
        try {
            self.lblUsername.setCaption("TRANSACTION: " + v);
        } catch (err) {
            this.onException(err);
        }
    }; // showTransaction

    /**
     * standard get value by col name
     */
    this.getValueByColName = function(obj, irow, sColName) {
        var i = 0;
        var iFound = -1;
        if (obj.aRows[irow]) {
            for (i = 0; i < obj.aColNames.length; i++) {
                if (obj.aColNames[i] === sColName) {
                    iFound = i;
                    break;
                }
            }

            if (iFound > -1) {
                return obj.aRows[irow][iFound];
            }
        }
        return "";
    }; //getValueByColName

    /**
     * draw description
     */
    this.draw = function() {
        try {
            var param = null;

            //
            this.pnlHeader1 = new nsNessuno.oPanel(this.getName(), this.getChildName("pnlHeader1"));
            // this.pnlHeader1.setBorder("1px solid #000000");
            this.pnlHeader1.setHeight(this.aHeights[0] + "px");
            this.pnlHeader1.eleHTML.style.background = themeCurrent.maintitlebar;
            this.pnlHeader1.eleHTML.style.overflow = "";

            //
            this.pnlHeader1a = new nsNessuno.oPanel(this.pnlHeader1.getName(), this.pnlHeader1.getChildName("pnlHeader1a"));
            this.pnlHeader1a.setWidth("80%");
            this.pnlHeader1a.setFloat("left");
            this.pnlHeader1a.eleHTML.style.overflow = "";

            this.mnuMainMenu1 = new nsNessuno.oMainMenu(this.pnlHeader1a.getName(), this.pnlHeader1a.getChildName("mnuMainMenu1"));
            this.mnuMainMenu1.setManager(self.manager);
            this.mnuMainMenu1.draw();

            //
            this.pnlHeader1b = new nsNessuno.oPanel(this.pnlHeader1.getName(), this.pnlHeader1.getChildName("pnlHeader1b"));
            this.pnlHeader1b.setWidth("20%");
            this.pnlHeader1b.setFloat("left");

            //
            this.pnlToolbar1 = new nsNessuno.oPanel(this.getName(), this.getChildName("pnlToolbar1"));
            this.pnlToolbar1.setBorder("1px solid " + themeCurrent.grid_head_border);
            this.pnlToolbar1.setHeight(this.aHeights[1] + "px");


            this.pnlToolbar1b = new nsNessuno.oPanel(this.pnlToolbar1.getName(), this.pnlToolbar1.getChildName("pnlToolbar1b"));
            this.pnlToolbar1b.setWidth("100%");
            this.pnlToolbar1b.setFloat("left");

            this.tlbMain1 = new nsNessuno.oToolbar(this.pnlToolbar1b.getName(), this.pnlToolbar1b.getChildName("tlbMain1"));
            this.tlbMain1.eleHTML.style.backgroundRepeat = "no-repeat";
            // packet
            param = btoa(JSON.stringify({ idvar: 'FormMainToolbarFill' }));
            self.manager.connection1.callHttpRequest(param, function(d) {
                var j;
                var jsonData = JSON.parse(d);
                var iSequence = "";
                var sImage = "";
                var sAction = "";
                var sText = "";
                var fun = null;

                if (!jsonData.aRes) {
                    return;
                }
                jsonData = jsonData.aRes[0];

                for (j = 0; j < jsonData.aRows.length; j++) {
                    fun = null;
                    iSequence = self.getValueByColName(jsonData, j, "iSequence");
                    sAction = self.getValueByColName(jsonData, j, "sAction");
                    sImage = self.getValueByColName(jsonData, j, "sImage");
                    sText = self.getValueByColName(jsonData, j, "sText");

                    // exec action on manager
                    if (!isEmpty(sAction)) {

                        if (self.manager[sAction]) {
                            fun = self.manager[sAction];
                        }
                    }

                    if (sImage === "#transaction#") {
                        self.txtTransaction1 = new nsNessuno.oInputAutocomplete(self.tlbMain1.getName(), self.tlbMain1.getChildName("txtTransaction1"));
                        self.txtTransaction1.setCaption(sText);
                        self.txtTransaction1.setFloat("left");
                        self.txtTransaction1.setWidth("180px");
                        self.txtTransaction1.setEvChange(function() {
                            var sIdForm = self.txtTransaction1.getValue();
                            var rs = self.grid1.find(sIdForm);
                            if (rs) {
                                self._owner.createForm(rs[0][0]);
                                // self._owner.createForm(rs[0][0], rs[0][3], rs[0][2], rs[0][4], rs[0][5], rs[0][6], rs[0][7]);
                            }

                        });
                    } else if (sImage === "#separator#") {
                        self.tlbMain1.addSeparator();
                    } else {
                        self.tlbMain1.addButton(sImage, fun, sText);
                    }
                }

            });



            // is mobile
            if (isMobile()) {
                // mobile menu
                this.drawMenuMobile();
                this.mnuMainMenu1.eleHTML.style.display = "none";

                //
                self.pnlHeader1.eleHTML.addEventListener("click", function(ev) {
                    self.pnlMenuMobile.show();
                });
            }

            //
            this.pnlContent1 = new nsNessuno.oPanel(this.getName(), this.getChildName("pnlContent1"));
            this.pnlContent1.setHeight(this.aHeights[2] + "px");

            this.pnlContent1a = new nsNessuno.oPanel(this.pnlContent1.getName(), this.pnlContent1.getChildName("pnlContent1a"));
            this.pnlContent1a.setWidth(!isMobile() ? "30%":"100%");
            // this.pnlContent1a.setWidth("30%");
            this.pnlContent1a.setFloat("left");
            this.pnlContent1a.eleHTML.style.borderRight = "1px solid " + themeCurrent.grid_head_border;

            this.grid1 = new nsNessuno.oGrid(this.pnlContent1a.getName(), this.pnlContent1a.getChildName("grid1"));
            this.grid1.setHeight("100%");
            this.grid1.setMaxCol(2);
            this.grid1.setMulti(0);
            this.grid1.setColNames(["CODE", "DESCRIPTION", "COMPONENT", "MODE", "SQLFILL", "SQLSELECT", "SQLINSERT", "SQLUPDATE", "SQLDELETE"]);

            // packet
            param = btoa(JSON.stringify({ idvar: 'FormMainFill' }));
            self.manager.connection1.callHttpRequest(param, function(d) {
                var j;
                var aTmp = []; // for full data
                var aTmp2 = []; // for only autocomplete
                var jsonData = JSON.parse(d);

                // show message
                self.showMessage(jsonData);

                if (!jsonData.aRes) {
                    return;
                }
                jsonData = jsonData.aRes[0];

                for (j = 0; j < jsonData.aRows.length; j++) {
                    aTmp.push([self.getValueByColName(jsonData, j, "id_form"),
                        self.getValueByColName(jsonData, j, "title"),
                        self.getValueByColName(jsonData, j, "component"),
                        self.getValueByColName(jsonData, j, "mode"),
                        self.getValueByColName(jsonData, j, "sqlfill"), //TODO: togliere da qui
                        self.getValueByColName(jsonData, j, "sqlselect"),
                        self.getValueByColName(jsonData, j, "sqlinsert"),
                        self.getValueByColName(jsonData, j, "sqlupdate"),
                        self.getValueByColName(jsonData, j, "sqldelete")
                    ]);

                    aTmp2.push(self.getValueByColName(jsonData, j, "id_form"));
                }
                self.grid1.setEvRowClickCb(function(p) {
                    if (aTmp[p]) {
                        //TODO: optimize
                        self._owner.createForm(aTmp[p][0]);
                        // self._owner.createForm(aTmp[p][0], aTmp[p][3], aTmp[p][2], aTmp[p][4], aTmp[p][5], aTmp[p][6], aTmp[p][7]);
                    }
                });

                self.grid1.setData(aTmp);

                //autocomplete
                if (self.tlbMain1.txtTransaction1) {
                    self.tlbMain1.txtTransaction1.setDataAutocomplete(aTmp2);
                }
                //
                if (self.txtTransaction1) {
                    self.txtTransaction1.setDataAutocomplete(aTmp2);
                }

                if (self.txtTransactionMobile1) {
                    self.txtTransactionMobile1.setDataAutocomplete(aTmp2);
                }
            });

            this.pnlContent1b = new nsNessuno.oPanel(this.pnlContent1.getName(), this.pnlContent1.getChildName("pnlContent1b"));
            this.pnlContent1b.setWidth("70%");
            this.pnlContent1b.eleHTML.style.background = "url('base/images/background.jpg')";
            this.pnlContent1b.eleHTML.style.backgroundSize = "100% 100%";

            //
            this.pnlFooter1 = new nsNessuno.oPanel(this.getName(), this.getChildName("pnlFooter1"));
            this.pnlFooter1.setClear("both");
            this.pnlFooter1.setBorder("1px solid " + themeCurrent.grid_head_border);
            this.pnlFooter1.setHeight(this.aHeights[3] + "px");
            this.pnlFooter1.eleHTML.style.background = themeCurrent.main_background;

            this.pnlFooter1a = new nsNessuno.oPanel(this.pnlFooter1.getName(), this.pnlFooter1.getChildName("pnlFooter1a"));
            this.pnlFooter1a.setWidth("50%");
            this.pnlFooter1a.setFloat("left");

            this.lblStatusMessage = new nsNessuno.oLabel(this.pnlFooter1a.getName(), this.pnlFooter1a.getChildName("lblStatusMessage"));

            this.pnlFooter1b = new nsNessuno.oPanel(this.pnlFooter1.getName(), this.pnlFooter1.getChildName("pnlFooter1b"));
            this.pnlFooter1b.setWidth("50%");
            this.pnlFooter1b.setFloat("left");
            this.pnlFooter1b.eleHTML.style.textAlign = "right";

            this.lblUsername = new nsNessuno.oLabel(this.pnlFooter1b.getName(), this.pnlFooter1b.getChildName("lblUsername"));
            this.lblUsername.setCaption("&nbsp;");
            this.lblUsername.setFloat("left");
            this.lblUsername.setWidth("50%");

            this.lblClock1 = new nsNessuno.oLabel(this.pnlFooter1b.getName(), this.pnlFooter1b.getChildName("lblClock1"));
            this.lblClock1.setCaption("00:00:00");
            this.lblClock1.setFloat("left");
            this.lblClock1.setWidth("50%");
            this.sClockContainer = this.lblClock1.getName();
            this.updateClock();

            this.showCurrentTransaction(this.sIdForm);

            // responsive
            this.processResponsive();
            this.tmrIntervalResponsive = setInterval(this.processResponsive, 1000);
        } catch (err) {
            this.onException(err);
        }
    }; // draw

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
                    if ((property !== "_owner") && (property !== "manager")) {
                        if (property.startsWith("tmr")) {
                            // by convention tmr is timer or
                            clearInterval(this[property]);
                            clearTimeout(this[property]);
                            continue;
                        }
                        if (property.startsWith("hResize")) {
                            // by convention h is handle
                            window.removeEventListener('resize');
                            continue;
                        }

                        if (!isNull(this[property]) && !isUndefined(this[property].destroy)) {
                            this[property].destroy();
                            this[property] = null;
                            this[property] = undefined;
                            delete this[property];
                        }

                    }
                }
            }

            //
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
     * update the clock
     */
    this.updateClock = function() {
        // call this function again in 1000ms
        self.tmrUpdateClock = setTimeout(self.updateClock, 1000);

        var now = new Date(); // current date
        var time = padZeros(now.getHours()) + ':' + padZeros(now.getMinutes()) + ':' + padZeros(now.getSeconds()), // again, you get the idea
            // a cleaner way than string concatenation
            date = [padZeros(now.getDate()), padZeros(now.getMonth()), padZeros(now.getFullYear())].join('/');

        // set the content of the element with the ID time to the formatted string
        var ele = document.getElementById(self.sClockContainer);
        if (!isNull(ele)) {
            ele.innerHTML = [date, time].join(' - ');
        }
    }; //updateClock

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
     * process responsive
     */
    this.processResponsive = function() {
        // responsive...
        var iTmp = window.innerHeight - self.pnlHeader1.getHeightPx() - self.pnlToolbar1.getHeightPx() - self.pnlFooter1.getHeightPx();
        self.pnlContent1.setHeight(iTmp + "px");
    }; //processResponsive

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

    /**
     * getter for IdForm
     */
    this.getIdForm = function() {
        return this.sIdForm;
    }; // getIdForm

    /**
     * setter for IdForm
     */
    this.setIdForm = function(v) {
        this.sIdForm = v;
    }; // setIdForm

    /**
     * drawMenuMobile description
     */
    this.drawMenuMobile = function() {
        try {
            self.pnlMenuMobile = new nsNessuno.oPanel(self.getName(), self.getChildName("pnlMenuMobile"));
            self.pnlMenuMobile.hide();
            self.pnlMenuMobile.eleHTML.style.background = themeCurrent.main_background;
            self.pnlMenuMobile.eleHTML.style.position = "absolute";
            self.pnlMenuMobile.eleHTML.style.overflow = "auto";
            self.pnlMenuMobile.eleHTML.style.width = "100%";
            self.pnlMenuMobile.eleHTML.style.zIndex = "1";
            self.pnlMenuMobile.eleHTML.style.top = "0px";

            // self.separator1 = new nsNessuno.oSeparator(self.pnlMenuMobile.getName(), self.pnlMenuMobile.getChildName("separator1"));
            // self.separator1.setHeight("20px");


            this.tlbMainMobile1 = new nsNessuno.oToolbar(this.pnlMenuMobile.getName(), this.pnlMenuMobile.getChildName("tlbMainMobile1"));
            this.tlbMainMobile1.eleHTML.style.backgroundRepeat = "no-repeat";
            this.tlbMainMobile1.setBtnShowCaption("1");
            this.tlbMainMobile1.setBtnMargin("10px");
            this.tlbMainMobile1.setBtnClear("both");
            this.tlbMainMobile1.setBtnFloat("");

            //
            self.imgMenuMobileIcon1 = new nsNessuno.oImg(self.pnlHeader1a.getName(), self.pnlHeader1a.getChildName("imgMenuMobileIcon1"));
            self.imgMenuMobileIcon1.setValue("base/images/menu_mobile.png");
            self.imgMenuMobileIcon1.setWidth("24px");
            self.imgMenuMobileIcon1.setHeight("24px");
            this.imgMenuMobileIcon1.setStretch(1);
            self.imgMenuMobileIcon1.eleHTML.addEventListener("click", function() { self.pnlMenuMobile.show(); });

                        //
            self.imgMenuMobileIcon2 = new nsNessuno.oImg(self.tlbMainMobile1.getName(), self.tlbMainMobile1.getChildName("imgMenuMobileIcon2"));
            self.imgMenuMobileIcon2.setValue("base/images/menu_mobile.png");
            self.imgMenuMobileIcon2.setWidth("24px");
            self.imgMenuMobileIcon2.setHeight("24px");
            this.imgMenuMobileIcon2.setStretch(1);
            self.imgMenuMobileIcon2.eleHTML.addEventListener("click", function() { self.pnlMenuMobile.hide(); });

            // packet
            var param = btoa(JSON.stringify({ idvar: 'FormMainToolbarFill' }));
            self.manager.connection1.callHttpRequest(param, function(d) {
                var j;
                var jsonData = JSON.parse(d);
                var iSequence = "";
                var sImage = "";
                var sAction = "";
                var sText = "";
                var fun = null;

                if (!jsonData.aRes) {
                    return;
                }
                jsonData = jsonData.aRes[0];

                for (j = 0; j < jsonData.aRows.length; j++) {
                    fun = null;
                    iSequence = self.getValueByColName(jsonData, j, "iSequence");
                    sAction = self.getValueByColName(jsonData, j, "sAction");
                    sImage = self.getValueByColName(jsonData, j, "sImage");
                    sText = self.getValueByColName(jsonData, j, "sText");

                    // exec action on manager
                    if (!isEmpty(sAction)) {
                        if (self.manager[sAction]) {
                            fun = self.manager[sAction];
                        }
                    }

                    if (sImage === "#transaction#") {
                        self.txtTransactionMobile1 = new nsNessuno.oInputAutocomplete(self.tlbMainMobile1.getName(), self.tlbMainMobile1.getChildName("txtTransactionMobile1"));
                        self.txtTransactionMobile1.setSizeCaption("100%");
                        self.txtTransactionMobile1.setSizeInput("100%");
                        self.txtTransactionMobile1.setCaption(sText);
                        // self.txtTransactionMobile1.setFloat("left");
                        self.txtTransactionMobile1.setWidth("100%");
                        self.txtTransactionMobile1.setEvChange(function() {
                            var sIdForm = self.txtTransactionMobile1.getValue();
                            var rs = self.grid1.find(sIdForm);
                            if (rs) {
                                //TODO: optimize
                                self._owner.createForm(rs[0][0], rs[0][3], rs[0][2], rs[0][4], rs[0][5], rs[0][6], rs[0][7]);

                                self.pnlMenuMobile.hide();
                            }

                        });
                    } else if (sImage === "#separator#") {
                        self.tlbMainMobile1.addSeparator();
                    } else {
                        self.tlbMainMobile1.addButton(sImage, fun, sText);
                    }
                }

            }); //call

        } catch (err) {
            this.onException(err);
        }
    }; // drawMenuMobile


    //create
    this.create(sParent, sName);

}; //oFormMain
