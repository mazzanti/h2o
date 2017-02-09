/*
 * oFormGeneric
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-25 16:29:45
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oFormGeneric = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oFormGeneric"; // tag
    this.manager = null;
    this._owner = null;
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated

    this.sIdForm = "";

    this.sWidth = "100%";
    this.sHeight = "100%";

    this.sMinWidth = "";
    this.sMinHeight = "";

    this.sMaxWidth = "";
    this.sMaxHeight = "";

    this.sLeft = "";
    this.sTop = "";

    this.sCaption = "";
    this.sMode = "";
    this.szIndex = 0;
    this.iResizable = 0;
    this.iAutosize = 0;
    this.sPosition = "center"; // center, none

    this.sOnSave = "";
    this.sOnBack = "";
    this.sOnCancel = "";
    this.sOnDelete = "";

    //
    this.aHeights = [26];

    //
    this.aData = [];
    this.aFields = [];

    this._iCountIncludes = 0;
    this.aIncludes = [];

    this._iChange = 0;

    this.oFormParam = null;
    this._oFormReferer = null;
    this._oFormChild = null;
    this.oProperties = null;
    this.sSqlFill = "";

    this.sSqlSelect = "";
    this.sSqlInsert = "";
    this.sSqlUpdate = "";
    this.sSqlDelete = "";

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
     * returns html id
     */
    this.getId = function() {
        try {
            return this.getParent() + "_" + this.getName();
        } catch (err) {
            this.onException(err);
        }
    }; // getId

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
    }; //setHeight

    /**
     * get height
     */
    this.getHeight = function() {
        return this.sHeight;
    }; //getHeight

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
     * getter for OnSave
     */
    this.getOnSave = function() {
        return this.sOnSave;
    }; // getOnSave

    /**
     * setter for OnSave
     */
    this.setOnSave = function(v) {
        this.sOnSave = v;
    }; // setOnSave

    /**
     * getter for OnBack
     */
    this.getOnBack = function() {
        return this.sOnBack;
    }; // getOnBack

    /**
     * setter for OnBack
     */
    this.setOnBack = function(v) {
        this.sOnBack = v;
    }; // setOnBack

    /**
     * getter for OnCancel
     */
    this.getOnCancel = function() {
        return this.sOnCancel;
    }; // getOnCancel

    /**
     * setter for OnCancel
     */
    this.setOnCancel = function(v) {
        this.sOnCancel = v;
    }; // setOnCancel

    /**
     * getter for OnDelete
     */
    this.getOnDelete = function() {
        return this.sOnDelete;
    }; // getOnDelete

    /**
     * setter for OnDelete
     */
    this.setOnDelete = function(v) {
        this.sOnDelete = v;
    }; // setOnDelete

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

        this.refreshWindow();
    }; // setMode

    /**
     * refreshWindow description
     */
    this.refreshWindow = function() {
        try {
            if (this.getMode() === this.manager.EnumFormtype.MAIN_CONTENT) {
                // MAIN_CONTENT
                self.setWidth("100%");
                self.setHeight("100%");
                //
                self.manager.hideMainMenu();
            } else {
                // POPUP


                self.setLeft("50px");
                self.setTop("50px");

                // if autosize is set remove all things
                if (this.getAutosize() === 1) {
                    self.setWidth("");
                    self.setHeight("");

                    self.setMinWidth("50%");
                    // self.setMinHeight("50px");
                } else {
                    // forced default size
                    self.setWidth("900px");
                    self.setHeight("500px");

                    // check properties set
                    if (this.oProperties) {
                        if (this.oProperties.sWidth) {
                            this.setWidth(this.oProperties.sWidth);
                        }

                        if (this.oProperties.sHeight) {
                            this.setHeight(this.oProperties.sHeight);
                        }

                        if (this.oProperties.sLeft) {
                            this.setLeft(this.oProperties.sLeft);
                        }

                        if (this.oProperties.sTop) {
                            this.setTop(this.oProperties.sTop);
                        }
                    }
                }

                //
                self.setMaxHeight((window.innerHeight - 100) + "px");

                // centered
                self.eleHTML.style.position = "absolute";

                // self.eleHTML.style.resize = "both";
                // self.eleHTML.style.overflow = "auto";

                this.eleHTML.style.width = this.getWidth();
                this.eleHTML.style.height = this.getHeight();

                this.eleHTML.style.minWidth = this.getMinWidth();
                this.eleHTML.style.minHeight = this.getMinHeight();

                this.eleHTML.style.maxWidth = this.getMaxWidth();
                this.eleHTML.style.maxHeight = this.getMaxHeight();

                //
                this.eleHTML.style.left = this.getLeft();
                this.eleHTML.style.top = this.getTop();

                //
                this.eleHTML.style.zIndex = 1;
            }
        } catch (err) {
            this.onException(err);
        }
    }; // refreshWindow

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
     * getter for Left
     */
    this.getLeft = function() {
        return this.sLeft;
    }; // getLeft

    /**
     * setter for Left
     */
    this.setLeft = function(v) {
        this.sLeft = v;
    }; // setLeft

    /**
     * getter for Top
     */
    this.getTop = function() {
        return this.sTop;
    }; // getTop

    /**
     * setter for Top
     */
    this.setTop = function(v) {
        this.sTop = v;
    }; // setTop

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
                    if ((property !== "_owner") &&
                        (property !== "manager") &&
                        (property !== "_oFormReferer") &&
                        (property !== "_oFormChild")) {
                        if (this[property] && !isUndefined(this[property].destroy)) {
                            // if (!isNull(this[property]) && !isUndefined(this[property].destroy)) {
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

            // events
            this.setEvents();
        } catch (err) {
            this.onException(err);
        }
    }; //createHtmlElement

    /**
     * draw
     */
    this.draw = function() {
        try {
            // set active form
            this.manager.setActiveForm(self);

            //
            this.refresh();
        } catch (err) {
            this.onException(err);
        }
    }; // draw

    /**
     * refresh
     */
    this.refresh = function() {
        try {
            // head
            this.drawHeader();

            // body
            this.pnlBody = new nsNessuno.oPanel(this.getName(), this.getChildName("pnlBody"));

            if (this.getAutosize() !== 1) {
                this.pnlBody.setHeight((this.eleHTML.clientHeight - this.pnlHeader.eleHTML.clientHeight) + "px");
            }

            this.pnlBody.eleHTML.style.background = themeCurrent.main_background;
            this.pnlBody.eleHTML.style.color = themeCurrent.main_color;

            // this.eleHTML.style.resize = "both";
            // this.eleHTML.style.overflow = "auto";

            //
            if (this.getMode() === this.manager.EnumFormtype.MAIN_CONTENT) {
                // add event in order to set the current active form
                this.pnlBody.eleHTML.addEventListener("mouseenter", function(a) {
                    self.manager.setActiveForm(self);
                }); // eventlistener
            }

            // mode?
            if (this.getMode() === this.manager.EnumFormtype.MAIN_CONTENT) {
                this.hideHead();
            } //

            // content
            this.pnlContent = new nsNessuno.oPanel(self.pnlBody.getName(), self.pnlBody.getChildName("pnlContent"));
            this.pnlContent.setOwner(self);
            this.pnlContent.setMaxHeight(this.getMaxHeight());
            this.pnlContent.setOverflow("auto");
            this.pnlContent.eleHTML.style.background = themeCurrent.main_background;
            this.pnlContent.eleHTML.style.color = themeCurrent.main_color;

            // fill the form...
            this.fillForm();

        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * drawHeader description
     */
    this.drawHeader = function() {
        try {
            if (this.pnlHeader) {
                this.pnlHeader.destroy();
            }

            this.pnlHeader = new nsNessuno.oPanel(self.getName(), self.getChildName("pnlHeader"));
            this.pnlHeader.setHeight(this.aHeights[0] + "px");
            this.pnlHeader.eleHTML.style.background = themeCurrent.titlebar_active;
            this.pnlHeader.eleHTML.style.color = "#FFFFFF";
            this.pnlHeader.eleHTML.style.borderTopLeftRadius = "5px";
            this.pnlHeader.eleHTML.style.borderTopRightRadius = "5px";

            this.pnlHeaderLeft = new nsNessuno.oPanel(self.pnlHeader.getName(), self.getChildName("pnlHeaderLeft"));
            this.pnlHeaderLeft.setFloat("left");
            this.pnlHeaderLeft.setWidth("100%");
            this.pnlHeaderLeft.eleHTML.innerHTML = "<b>" + this.getCaption() + "</b>";
            this.pnlHeaderLeft.eleHTML.style.cursor = "move";
            this.pnlHeaderLeft.eleHTML.style.padding = "5px";

            this.imgTitleButtons = new nsNessuno.oImg(self.pnlHeaderLeft.getName(), self.getChildName("imgTitleButtons"));
            this.imgTitleButtons.setWidth("18px");
            this.imgTitleButtons.setHeight("18px");
            this.imgTitleButtons.setStretch(1);
            this.imgTitleButtons.setFloat("right");
            this.imgTitleButtons.setValue(themeCurrent.titlebar_active_btn_close);
            this.imgTitleButtons.setEvClick(function() {
                self._owner.actionForm(self, "CLOSE");
            });

            // init..
            this.initDragListener();

        } catch (err) {
            this.onException(err);
        }
    }; // drawHeader

    /**
     * refreshWindowTitle description
     */
    this.refreshWindowTitle = function() {
        try {
            if (this.pnlHeaderLeft) {
                this.pnlHeaderLeft.eleHTML.innerHTML = "<b>" + this.getCaption() + "</b>";
            }
        } catch (err) {
            this.onException(err);
        }
    }; // refreshWindowTitle

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
            var ele = document.getElementById(self.pnlHeaderLeft.getName());

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
     * hide description
     */
    this.hide = function() {
        try {
            this.eleHTML.style.display = "none";
        } catch (err) {
            this.onException(err);
        }
    }; // hide

    /**
     * show description
     */
    this.show = function() {
        try {
            this.eleHTML.style.display = "";
        } catch (err) {
            this.onException(err);
        }
    }; // show

    /**
     * getter for Caption
     */
    this.getCaption = function() {
        return this.sCaption;
    }; // getCaption

    /**
     * setter for Caption
     */
    this.setCaption = function(v) {
        this.sCaption = v;
    }; // setCaption

    /**
     * hideHead description
     */
    this.hideHead = function() {
        try {
            // this.pnlHeader.hide();
            this.pnlHeader.setHeight("0px");
            this.pnlBody.setHeight((this.eleHTML.clientHeight - this.pnlHeader.eleHTML.clientHeight) + "px");
        } catch (err) {
            this.onException(err);
        }
    }; // hideHead

    /**
     * showHead description
     */
    this.showHead = function() {
        try {
            // this.pnlHeader.show();
            this.pnlHeader.setHeight(this.aHeights[0] + "px");
            this.pnlBody.setHeight((this.eleHTML.clientHeight - this.pnlHeader.eleHTML.clientHeight) + "px");
        } catch (err) {
            this.onException(err);
        }
    }; // showHead

    /**
     * getter for MinWidth
     */
    this.getMinWidth = function() {
        return this.sMinWidth;
    }; // getMinWidth

    /**
     * setter for MinWidth
     */
    this.setMinWidth = function(v) {
        this.sMinWidth = v;
    }; // setMinWidth

    /**
     * getter for MaxWidth
     */
    this.getMaxWidth = function() {
        return this.sMaxWidth;
    }; // getMaxWidth

    /**
     * setter for MaxWidth
     */
    this.setMaxWidth = function(v) {
        this.sMaxWidth = v;
    }; // setMaxWidth

    /**
     * getter for MaxHeight
     */
    this.getMaxHeight = function() {
        return this.sMaxHeight;
    }; // getMaxHeight

    /**
     * setter for MaxHeight
     */
    this.setMaxHeight = function(v) {
        this.sMaxHeight = v;
    }; // setMaxHeight

    /**
     * getter for MinHeight
     */
    this.getMinHeight = function() {
        return this.sMinHeight;
    }; // getMinHeight

    /**
     * setter for MinHeight
     */
    this.setMinHeight = function(v) {
        this.sMinHeight = v;
    }; // setMinHeight


    /**
     * set changes
     */
    this.setChanges = function(v) {
        this._iChanges = v;
    }; //setChanges

    /**
     * get changes
     */
    this.getChanges = function() {
        return this._iChanges;
    }; //getChanges

    /**
     * getter for FormParam
     */
    this.getFormParam = function() {
        return this.oFormParam;
    }; // getFormParam

    /**
     * setter for FormParam
     */
    this.setFormParam = function(v) {
        this.oFormParam = v;
    }; // setFormParam

    /**
     * getter for FormReferer
     */
    this.getFormReferer = function() {
        return this._oFormReferer;
    }; // getFormReferer

    /**
     * setter for FormReferer
     */
    this.setFormReferer = function(v) {
        this._oFormReferer = v;
    }; // setFormReferer

    /**
     * getter for Autosize
     */
    this.getAutosize = function() {
        if (typeof this.iAutosize === "string") {
            this.iAutosize = parseInt(this.iAutosize);
        }
        return this.iAutosize;
    }; // getAutosize

    /**
     * setter for Autosize
     */
    this.setAutosize = function(v) {
        if (typeof v === "string") {
            v = parseInt(v);
        }
        this.iAutosize = v;
    }; // setAutosize

    /**
     * doCreateForm description
     */
    this.doCreateForm = function(sIdForm, oFormParam) {
        try {
            if (this.getMode() === this.manager.EnumFormtype.MAIN_CONTENT) {
                // hide the form
                this.hide();
            }

            var oValues = oFormParam.getValue();
            self.manager.createForm(sIdForm /*form to create*/ ,
                oValues /*params*/ ,
                self /*form referrer*/ ,
                self.setFormChild /*callback*/ );
        } catch (err) {
            this.onException(err);
        }
    }; // doCreateForm

    /**
     * getFormChild description
     */
    this.getFormChild = function() {
        return this._oFormChild;
    }; // getFormChild

    /**
     * setFormChild description
     */
    this.setFormChild = function(v) {
        try {
            self._oFormChild = v;
        } catch (err) {
            self.onException(err);
        }
    }; // setFormChild

    /**
     * set events...
     */
    this.setEvents = function() {
        // monitor changes
        this.eleHTML.addEventListener("change", function(e) {
            self._iChanges = 1;
        });
        //
        this.eleHTML.addEventListener("keydown", function(e) {
            self._iChanges = 1;
        });
    }; //setEvents

    /**
     * save fun
     */
    this.saveFun = function() {
        this.setChanges(0);
        this.commitFormValues();
    }; //saveFun


    /**
     * fill the form
     */
    //region
    this.fillForm = function() {

        if (self.sSqlFill) {
            // fill the form
            var param = btoa(JSON.stringify({ idvar: self.sSqlFill, id_form: self.sIdForm }));
            this.manager.connection1.callHttpRequest(param, function(d) {
                var sTSqlFill;

                var jsonData = JSON.parse(d);
                if (!jsonData.aRes) {
                    return;
                }

                var parserForm1 = new nsNessuno.oParserForm(self.pnlContent.getName(), self.pnlContent.getChildName("parserForm1"));
                parserForm1.build(jsonData.aRes[0], self.pnlContent);

                var fun = null;

                // loop elements
                var property = null;
                loopEles: for (property in self.pnlContent) {
                    if (self.pnlContent.hasOwnProperty(property)) {
                        if (self.pnlContent[property]) {
                            if (self.pnlContent[property].TAG) {
                                // change handler
                                if (self.pnlContent[property].sSqlChangeHandler) {
                                    self.pnlContent[property].setEvChange(self.handleChange);
                                }

                                // sqlfill for each element
                                if (self.pnlContent[property].getSqlFill) {
                                    sTSqlFill = self.pnlContent[property].getSqlFill();
                                    if (sTSqlFill !== "") {

                                        // populate with sqlfill
                                        param = btoa(JSON.stringify({ idvar: sTSqlFill, id_form: self.sIdForm, sname: property }));
                                        self.manager.connection1.callHttpRequest(param, self.pnlContent[property].populateData);

                                        // interval
                                        if (self.pnlContent[property].startIntervalFill) {
                                            self.pnlContent[property].startIntervalFill();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // refresh captions
                self.refreshFormCaptions();

                // form built... populate each element with data
                self.populateFormSelect();

            }); //call
        }
    }; //fillForm
    //endregion

    /**
     * refreshFormCaptions description
     */
    this.refreshFormCaptions = function() {
        try {
            // foreach variable, search his caption
            var a = this.manager.getCaptionByParams({ idvar: "var1" }); //FIXME
            console.log(a);
        } catch (err) {
            this.onException(err);
        }
    }; // refreshFormCaptions

    /**
     * populate form with values
     */
    //region
    this.populateFormSelect = function() {
        var i = 0;
        var oFilter = {};


        if (self.sSqlSelect !== "") { //FIXME: dalla main non funziona piu

            // if a filter is set, I took for each aColFilter his value
            if (self.oFormParam && self.oFormParam.aColFilter) {
                loopColFilter: for (i = 0; i < self.oFormParam.aColFilter.length; i++) {
                        oFilter[self.oFormParam.aColFilter[i]] = this.manager.connection1.getValueByColName(
                            self.oFormParam,
                            0,
                            self.oFormParam.aColFilter[i]
                        );
                    } //loopColFilter
            } // end build filter

            var param = "";
            param = btoa(JSON.stringify(mergeArray({ idvar: self.sSqlSelect, id_form: self.sIdForm }, oFilter)));
            this.manager.connection1.callHttpRequest(param, function(d) {
                var jsonData = JSON.parse(d);
                var property = null;
                var sTSqlFill = "";
                var sValue = "";

                if (!jsonData.aRes) {
                    return;
                }
                jsonData = jsonData.aRes[0];

                // loop elements
                loopEles: for (property in self.pnlContent) {
                        if (self.pnlContent.hasOwnProperty(property)) {
                            if (self.pnlContent[property]) {
                                if (self.pnlContent[property].TAG) {

                                    // if ele has a populate data...
                                    if (self.pnlContent[property].populateData) {
                                        // reset
                                        sTSqlFill = "";

                                        sValue = self.manager.connection1.getValueByColName(jsonData, 0, property);
                                        if (self.pnlContent[property].setValue) {
                                            self.pnlContent[property].setValue(sValue);
                                        }

                                        // sqlfill for each element
                                        if (self.pnlContent[property].getSqlFill) {
                                            sTSqlFill = self.pnlContent[property].getSqlFill();

                                            if (sTSqlFill !== "") {

                                                // populate with sqlfill

                                                // one time only
                                                param = btoa(JSON.stringify({ idvar: sTSqlFill, id_form: self.sIdForm, sname: property }));
                                                self.manager.connection1.callHttpRequest(param, self.pnlContent[property].populateData);
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    } //loopEles

                // post build form
                postBuildForm(self);
            });
        } else {
            // post build form
            postBuildForm(self);
        }
    }; //populateFormSelect
    //endregion

    /**
     * parse the response of change event
     */
    //region
    this.parseResponseChange = function(jsonData) {
        try {
            var i = 0;
            var j = 0;

            var sName = "";
            var sColumn = "";
            var sValue = "";

            loopRows: for (i = 0; i < jsonData.aRes[0].aRows.length; i++) {
                    sName = self.manager.connection1.getValueByColName(jsonData.aRes[0], i, "sName");

                    if (self.pnlContent[sName]) { // item exists
                        loopCols: for (j = 0; j < jsonData.aRes[0].aColNames.length; j++) {
                                // each column is a property.. so assign to each property his value..
                                sColumn = jsonData.aRes[0].aColNames[j];
                                sValue = jsonData.aRes[0].aRows[i][j];

                                if (sColumn !== "sName") {
                                    self.pnlContent[sName][sColumn] = sValue;
                                    // self.pnlContent[sName]["set"+sColumn](sValue); // using setter
                                }

                            } //loopCols

                        // refresh the item
                            if (self.pnlContent[sName].refresh) {
                            self.pnlContent[sName].refresh();
                        }
                    } // end check item exists
                } //loopRows

        } catch (err) {
            this.onException(err);
        }
    }; // parseResponseChange
    //endregion

    /**
     * change input event
     */
    //region
    this.handleChange = function(e, v) {
        // console.log(e, v);
        var param = "";
        var tmp = {};
        var sSqlChangeHandler = "";

        if (self.pnlContent[v]) {
            tmp = self.getFormItemValues();

            if (tmp) {
                //
                sSqlChangeHandler = self.pnlContent[v].getSqlChangeHandler();

                if (!isEmpty(sSqlChangeHandler)) {

                    // populate with sqlfill
                    param = tmp;
                    param.idvar = sSqlChangeHandler;
                    param.id_form = self.sIdForm;
                    param.sname = v;

                    param = btoa(JSON.stringify(param));
                    self.manager.connection1.callHttpRequest(param, function(d) {
                        var jsonData = JSON.parse(d);

                        self.parseResponseChange(jsonData);

                    }); // callsqlchange
                }
            }
        }
    }; //handleChange
    //endregion

    /**
     * getFormItemValues description
     */
    //region
    this.getFormItemValues = function() {
        var property = null;
        var tmp = {};
        try {

            loopEles: for (property in this.pnlContent) {
                    if (this.pnlContent.hasOwnProperty(property)) {
                        if (this.pnlContent[property]) {
                            if (this.pnlContent[property].TAG) {
                                //populateData
                                if (this.pnlContent[property].populateData) {
                                    // prepare form values
                                    if (this.pnlContent[property].getValue) {
                                        tmp[property] = this.pnlContent[property].getValue();
                                    }
                                } //exists populate data
                            }
                        }
                    }
                } //loopEles

        }
        catch (err) {
            tmp = null;
            this.onException(err);
        }
        return tmp;
    }; // getFormItemValues
    //endregion

    /**
     * commit
     */
    //region
    this.commitFormValues = function() {
        var sIdVar = "";
        var param = "";
        var tmp = {};
        var oFilter = {};
        var i = 0;

        tmp = this.getFormItemValues();

        if (tmp) {
            //TODO: unique, insert or update procedure

            // insert
            if (!isEmpty(self.sSqlInsert)) {
                sIdVar = this.sSqlInsert;
            }

            // update
            if (!isEmpty(self.sSqlUpdate)) {
                sIdVar = this.sSqlUpdate;
            }

            if (!isEmpty(sIdVar)) {
                //
                // if a filter is set, I took for each aColFilter his value
                if (self.oFormParam && self.oFormParam.aColFilter) {
                    loopColFilter: for (i = 0; i < self.oFormParam.aColFilter.length; i++) {
                            oFilter[self.oFormParam.aColFilter[i]] = this.manager.connection1.getValueByColName(
                                self.oFormParam,
                                0,
                                self.oFormParam.aColFilter[i]
                            );
                        } //loopColFilter
                } // end build filter

                //
                param = mergeArray(tmp, oFilter);
                // param = tmp;
                param.idvar = sIdVar;
                param.id_form = this.sIdForm;

                param = btoa(JSON.stringify(param));
                this.manager.connection1.callHttpRequest(param, function(d) {
                    var jsonData = JSON.parse(d);
                    // show message
                    self.manager.frmMain1.showMessage(jsonData);
                });
            }
        }

        //
        postCommitFormValues(this);
    }; //commitFormValues
    //endregion

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
        this.oProperties = v;
        //
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

        //
        this.refreshWindow();
        //
        this.refreshWindowTitle();
    }; // setProperties

    //create
    this.create(sParent, sName);

}; //oFormGeneric
