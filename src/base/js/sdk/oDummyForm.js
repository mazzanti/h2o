/*
 * oDummyForm
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-18 22:41:06
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oDummyForm = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oDummyForm"; // tag
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
    this.oProperties = null;

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

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

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
};// getOnSave

/**
 * setter for OnSave
 */
this.setOnSave = function(v) {
    this.sOnSave = v;
};// setOnSave

/**
 * getter for OnBack
 */
this.getOnBack = function() {
    return this.sOnBack;
};// getOnBack

/**
 * setter for OnBack
 */
this.setOnBack = function(v) {
    this.sOnBack = v;
};// setOnBack

/**
 * getter for OnCancel
 */
this.getOnCancel = function() {
    return this.sOnCancel;
};// getOnCancel

/**
 * setter for OnCancel
 */
this.setOnCancel = function(v) {
    this.sOnCancel = v;
};// setOnCancel

/**
 * getter for OnDelete
 */
this.getOnDelete = function() {
    return this.sOnDelete;
};// getOnDelete

/**
 * setter for OnDelete
 */
this.setOnDelete = function(v) {
    this.sOnDelete = v;
};// setOnDelete

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
            self.setWidth("100%");
            self.setHeight("100%");
            //
            self.manager.hideMainMenu();
        } else {
            // POPUP

            // self.setWidth("");
            // self.setHeight("");
            self.setMaxHeight((window.innerHeight - 100) + "px");

            // centered
            self.eleHTML.style.position = "absolute";
            self.eleHTML.style.zIndex = "1";
            self.eleHTML.style.top = "50px";
            self.eleHTML.style.left = "50px";
            // self.eleHTML.style.margin = "-" + (self.eleHTML.clientHeight / 2) + "px 0 0 -" + (self.eleHTML.clientWidth / 2) + "px";
            // self.eleHTML.style.resize = "both";
            // self.eleHTML.style.overflow = "auto";

            this.eleHTML.style.width = "900px";
            this.eleHTML.style.height = "500px";
            this.eleHTML.style.left = "50px";
            this.eleHTML.style.top = "50px";
            this.eleHTML.style.zIndex = 1;

        }
    }; // setMode

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
            this.pnlBody.setHeight((this.eleHTML.clientHeight - this.pnlHeader.eleHTML.clientHeight) + "px");
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


        } catch (err) {
            this.onException(err);
        }
    }; // refresh

    /**
     * drawHeader description
     */
    this.drawHeader = function() {
        try {

            this.pnlHeader = new nsNessuno.oPanel(self.getName(), self.getChildName("pnlHeader"));
            this.pnlHeader.setHeight(this.aHeights[0] + "px");
            this.pnlHeader.eleHTML.style.background = themeCurrent.titlebar_active;
            this.pnlHeader.eleHTML.style.color = "#FFFFFF";
            this.pnlHeader.eleHTML.style.borderTopLeftRadius = "5px";
            this.pnlHeader.eleHTML.style.borderTopRightRadius = "5px";

            this.pnlHeaderLeft = new nsNessuno.oPanel(self.pnlHeader.getName(), self.getChildName("pnlHeaderLeft"));
            this.pnlHeaderLeft.setFloat("left");
            this.pnlHeaderLeft.setWidth("80%");
            this.pnlHeaderLeft.eleHTML.innerHTML = "<b>" + this.getCaption() + "</b>";
            this.pnlHeaderLeft.eleHTML.style.cursor = "move";
            this.pnlHeaderLeft.eleHTML.style.padding = "5px";

            this.pnlHeaderRight = new nsNessuno.oPanel(self.pnlHeader.getName(), self.getChildName("pnlHeaderRight"));
            this.pnlHeaderRight.setFloat("left");
            this.pnlHeaderRight.setWidth("20%");

            this.imgTitleButtons = new nsNessuno.oImg(self.pnlHeaderRight.getName(), self.getChildName("imgTitleButtons"));
            this.imgTitleButtons.setValue(themeCurrent.titlebar_active_buttons);
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

    //create
    this.create(sParent, sName);

}; //oDummyForm
