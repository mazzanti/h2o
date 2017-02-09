/*
 * oFormStandard
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:25
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oFormStandard = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oFormStandard"; // tag
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

    this.aHeights = [26, 300, 20];

    this.sMaxHeight = "";
    this.sTitle = "";

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

        //
        this.createHtmlElement();

        //TODO: introduce minheight in panels, manage themes better
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
     * initDragListener description
     */
    this.initDragListener = function() {
        try {
            this.addListeners = function() {
                document.getElementById(self.pnlTitleBar.getName()).addEventListener('mousedown', self.mouseDown, false);
                window.addEventListener('mouseup', self.mouseUp, false);
            };

            this.mouseUp = function() {
                window.removeEventListener('mousemove', self.divMove, true);
            };

            this.mouseDown = function(e) {
                var div = document.getElementById(self.getName());

                window.addEventListener('mousemove', self.divMove, true);
            };

            this.divMove = function(e) {
                var div = document.getElementById(self.getName());

                var x = 0;
                var y = 0;

                x = e.pageX - self.pX;
                y = e.pageY - self.pY;

                x = e.clientX;
                y = e.clientY;

                div.style.position = "absolute";
                div.style.top = y + "px";
                div.style.left = x + "px";

                // div.style.top = (e.clientY) + "px";
                // div.style.left = (e.clientX) + "px";

            };

            this.addListeners();

        } catch (err) {
            this.onException(err);
        }
    }; // initDragListener


    /**
     * show the title bar
     */
    this.showTitleBar = function() {
        //
        this.pnlTitleBar = new nsNessuno.oPanel(self.getName(), self.getChildName("pnlTitleBar"));
        this.pnlTitleBar.setHeight(this.aHeights[0] + "px");
        this.pnlTitleBar.eleHTML.style.background = themeCurrent.titlebar_active;
        this.pnlTitleBar.eleHTML.style.color = "#FFFFFF";

        this.pnlTitleBarLeft = new nsNessuno.oPanel(self.pnlTitleBar.getName(), self.getChildName("pnlTitleBarLeft"));
        this.pnlTitleBarLeft.setFloat("left");
        this.pnlTitleBarLeft.setWidth("80%");
        this.pnlTitleBarLeft.eleHTML.innerHTML = "<b>" + this.getTitle() + "</b>";

        this.pnlTitleBarRight = new nsNessuno.oPanel(self.pnlTitleBar.getName(), self.getChildName("pnlTitleBarRight"));
        this.pnlTitleBarRight.setFloat("left");
        this.pnlTitleBarRight.setWidth("20%");

        this.imgTitleButtons = new nsNessuno.oImg(self.pnlTitleBarRight.getName(), self.getChildName("imgTitleButtons"));
        this.imgTitleButtons.setValue(themeCurrent.titlebar_active_buttons);
        this.imgTitleButtons.setEvClick(function() {
            self._owner.actionForm(self, "CLOSE");
        });

        // init..
        this.initDragListener();
    }; //showTitleBar

    /**
     * show statusbar
     */
    this.showStatusBar = function() {
        this.pnlStatusBar = new nsNessuno.oPanel(self.getName(), self.getChildName("pnlStatusBar"));
        this.pnlStatusBar.setHeight(this.aHeights[2] + "px");
        this.pnlStatusBar.setClear("both");
        this.pnlStatusBar.eleHTML.innerHTML = "READY";
        this.pnlStatusBar.eleHTML.style.background = themeCurrent.status_progress;
        this.pnlStatusBar.eleHTML.style.color = themeCurrent.main_color;
        this.pnlStatusBar.eleHTML.style.borderTop = "1px solid " + themeCurrent.status_progress;
    }; //showStatusBar


    /**
     * draw
     */
    this.draw = function() {
        this.pnlContent = new nsNessuno.oPanel(self.getName(), self.getChildName("pnlContent"));
        this.pnlContent.setMaxHeight(this.getMaxHeight());
        this.pnlContent.setOverflow("auto");
        this.pnlContent.eleHTML.style.background = themeCurrent.main_background;
        this.pnlContent.eleHTML.style.color = themeCurrent.main_color;

        // content...

        // draw
        // this.draw1 = new nsNessuno.oDraw(this.pnlContent.getName(), this.pnlContent.getChildName("draw1"));
        // this.draw1.setHeight("300px");
        // this.draw1.draw();

        this.pnl1a = new nsNessuno.oPanel(self.pnlContent.getName(), self.pnlContent.getChildName("pnl1a1"));
        this.pnl1a.setFloat("left");
        this.pnl1a.setWidth("50%");
        this.pnl1a.setHeight("");
        this.pnl1a.eleHTML.style.boxSizing = "border-box";
        this.pnl1a.eleHTML.style.padding = "2px";

        this.pnl1a1 = new nsNessuno.oPanel(self.pnl1a.getName(), self.pnl1a.getChildName("pnl1a1"));
        this.pnl1a1.setFloat("left");
        this.pnl1a1.setWidth("100%");

        this.txtName1 = new nsNessuno.oInput(this.pnl1a1.getName(), this.pnl1a1.getChildName("txtName1"));
        this.txtName1.setCaption("Name");
        this.txtName1.setWidth("100%");
        this.txtName1.setSizeCaption("30%");
        this.txtName1.setSizeInput("70%");
        this.txtName1.setColor(themeCurrent.main_color);
        this.txtName1.setBackground(themeCurrent.input_background);
        this.txtName1.setBorder(themeCurrent.input_border);

        this.txtLastName1 = new nsNessuno.oInput(this.pnl1a1.getName(), this.pnl1a1.getChildName("txtLastName1"));
        this.txtLastName1.setCaption("Last name");
        this.txtLastName1.setWidth("100%");
        this.txtLastName1.setSizeCaption("30%");
        this.txtLastName1.setSizeInput("70%");
        this.txtLastName1.setColor(themeCurrent.main_color);
        this.txtLastName1.setBackground(themeCurrent.input_background);
        this.txtLastName1.setBorder(themeCurrent.input_border);

        this.txtAddress1 = new nsNessuno.oInput(this.pnl1a1.getName(), this.pnl1a1.getChildName("txtAddress1"));
        this.txtAddress1.setCaption("Address");
        this.txtAddress1.setWidth("100%");
        this.txtAddress1.setSizeCaption("30%");
        this.txtAddress1.setSizeInput("70%");
        this.txtAddress1.setColor(themeCurrent.main_color);
        this.txtAddress1.setBackground(themeCurrent.input_background);
        this.txtAddress1.setBorder(themeCurrent.input_border);

        this.dtFrom1 = new nsNessuno.oDatePicker(this.pnl1a1.getName(), this.pnl1a1.getChildName("dtFrom1"));
        this.dtFrom1.setCaption("Date from");
        this.dtFrom1.setValue("22/02/2016");
        this.dtFrom1.setWidth("100%");
        this.dtFrom1.setSizeCaption("30%");
        this.dtFrom1.setSizeInput("70%");
        this.dtFrom1.setColor(themeCurrent.main_color);
        this.dtFrom1.setBackground(themeCurrent.input_background);
        this.dtFrom1.setBorder(themeCurrent.input_border);

        this.prgBar1 = new nsNessuno.oProgressbar(this.pnl1a1.getName(), this.pnl1a1.getChildName("prgBar1"));
        this.prgBar1.setWidth("100%");
        this.prgBar1.setPercent("20%");
        this.prgBar1.setPercentCalc(23, 1000);

        //
        this.pnl1b = new nsNessuno.oPanel(self.pnlContent.getName(), self.pnlContent.getChildName("pnl1b"));
        this.pnl1b.setFloat("left");
        this.pnl1b.setWidth("50%");
        this.pnl1b.setHeight("");

        this.imgUser1 = new nsNessuno.oImg(this.pnl1b.getName(), this.pnl1b.getChildName("imgUser1"));
        this.imgUser1.setStretch(1);
        this.imgUser1.setValue("userfiles/miura_front1.jpg");
        this.imgUser1.setWidth("160px");
        this.imgUser1.setHeight("100px");

        // --------------------------------------------------
        this.pnlFiles1 = new nsNessuno.oPanel(this.pnl1b, "pnlFiles1"); // shortcut notation mode
        this.upload1 = new nsNessuno.oUpload(this.pnlFiles1.getName(), this.pnlFiles1.getChildName("upload1"));

        this.btnSave = new nsNessuno.oButton(this.pnlContent.getName(), self.pnlContent.getChildName("btnSave"));
        this.btnSave.setCaption("Save");
        this.btnSave.setHeight("24px");
        this.btnSave.setClear("both");

        this.chart1 = new nsNessuno.oChartStacked(this.pnlContent.getName(), this.pnlContent.getChildName("chart1"));
        this.chart1.setClear("both");
        this.chart1.setWidth("600px");
        this.chart1.setHeight("300px");
        // this.chart1.draw();

        // testing...
        var i = 0;
        var jsonData = [{
            sCaption: "Water",
            iValue: 12,
            sColor: "#3791ed"
        }, {
            sCaption: "Food",
            iValue: 12,
            sColor: "orange"
        }, {
            sCaption: "Energy",
            iValue: 12,
            sColor: "red"
        }];

        var iPrgWidth = (document.getElementById(this.sParent).clientWidth / jsonData.length);
        iPrgWidth = getMinMaxPreventOverflow(iPrgWidth, 0, 200);

        var sPrgWidth = iPrgWidth + "px";

        this.aPnl = [];
        this.aPrgBar = [];

        this.pnlContentRadial = new nsNessuno.oPanel(this.pnlContent.getName(), this.pnlContent.getChildName("pnlContentRadial"));
        this.pnlContentRadial.setHeight("200px");
        this.pnlContentRadial.setClear("both");

        loopPanels: for (i = 0; i < jsonData.length; i++) {
                this.aPnl[i] = new nsNessuno.oPanel(this.pnlContentRadial.getName(), this.pnlContentRadial.getChildName("aPnl_" + i));
                this.aPnl[i].setFloat("left");
                this.aPnl[i].setWidth(sPrgWidth);
                this.aPnl[i].setHeight(sPrgWidth);

                this.aPrgBar[i] = new nsNessuno.oRadialProgress(this.aPnl[i].getName(), this.aPnl[i].getChildName("aPrgBar_" + i));
                this.aPrgBar[i].setIntervalRadial(5000);
                this.aPrgBar[i].setValue(jsonData[i].iValue);
                this.aPrgBar[i].setCaption(jsonData[i].sCaption);
                this.aPrgBar[i].setColorProgress(jsonData[i].sColor);
                // this.aPrgBar[i].draw();
            } // loopPanels



        // --------------------------------------------------
        this.pnlGauges1 = new nsNessuno.oPanel(this.pnlContent.getName(), this.pnlContent.getChildName("pnlGauges1"));
        this.pnlGauges1.setMaxHeight("150px");
        // --------------------------------------------------
        this.gauge1 = new nsNessuno.oGauge(this.pnlGauges1.getName(), this.pnlGauges1.getChildName("gauge1"));
        this.gauge1.setWidth("100px");
        this.gauge1.setHeight("100px");
        this.gauge1.setFloat("left");
        this.gauge1.setLabel("CPU");
        this.gauge1.setSize(100);
        this.gauge1.setMin(0);
        this.gauge1.setMax(100);
        this.gauge1.draw();
        this.gauge1.startDemo();
        // --------------------------------------------------
        this.gauge2 = new nsNessuno.oGauge(this.pnlGauges1.getName(), this.pnlGauges1.getChildName("gauge2"));
        this.gauge2.setWidth("100px");
        this.gauge2.setHeight("100px");
        this.gauge2.setFloat("left");
        this.gauge2.setLabel("RAM");
        this.gauge2.setSize(100);
        this.gauge2.setMin(0);
        this.gauge2.setMax(100);
        this.gauge2.draw();
        this.gauge2.startDemo();
        // --------------------------------------------------
        // this.pnlGaugesLiquid1 = new nsNessuno.oPanel(this.pnlContent.getName(), this.pnlContent.getChildName("pnlGaugesLiquid1"));
        this.gaugeLiquid1 = new nsNessuno.oGaugeLiquid(this.pnlGauges1.getName(), this.pnlGauges1.getChildName("gaugeLiquid1"));
        this.gaugeLiquid1.setFloat("left");
        this.gaugeLiquid1.setWidth("100px");
        this.gaugeLiquid1.setHeight("100px");
        this.gaugeLiquid1.setConfigId(2); //0-5
        this.gaugeLiquid1.draw();
        this.gaugeLiquid1.startDemo();

        // google maps
        this.maps1 = new nsNessuno.oGoogleMaps(this.pnlContent.getName(), this.pnlContent.getChildName("maps1"));
        this.maps1.setHeight("200px");
        this.maps1.setLatLng(42.745334, 12.738430);
        this.maps1.setZoom(12);
        this.maps1.draw(function() {
            self.maps1.addMarker();
        });

        // qrcode
        this.qrcode1 = new nsNessuno.oQrCode(this.pnlContent.getName(), this.pnlContent.getChildName("qrcode1"));
        this.qrcode1.setWidth("100px");
        this.qrcode1.setHeight("100px");
        this.qrcode1.setValue("giulio");

        this.separator1 = new nsNessuno.oSeparator(this.pnlContent.getName(), this.pnlContent.getChildName("separator1"));
        this.separator1.setHeight("10px");

        // barcode
        this.barcode1 = new nsNessuno.oBarcode(this.pnlContent.getName(), this.pnlContent.getChildName("barcode1"));
        this.barcode1.setWidth("100px");
        this.barcode1.setHeight("30px");
        this.barcode1.setValue("123");

    }; //draw

    /**
     * set max height
     */
    this.setMaxHeight = function(v) {
        this.sMaxHeight = v;
    }; //setMaxHeight
    /**
     * get max height
     */
    this.getMaxHeight = function() {
        return this.sMaxHeight;
    }; //getMaxHeight

    /**
     * set window title
     */
    this.setTitle = function(v) {
        this.sTitle = v;
    }; //setTitle
    /**
     * get window title
     */
    this.getTitle = function() {
        return this.sTitle;
    }; //getTitle
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

}; //oFormStandard
