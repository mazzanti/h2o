/*
 * oFormDesigner
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 16:30:36
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oFormDesigner = function(sParent, sName) {
    "use strict";

    var self = this;

    this.TAG = "oFormDesigner"; // tag
    this.manager = null;
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";

    this.sMinWidth = "900px";
    this.sMinHeight = "500px";

    this.aData = [];
    this.aFields = [];

    this.iCountIncludes = 0;
    this.aIncludes = [];

    this.aHeights = [26, 300, 20];

    this.sMaxWidth = "";
    this.sMaxHeight = "";
    this.sIdForm = "";
    this.sTitle = "";
    this.sMode = "";
    this.szIndex = "";

    this.oProperties = null;

    this.sIdFormDesigner = "";
    this.sDesignItemPrefix = "designitem_";
    this.sDesignItemCurrent = null;
    this.iFloatingBox = 0;

    this.sBoxToolboxLeft = "2px";
    this.sBoxToolboxTop = "100px";
    this.sBoxObjectExplorerLeft = "2px";
    this.sBoxObjectExplorerTop = "420px";

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
     * saveFun description
     */
    this.saveFun = function() {
        try {
            self.deleteFun(self._saveFun, true);
        } catch (err) {
            this.onException(err);
        }
    }; // saveFun

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
                        if (!isUndefined(this[property]) &&
                            !isNull(this[property]) &&
                            !isUndefined(this[property].destroy)) {
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
     * set max Width
     */
    this.setMaxWidth = function(v) {
        this.sMaxWidth = v;
    }; //setMaxWidth

    /**
     * get max Width
     */
    this.getMaxWidth = function() {
        return this.sMaxWidth;
    }; //getMaxWidth

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

        if (this.sMode === this.manager.EnumFormtype.MAIN_CONTENT) {
            // MAIN_CONTENT

            //
            self.manager.hideMainMenu();
        } else {
            // POPUP

            self.setWidth("");
            self.setHeight("");

            self.eleHTML.style.position = "absolute";
            self.eleHTML.style.zIndex = "100";
            self.eleHTML.style.top = "100px";
            self.eleHTML.style.left = "100px";
            self.eleHTML.style.resize = "both";
            self.eleHTML.style.overflow = "auto";
            // self.eleHTML.style.margin = "-" + (self.eleHTML.clientHeight / 2) + "px 0 0 -" + (self.eleHTML.clientWidth / 2) + "px";

            // is windowed
            if (this.getMode() === this.manager.EnumFormtype.WINDOWED) {
                this.setWidth(this.sMinWidth);
                this.setHeight(this.sMinHeight);
            } // check windowed
        }
    }; // setMode

    /**
     * build the title bar
     */
    this.buildTitleBar = function() {
        //
        this.pnlTitleBar = new nsNessuno.oPanel(self.getName(), self.getChildName("pnlTitleBar"));
        this.pnlTitleBar.setHeight(this.aHeights[0] + "px");
        this.pnlTitleBar.eleHTML.style.background = themeCurrent.titlebar_active;
        this.pnlTitleBar.eleHTML.style.color = "#FFFFFF";
        this.pnlTitleBar.eleHTML.style.borderTopLeftRadius = "5px";
        this.pnlTitleBar.eleHTML.style.borderTopRightRadius = "5px";

        // mode?
        if (this.getMode() === this.manager.EnumFormtype.MAIN_CONTENT) {
            this.hideTitleBar();
        } //

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
    }; //buildTitleBar

    /**
     * hide the titlebar
     */
    this.hideTitleBar = function() {
        this.pnlTitleBar.eleHTML.style.display = "none";
    }; //hideTitleBar

    /**
     * show the titlebar
     */
    this.showTitleBar = function() {
        this.pnlTitleBar.eleHTML.style.display = "";
    }; //showTitleBar

    /**
     * get new handle
     */
    this.getNewHandle = function() {
        return self.sDesignItemPrefix + Object.keys(self.pnlContentDesigner).length;
    }; //getNewHandle

    /**
     * loadForm description
     */
    this.loadForm = function(sIdForm) {
        try {
            var param = btoa(JSON.stringify({ idvar: 'FormGenericFill', id_form: sIdForm }));
            this.manager.connection1.callHttpRequest(param, function(d) {
                var jsonData = JSON.parse(d);
                if (!jsonData.aRes) {
                    return;
                }
                // show message
                self.manager.frmMain1.showMessage(jsonData);

                var parserForm1 = new nsNessuno.oParserForm(self.pnlContent.getName(), self.pnlContent.getChildName("parserForm1"));
                parserForm1.build(jsonData.aRes[0], self.pnlContentDesigner);

                // update the combo
                self.updateCboDesignerItem();
            });
        } catch (err) {
            this.onException(err);
        }
    }; // loadForm

    /**
     * save default save function
     */
    this._saveFun = function() {
        try {
            var i = 0;
            var tTag = "";
            var tName = "";
            var tSequence = "";
            var tProperties;

            for (var property in self.pnlContentDesigner) {
                if (self.pnlContentDesigner.hasOwnProperty(property)) {
                    if (!self.pnlContentDesigner[property]) {
                        continue;
                    }

                    if (!isUndefined(self.pnlContentDesigner[property].TAG)) {

                        tTag = self.pnlContentDesigner[property].TAG;
                        tName = self.pnlContentDesigner[property].getName();
                        tName = tName.replace(self.pnlContentDesigner[property].getParent() + "_", "");
                        tSequence = self.pnlContentDesigner[property].getSequence();
                        tProperties = {};
                        if (self.pnlContentDesigner[property]) {
                            if (self.pnlContentDesigner[property].getProperties) {
                                tProperties = self.pnlContentDesigner[property].getProperties();
                            }
                        }
                        // packet
                        var param = btoa(JSON.stringify({
                            idvar: 'FormDesignerInsert',
                            id_form: self.getIdFormDesigner(),
                            id_parent: '0',
                            isequence: tSequence, //i
                            stype: tTag,
                            sname: tName,
                            sproperties: JSON.stringify(tProperties)
                        }));
                        // console.log(JSON.parse(atob(param)));
                        self.manager.connection1.callHttpRequest(param, function(d) {
                            var jsonData = JSON.parse(d);
                            // show message
                            self.manager.frmMain1.showMessage(jsonData);
                        });
                        i++;
                    }
                }
            }
        } catch (err) {
            this.onException(err);
        }
    }; // saveFun

    /**
     * loadFun description
     */
    this.loadFun = function() {
        try {
            self.clearDesignerItems();
            self.setIdFormDesigner(self.cboFormName.getValue());
            self.loadForm(self.sIdFormDesigner);
            // self.loadForm(self.txtFormName.getValue());
        } catch (err) {
            this.onException(err);
        }
    }; // loadFun

    /**
     * deleteFun description
     */
    this.deleteFun = function(cb, force) {
        try {
            force = force || false;
            if (force || self.manager.showModalDialog("Delete?")) {
                cb = cb || null;
                //packet
                var param = btoa(JSON.stringify({
                    idvar: 'FormDesignerDelete',
                    id_form: self.getIdFormDesigner(),
                }));
                self.manager.connection1.callHttpRequest(param, function(d) {
                    var jsonData = JSON.parse(d);

                    if (cb) {
                        cb();
                    }
                });
            }
        } catch (err) {
            this.onException(err);
        }
    }; // deleteFun

    /**
     * add designer item event
     */
    this.addDesignerItemEvent = function(i) {
        self.pnlContentDesigner[i].eleHTML.addEventListener("click", function() {
            var sName = self.pnlContentDesigner[i].getName();
            sName = sName.replace(self.pnlContentDesigner[i].getParent() + "_", "");
            self.setDesignItemCurrent(sName);
        });
    }; //addDesignerItemEvent

    /**
     * getter for DesignItemCurrent
     */
    this.getDesignItemCurrent = function() {
        return this.sDesignItemCurrent;
    }; // getDesignItemCurrent

    /**
     * setter for DesignItemCurrent
     */
    this.setDesignItemCurrent = function(v) {
        this.sDesignItemCurrent = v;

        self.cboDesignerItem.setValue(this.sDesignItemCurrent);
        self.drawObjectInspector();
    }; // setDesignItemCurrent

    /**
     * getter for FloatingBox
     */
    this.getFloatingBox = function() {
        this.iFloatingBox = castInt(this.iFloatingBox);
        return this.iFloatingBox;
    }; // getFloatingBox

    /**
     * setter for FloatingBox
     */
    this.setFloatingBox = function(v) {
        v = castInt(v);
        this.iFloatingBox = v;
    }; // setFloatingBox

    /**
     * drawToolbox description
     */
    this.drawToolbox = function() {
        try {
            if (this.getFloatingBox() === 1) {
                // transform panel in floating tool window
                this.drawPanelTitle(this.pnlContent1a, {
                    sCaption: "Toolbox",
                    sLeft: self.sBoxToolboxLeft,
                    sTop: self.sBoxToolboxTop,
                    sWidth: "250px"
                });
            }

            var myDragStart = function(e) {
                e.dataTransfer.setData("text", e.target.dataset.value);
                e.dataTransfer.effectAllowed = 'copy';

                var icon = document.createElement('div');
                // icon.src = e.target.dataset.icon;
                icon.style.width = "30px";
                icon.style.height = "30px";
                icon.style.background = "#FF0000";

                e.dataTransfer.setDragImage(icon, -10, -10);
            };

            //
            var sToolbarBtnWidth = "100%";
            var sToolbarBtnHeight = "20px";

            this.pnlToolBox = new nsNessuno.oPanel(this.pnlContent1a.getName(), this.pnlContent1a.getChildName("pnlToolBox"));
            this.pnlToolBox.setHeight("100%");
            this.pnlToolBox.setOverflow("auto");
            this.pnlToolBox.setHeight((this.pnlContent1a.eleHTML.clientHeight - 26) + "px");

            //
            nsNessuno.oToolboxItem._idForm = self;

            for (var property in nsNessuno.oToolboxItem) {
                if (nsNessuno.oToolboxItem.hasOwnProperty(property)) {
                    if (property === "_idForm") {
                        continue;
                    }

                    this["btnToolbox_" + property] = new nsNessuno.oButton(this.pnlToolBox.getName(), this.pnlToolBox.getChildName("btnToolbox_" + property));
                    this["btnToolbox_" + property].setCaption(property);
                    this["btnToolbox_" + property].setHeight(sToolbarBtnHeight);
                    this["btnToolbox_" + property].setWidth(sToolbarBtnWidth);
                    this["btnToolbox_" + property].setFloat("left");
                    this["btnToolbox_" + property].setEvClick(nsNessuno.oToolboxItem[property]);
                    this["btnToolbox_" + property].eleHTML.addEventListener("dragstart", myDragStart);
                    this["btnToolbox_" + property].eleHTML.setAttribute("data-value", property);
                    this["btnToolbox_" + property].eleHTML.setAttribute("draggable", "true");

                    this["btnToolbox_" + property].setIcon("base/images/toolbox/oInput.png");
                    this["btnToolbox_" + property].setBorder("1px solid #DDDDDD");
                    this["btnToolbox_" + property].setBackground("#FFFFFF");
                    this["btnToolbox_" + property].setTextAlign("left");
                }
            }
        } catch (err) {
            this.onException(err);
        }
    }; // drawToolbox


    /**
     * object inspector item
     */
    this.evChangeObjectInspectorItem = function(e) {
        try {
            var sFieldName = e.srcElement.getAttribute("fieldname");
            var sValue = e.srcElement.value;
            if (e.srcElement.getAttribute("type") === "checkbox") {
                sValue = (e.srcElement.checked) ? "1" : "0";
            }
            self.setDesignerItemProperty(sFieldName, sValue);
            self.updateCboDesignerItem();
        } catch (err) {
            this.onException(err);
        }
    }; //evChangeObjectInspectorItem

    /**
     * update che combo object inspector
     */
    this.updateCboDesignerItem = function(iDi) {
        iDi = iDi || null;
        var i = 0;
        var tmp = [];
        var tTag = "";
        var tName = "";

        tmp.push(["", ""]);

        loopVariables: for (var property in self.pnlContentDesigner) {
                if (self.pnlContentDesigner.hasOwnProperty(property)) {
                    if (isUndefined(self.pnlContentDesigner[property]) ||
                        isNull(self.pnlContentDesigner[property])) {
                        continue;
                    }

                    if (!isUndefined(self.pnlContentDesigner[property].TAG)) {
                        tTag = self.pnlContentDesigner[property].TAG;
                        tName = self.pnlContentDesigner[property].getName();
                        tName = tName.replace(self.pnlContentDesigner[property].getParent() + "_", "");

                        if (!isUndefined(self.pnlContentDesigner[property].getType)) {
                            tTag += " - " + self.pnlContentDesigner[property].getType();
                        }

                        tmp.push([tName, sprintf("{0} - {1} [{2}]", i, tName, tTag)]);
                        i++;
                    }
                }
            } //loopVariables

        self.cboDesignerItem.setData(tmp);

        if (iDi) {
            self.setDesignItemCurrent(iDi);
        }
    }; //updateCboDesignerItem
    /**
     * drawProperties description
     */
    this.drawProperties = function() {
        try {
            if (this.getFloatingBox() === 1) {
                // transform panel in floating tool window
                this.drawPanelTitle(this.pnlContent1c, {
                    sCaption: "Object Inspector",
                    sLeft: self.sBoxObjectExplorerLeft,
                    sTop: self.sBoxObjectExplorerTop,
                    sWidth: "250px"
                });
            }

            this.cboDesignerItem = new nsNessuno.oCombobox(this.pnlContent1c.getName(), this.pnlContent1c.getChildName("cboDesignerItem"));
            this.cboDesignerItem.setHeight("20px");
            this.cboDesignerItem.setEvChange(function(e) {
                self.setDesignItemCurrent(e.srcElement.value);
            });

            this.drawObjectInspector();


        } catch (err) {
            this.onException(err);
        }
    }; // drawProperties

    /**
     * draw
     */
    this.draw = function() {
        // set active form
        this.manager.setActiveForm(self);

        // build the titlebar
        this.buildTitleBar();

        this.pnlContent = new nsNessuno.oPanel(self.getName(), self.getChildName("pnlContent"));
        this.pnlContent.eleHTML.style.background = themeCurrent.main_background;
        this.pnlContent.eleHTML.style.color = themeCurrent.main_color;

        // content...
        var sToolbarBtnWidth = "20%";
        // var sToolbarBtnHeight = "100%";

        this.pnlToolbar1 = new nsNessuno.oPanel(this.pnlContent.getName(), this.pnlContent.getChildName("pnlToolbar1"));
        this.pnlToolbar1.setBackground("#FFFFFF");
        this.pnlToolbar1.setBorder("1px solid " + themeCurrent.grid_head_border);
        this.pnlToolbar1.setOverflow("auto");
        this.pnlToolbar1.setHeight("24px");

        this.cboFormName = new nsNessuno.oCombobox(this.pnlToolbar1.getName(), this.pnlToolbar1.getChildName("cboFormName"));
        this.cboFormName.setWidth(sToolbarBtnWidth);
        this.cboFormName.setFloat("left");
        var param = btoa(JSON.stringify({ idvar: 'FormMainFill' }));
        self.manager.connection1.callHttpRequest(param, function(d) {
            var j;
            var jsonData = JSON.parse(d);
            var sIdForm = "";
            var aTmp = [];
            aTmp.push(["", ""]);

            if (!jsonData.aRes) {
                return;
            }
            jsonData = jsonData.aRes[0];

            for (j = 0; j < jsonData.aRows.length; j++) {
                sIdForm = self.manager.connection1.getValueByColName(jsonData, j, "id_form");
                if (sIdForm === self.sIdForm) {
                    continue;
                }
                aTmp.push([sIdForm, sIdForm]);
            }
            self.cboFormName.setData(aTmp);
            self.cboFormName.setEvChange(function(e) {
                self.loadFun();
            });
        });

        // toolbar
        this.tlbMain1 = new nsNessuno.oToolbar(this.pnlToolbar1.getName(), this.pnlToolbar1.getChildName("tlbMain1"));
        this.tlbMain1.eleHTML.style.backgroundRepeat = "no-repeat";
        self.tlbMain1.addButton("i_settings.png", null, "Form properties");
        self.tlbMain1.addButton("i_script.png", self.drawEditorJavascript, "Javascript");
        self.tlbMain1.addButton("i_server.png", self.drawEditorSql, "SQL");

        // -----------------------------------------------------------
        // left
        // -----------------------------------------------------------
        this.pnlContent1a = new nsNessuno.oPanel(this.pnlContent, "pnlContent1a");
        this.pnlContent1a.setWidth("20%");
        this.pnlContent1a.setFloat("left");
        this.pnlContent1a.setHeight("100%");
        this.drawToolbox();

        // -----------------------------------------------------------
        // middle
        // -----------------------------------------------------------
        this.pnlContent1b = new nsNessuno.oPanel(this.pnlContent, "pnlContent1b");
        this.pnlContent1b.setWidth("60%");
        this.pnlContent1b.setFloat("left");
        this.pnlContent1b.setOverflow("auto");
        this.pnlContent1b.eleHTML.style.background = themeCurrent.main_background;
        this.pnlContent1b.eleHTML.style.color = themeCurrent.main_color;

        if (this.getFloatingBox() === 1) {
            // transform panel in floating tool window
            this.drawPanelTitle(this.pnlContent1b, {
                sCaption: "Form",
                sLeft: "300px",
                sTop: "100px",
                sWidth: "60%",
                sHeight: "600px"
            });
        }

        this.pnlContentDesigner = new nsNessuno.oPanel(this.pnlContent1b.getName(), this.pnlContent1b.getChildName("pnlContentDesigner"));
        this.pnlContentDesigner.setOverflow("auto");
        this.pnlContentDesigner.setHeight("100%");
        if (this.getFloatingBox() === 1) {
            this.pnlContentDesigner.setHeight((this.pnlContent1b.eleHTML.clientHeight - 26) + "px");
        }

        this.pnlContentDesigner.eleHTML.addEventListener("dragover", function(e) {
            e.preventDefault();
        });

        this.pnlContentDesigner.eleHTML.addEventListener("drop", function(e) {
            e.preventDefault();
            var data = e.dataTransfer.getData("text");
            if (nsNessuno.oToolboxItem[data]) {
                nsNessuno.oToolboxItem[data]();
            }
        });



        // -----------------------------------------------------------
        // right side
        // -----------------------------------------------------------
        this.pnlContent1c = new nsNessuno.oPanel(this.pnlContent, "pnlContent1c");
        this.pnlContent1c.setWidth("20%");
        this.pnlContent1c.setFloat("left");
        this.pnlContent1c.setBackground("#FFFFFF");
        this.drawProperties();

        if (this.getMode() === this.manager.EnumFormtype.MAIN_CONTENT) {
            // add event in order to set the current active form
            this.pnlContent.eleHTML.addEventListener("mouseenter", function(a) {
                self.manager.setActiveForm(self);
            }); // eventlistener
        }
    }; //draw

    /**
     * get select type
     */
    this.getSelectTypeArr = function() {
        var aTTypes = nsNessuno.oInputTypes.aTypes;
        var i = 0;
        var tmp = [];
        for (i = 0; i < aTTypes.length; i++) {
            tmp.push([aTTypes[i], aTTypes[i]]);
        }

        return tmp;
    }; //getSelectTypeArr

    /**
     * drawObjectInspector description
     */
    this.drawObjectInspector = function() {
        try {
            var getSelectType = function() {
                var aTTypes = nsNessuno.oInputTypes.aTypes;
                var i = 0;
                var sTpl = "";
                for (i = 0; i < aTTypes.length; i++) {
                    sTpl += "<option value=\"" + aTTypes[i] + "\">" + aTTypes[i] + "</option>";
                }

                return sTpl;
            };

            var getSelectBarcodeFormat = function() {
                var aTTypes = nsNessuno.oBarcodeFormat.aTypes;
                var i = 0;
                var sTpl = "";
                for (i = 0; i < aTTypes.length; i++) {
                    sTpl += "<option value=\"" + aTTypes[i] + "\">" + aTTypes[i] + "</option>";
                }

                return sTpl;
            };

            var getDesignInput = function(sField, sType, sValue) {
                //
                var rs = "";
                var sId = self.getChildName(sField + "_input");
                var sClass = "designerPropertyInput";

                var sStyle = " style=\"margin: 0px; width:100%; height: 100%; box-sizing: border-box;\"";
                var sChecked = (sValue === "1" || sValue === 1 || sValue === "true") ? " checked" : "";

                sValue = " value=\"" + sValue + "\"";

                if (sType === "Select") { rs = "<select id=\"" + sId + "\" fieldname=\"" + sField + "\" class=\"" + sClass + "\"" + sStyle + "><option value=\"none\">none</option><option value=\"left\">left</option><option value=\"right\">right</option></select>"; }
                if (sType === "Checkbox") { rs = "<input id=\"" + sId + "\" fieldname=\"" + sField + "\" type=\"checkbox\" class=\"" + sClass + "\"" + sStyle + sChecked + ">"; }
                if (sType === "InputText") { rs = "<input id=\"" + sId + "\" fieldname=\"" + sField + "\" type=\"text\" class=\"" + sClass + "\"" + sStyle + sValue + ">"; }
                if (sType === "InputColor") { rs = "<input id=\"" + sId + "\" fieldname=\"" + sField + "\" type=\"color\" class=\"" + sClass + "\"" + sStyle + sValue + ">"; }
                if (sType === "SelectType") { rs = "<select id=\"" + sId + "\" fieldname=\"" + sField + "\" class=\"" + sClass + "\"" + sStyle + ">" + getSelectType() + "</select>"; }
                if (sType === "InputNumber") { rs = "<input id=\"" + sId + "\" fieldname=\"" + sField + "\" type=\"number\" class=\"" + sClass + "\"" + sStyle + sValue + ">"; }
                if (sType === "SelectBarcodeFormat") { rs = "<select id=\"" + sId + "\" fieldname=\"" + sField + "\" class=\"" + sClass + "\"" + sStyle + ">" + getSelectBarcodeFormat() + "</select>"; }

                return rs;
            };

            // types
            var desItems = [
                ["Name", "InputText"],
                ["Type", "SelectType"],
                ["Sequence", "InputNumber"],
                ["Caption", "InputText"],
                ["Width", "InputText"],
                ["Height", "InputText"],
                ["Value", "InputText"],
                ["Left", "InputText"],
                ["Top", "InputText"],
                ["SQLFill", "InputText"],
                ["EvClick", "InputText"],
                ["EvDblClick", "InputText"],
                ["Float", "Select"],
                ["Min", "InputNumber"],
                ["Max", "InputNumber"],
                ["Step", "InputNumber"],
                ["Readonly", "Checkbox"],
                ["LineNumbers", "Checkbox"],
                ["LineWrapping", "Checkbox"],
                ["Required", "Checkbox"],
                ["Disabled", "Checkbox"],
                ["Multi", "Checkbox"],
                ["MediaControls", "Checkbox"],
                ["MediaAutoplay", "Checkbox"],
                ["MediaLoop", "Checkbox"],
                ["ColorProgress", "InputColor"],
                ["ColorLabels", "InputColor"],
                ["BarcodeFormat", "SelectBarcodeFormat"],
                ["Color", "InputColor"]
            ];

            var getGridControl = function(sname) {
                var ii = 0;
                sname = sname.toLowerCase();
                for (ii = 0; ii < desItems.length; ii++) {
                    if ((sname === desItems[ii][0].toLowerCase()) ||
                        (sname === "s" + desItems[ii][0].toLowerCase()) ||
                        (sname === "i" + desItems[ii][0].toLowerCase())) {
                        return desItems[ii][1];
                    }
                }
                return "InputText";
            };

            // load properties of current element
            var tmpProperties = null;
            if (self.pnlContentDesigner[self.sDesignItemCurrent]) {
                if (self.pnlContentDesigner[self.sDesignItemCurrent].getProperties) {
                    tmpProperties = self.pnlContentDesigner[self.sDesignItemCurrent].getProperties();
                }
            }

            var jj = 0;
            var tmp = [];

            if (tmpProperties) {

                for (var property in tmpProperties) {
                    if (tmpProperties.hasOwnProperty(property)) {
                        tmp.push([property, getDesignInput(property, getGridControl(property), tmpProperties[property])]);
                    }
                }

                // button
                freeObj(this.btnObjectInspectorDeleteItem);
                this.btnObjectInspectorDeleteItem = new nsNessuno.oButton(this.pnlContent1c.getName(), this.pnlContent1c.getChildName("btnObjectInspectorDeleteItem"));
                this.btnObjectInspectorDeleteItem.setCaption("DELETE OBJECT");
                this.btnObjectInspectorDeleteItem.setHeight("20px");
                this.btnObjectInspectorDeleteItem.setWidth("100%");
                this.btnObjectInspectorDeleteItem.setFloat("left");
                this.btnObjectInspectorDeleteItem.setEvClick(function() {
                    if (self.pnlContentDesigner[self.sDesignItemCurrent]) {
                        self.pnlContentDesigner[self.sDesignItemCurrent].destroy();
                        delete self.pnlContentDesigner[self.sDesignItemCurrent];
                        // update the combo
                        self.updateCboDesignerItem();
                    }
                });

                // grid
                freeObj(this.gridObjectInspector);
                this.gridObjectInspector = new nsNessuno.oGrid(this.pnlContent1c.getName(), this.pnlContent1c.getChildName("gridObjectInspector"));
                this.gridObjectInspector.setMulti(0);
                this.gridObjectInspector.setMaxCol(2);
                this.gridObjectInspector.setMaxRow(0);
                this.gridObjectInspector.setRowHeight(20);
                this.gridObjectInspector.setShowColHeadings(1);
                this.gridObjectInspector.setShowRowHeadings(0);
                this.gridObjectInspector.setColNames(["Field", "Value"]);
                this.gridObjectInspector.setData(tmp);
                this.gridObjectInspector.setHeight((this.pnlContent1c.eleHTML.clientHeight - 66) + "px");

                // events
                var eleObjectInspector = this.gridObjectInspector.eleHTML;
                var eles = null;
                if (eleObjectInspector) {
                    eles = eleObjectInspector.getElementsByClassName("designerPropertyInput");
                }
                if (eles) {
                    for (jj = 0; jj < eles.length; jj++) {
                        eles[jj].addEventListener("change", self.evChangeObjectInspectorItem);
                    }
                }

            }

        } catch (err) {
            this.onException(err);
        }
    }; // drawObjectInspector

    /**
     * set the current design item property
     */
    this.setDesignerItemProperty = function(sFieldName, sValue) {
        try {
            if (self.sDesignItemCurrent) {
                if (sFieldName === "sName") {
                    self.pnlContentDesigner[sValue] = self.pnlContentDesigner[self.sDesignItemCurrent];
                    self.pnlContentDesigner[sValue].setName(sValue);
                    delete self.pnlContentDesigner[self.sDesignItemCurrent];

                    // update the combo
                    self.updateCboDesignerItem(sValue);
                } else {
                    if (self.pnlContentDesigner[self.sDesignItemCurrent]) {
                        self.pnlContentDesigner[self.sDesignItemCurrent][sFieldName] = sValue;
                        self.pnlContentDesigner[self.sDesignItemCurrent].refresh();
                    }
                }
            }
        } catch (err) {
            this.onException(err);
        }
    }; //setDesignerItemProperty

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
     * getter for IdFormDesigner
     */
    this.getIdFormDesigner = function() {
        return this.sIdFormDesigner;
    }; // getIdFormDesigner

    /**
     * setter for IdFormDesigner
     */
    this.setIdFormDesigner = function(v) {
        this.sIdFormDesigner = v;
    }; // setIdFormDesigner

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

    /**
     * clearDesignerItems description
     */
    this.clearDesignerItems = function() {
        try {
            loopVariables: for (var sname in self.pnlContentDesigner) {
                    if (self.pnlContentDesigner.hasOwnProperty(sname)) {
                        if (self.pnlContentDesigner[sname]) {
                            if (self.pnlContentDesigner[sname].TAG) {
                                if (self.pnlContentDesigner[sname].destroy) {
                                    self.pnlContentDesigner[sname].destroy();
                                    delete self.pnlContentDesigner[sname];
                                }
                            }
                        }
                    }
                } // loopVariables
        }
        catch (err) {
            this.onException(err);
        }
    }; // clearDesignerItems

    /**
     * getter for Properties
     */
    this.getProperties = function() {
        // return this.oProperties;
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
    }; // getProperties

    /**
     * setter for Properties
     */
    this.setProperties = function(v) {
        // this.oProperties = v;

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
    }; // setProperties

    /**
     * drawEditorJavascript
     * creates a simple Javascript editor for this form (default)
     */
    this.drawEditorJavascript = function() {
        try {
            if (self.pnlEditorJavascript1) {
                self.pnlEditorJavascript1.destroy();
            }

            self.pnlEditorJavascript1 = new nsNessuno.oPanel(self.pnlContent.getName(), self.pnlContent.getChildName("pnlEditorJavascript1"));

            // transform a panel into a floating window
            self.drawPanelTitle(self.pnlEditorJavascript1, { sCaption: "Javascript Editor", sLeft: "20%", sTop: "50%", sWidth: "30%" });

            self.txtCodeJavascript1 = new nsNessuno.oCodeMirror(self.pnlEditorJavascript1.getName(), self.pnlEditorJavascript1.getChildName("txtCodeJavascript1"));
            self.txtCodeJavascript1.setLineNumbers(1);

            self.txtCodeJavascript1.setHeight((self.pnlEditorJavascript1.eleHTML.clientHeight - 26 )+ "px");
            self.txtCodeJavascript1.setValue("var oForm['{{IDFORM}}'].create = function(){};");

        } catch (err) {
            self.onException(err);
        }
    }; // drawEditorJavascript

    /**
     * drawEditorSql
     * create a simple SQL editor for this form (default)
     */
    this.drawEditorSql = function() {
        try {
            if (self.pnlEditorSql1) {
                self.pnlEditorSql1.destroy();
            }

            self.pnlEditorSql1 = new nsNessuno.oPanel(self.pnlContent.getName(), self.pnlContent.getChildName("pnlEditorSql1"));

            // transform a panel into a floating window
            self.drawPanelTitle(self.pnlEditorSql1, { sCaption: "SQL Editor", sLeft: "50%", sTop: "50%", sWidth: "30%" });

            self.txtCodeSql1 = new nsNessuno.oCodeMirror(self.pnlEditorSql1.getName(), self.pnlEditorSql1.getChildName("txtCodeSql1"));
            self.txtCodeSql1.setLineNumbers(1);
            self.txtCodeSql1.setHeight((self.pnlEditorSql1.eleHTML.clientHeight - 26 )+ "px");

            self.txtCodeSql1.setMode("text/x-sql");
            self.txtCodeSql1.setValue("SELECT * FROM Anagrafica");

        } catch (err) {
            self.onException(err);
        }
    }; // drawEditorSql

    /**
     * drawPanelTitle
     * transform a simple panel into a draggable form window
     */
    this.drawPanelTitle = function(oPnl, oParam) {
        oParam = oParam || {};
        oParam.sLeft = oParam.sLeft || "50px";
        oParam.sTop = oParam.sTop || "50px";
        oParam.sWidth = oParam.sWidth || "500px";
        oParam.sHeight = oParam.sHeight || "300px";

        var sBorder = "1px solid #C7CACB";

        try {
            var initPnlDragListener = function() {
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
                    var ele = document.getElementById(oPnl.pnlHeaderLeft.getName());

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
            }; // initPnlDragListener

            //
            oPnl.eleHTML.style.position = "absolute";
            oPnl.eleHTML.style.left = oParam.sLeft;
            oPnl.eleHTML.style.top = oParam.sTop;
            oPnl.setWidth(oParam.sWidth);
            oPnl.setHeight(oParam.sHeight);

            oPnl.eleHTML.style.boxSizing = "border-box";
            oPnl.eleHTML.style.border = sBorder;
            oPnl.eleHTML.style.borderTopLeftRadius = "5px";
            oPnl.eleHTML.style.borderTopRightRadius = "5px";
            // oPnl.eleHTML.style.borderRight = sBorder;
            // oPnl.eleHTML.style.borderBottom = sBorder;
            // oPnl.eleHTML.style.borderLeft = sBorder;

            oPnl.pnlHeader = new nsNessuno.oPanel(oPnl.getName(), oPnl.getChildName("pnlHeader"));
            oPnl.pnlHeader.setHeight(self.aHeights[0] + "px");
            oPnl.pnlHeader.eleHTML.style.background = themeCurrent.titlebar_active;
            oPnl.pnlHeader.eleHTML.style.color = "#FFFFFF";
            oPnl.pnlHeader.eleHTML.style.borderTopLeftRadius = "5px";
            oPnl.pnlHeader.eleHTML.style.borderTopRightRadius = "5px";

            oPnl.pnlHeaderLeft = new nsNessuno.oPanel(oPnl.pnlHeader.getName(), oPnl.getChildName("pnlEditor1pnlHeaderLeft"));
            oPnl.pnlHeaderLeft.setFloat("left");
            oPnl.pnlHeaderLeft.setWidth("100%");
            oPnl.pnlHeaderLeft.eleHTML.innerHTML = "<b>" + oParam.sCaption + "</b>";
            oPnl.pnlHeaderLeft.eleHTML.style.cursor = "move";
            oPnl.pnlHeaderLeft.eleHTML.style.padding = "5px";

            oPnl.imgTitleButtons = new nsNessuno.oImg(oPnl.pnlHeaderLeft.getName(), oPnl.getChildName("pnlEditor1imgTitleButtons"));
            oPnl.imgTitleButtons.setWidth("18px");
            oPnl.imgTitleButtons.setHeight("18px");
            oPnl.imgTitleButtons.setStretch(1);
            oPnl.imgTitleButtons.setFloat("right");
            oPnl.imgTitleButtons.setValue(themeCurrent.titlebar_active_btn_close);
            oPnl.imgTitleButtons.setEvClick(function() {
                oPnl.destroy();
            });

            // init..
            initPnlDragListener();
        } catch (err) {
            self.onException(err);
        }
    }; // drawPanelTitle

    //create
    this.create(sParent, sName);

}; //oFormDesigner
