/*
 * oFormSettings
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-29 20:14:17
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oFormSettings = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oFormSettings"; // tag
    this.manager = null;
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";
    this.szIndex = 0;

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

            var selected = null, // Object of the element to be moved
                x_pos = 0,
                y_pos = 0, // Stores x & y coordinates of the mouse pointer
                x_elem = 0,
                y_elem = 0; // Stores top, left values (edge) of the element

            // Will be called when user starts dragging an element
            var _drag_init = function(elem) {
                // Store the object of the element which needs to be moved
                selected = elem.parentNode.parentNode;
                x_elem = x_pos - selected.offsetLeft;
                y_elem = y_pos - selected.offsetTop;
            };

            // Will be called when user dragging an element
            var _move_elem = function(e) {
                x_pos = document.all ? window.event.clientX : e.pageX;
                y_pos = document.all ? window.event.clientY : e.pageY;
                if (selected !== null) {
                    selected.style.left = (x_pos - x_elem) + 'px';
                    selected.style.top = (y_pos - y_elem) + 'px';
                }
            };

            // Destroy the object when we are done
            var _destroy = function() {
                selected = null;
            };

            // Bind the functions...
            var ele = document.getElementById(self.pnlTitleBarLeft.getName());

            ele.onmousedown = function() {
                self.manager.setActiveForm(self);
                _drag_init(this);
                return false;
            };

            ele.onmousemove = _move_elem;
            ele.onmouseup = _destroy;

            // document.onmousemove = _move_elem;
            // document.onmouseup = _destroy;
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
        this.pnlTitleBar.eleHTML.style.borderTopLeftRadius = "5px";
        this.pnlTitleBar.eleHTML.style.borderTopRightRadius = "5px";

        this.pnlTitleBarLeft = new nsNessuno.oPanel(self.pnlTitleBar.getName(), self.getChildName("pnlTitleBarLeft"));
        this.pnlTitleBarLeft.setFloat("left");
        this.pnlTitleBarLeft.setWidth("80%");
        this.pnlTitleBarLeft.eleHTML.innerHTML = "<b>" + this.getTitle() + "</b>";
        this.pnlTitleBarLeft.eleHTML.style.cursor = "move";
        this.pnlTitleBarLeft.eleHTML.style.padding = "5px";

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
        this.txtName1.setBorder(themeCurrent.input_border);

        this.txtLastName1 = new nsNessuno.oInput(this.pnl1a1.getName(), this.pnl1a1.getChildName("txtLastName1"));
        this.txtLastName1.setCaption("Last name");
        this.txtLastName1.setWidth("100%");
        this.txtLastName1.setSizeCaption("30%");
        this.txtLastName1.setSizeInput("70%");
        this.txtLastName1.setColor(themeCurrent.main_color);
        this.txtLastName1.setBorder(themeCurrent.input_border);

        this.txtAddress1 = new nsNessuno.oInput(this.pnl1a1.getName(), this.pnl1a1.getChildName("txtAddress1"));
        this.txtAddress1.setCaption("Address");
        this.txtAddress1.setWidth("100%");
        this.txtAddress1.setSizeCaption("30%");
        this.txtAddress1.setSizeInput("70%");
        this.txtAddress1.setColor(themeCurrent.main_color);
        this.txtAddress1.setBorder(themeCurrent.input_border);

        this.dtFrom1 = new nsNessuno.oDatePicker(this.pnl1a1.getName(), this.pnl1a1.getChildName("dtFrom1"));
        this.dtFrom1.setCaption("Date from");
        this.dtFrom1.setValue("22/02/2016");
        this.dtFrom1.setWidth("100%");
        this.dtFrom1.setSizeCaption("30%");
        this.dtFrom1.setSizeInput("70%");
        this.dtFrom1.setColor(themeCurrent.main_color);
        this.dtFrom1.setBorder(themeCurrent.input_border);

        this.prgBar1 = new nsNessuno.oProgressbar(this.pnl1a1.getName(), this.pnl1a1.getChildName("prgBar1"));
        this.prgBar1.setWidth("100%");
        this.prgBar1.setPercent("20%");
        this.prgBar1.setPercentCalc(23, 1000);

        this.cboTheme1 = new nsNessuno.oCombobox(this.pnl1a1.getName(), this.pnl1a1.getChildName("cboTheme1"));
        this.cboTheme1.setWidth("100%");
        this.cboTheme1.setData([["ThemeSAP","ThemeSAP"]]);

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
        this.btnSave.setEvClick(function() {
            self._owner.actionForm(self, "CLOSE");
            //self.destroy();
        });

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

    /**
     * getter for zIndex
     */
    this.getZIndex = function() {
        return this.szIndex;
    }; // getZIndex

    /**
     * setter for zIndex
     */
    this.setZIndex = function(v) {
        this.szIndex = v;
        this.eleHTML.style.zIndex = this.szIndex;
    }; // setZIndex

    //create
    this.create(sParent, sName);

}; //oFormSettings
