/*
 * oGrid
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-23 17:12:37
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oGrid = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oGrid"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";
    this.iSequence = 0;
    this.sSqlFill = "";

    this.aData = [];
    this.aFields = [];

    this._iCountIncludes = 0;
    this.aIncludes = [];

    // this.iRow = 1;
    // this.iCol = 1;

    this.iMaxRow = 0;
    this.iMaxCol = 0;

    this.iRowHeight = 14;
    this.aSelected = [];
    this.iRowSelect = 1;
    this.iMulti = 0;

    this.sColorSelected = "";
    this.sColorSelectedText = "black";

    this.iShowRowHeadings = 1;
    this.iShowColHeadings = 1;
    this.aColNames = [];

    this.aColFilter = []; // key columns, master key columns, primary keys, unique keys
    // this.aColFilter = ["id"];
    this.sColFilterString = "";

    this.aColVisible = [];
    this.sColVisibleString = "";

    this.evRowClickCb = null;

    this.sFloat = "";
    this.sClear = "both";
    this.sBackground = "";

    this.sDataset = "";
    this.sRowClickForm = "";

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.setParent(sParent);
        this.setName(sName);

        this.setColNames([" ", " "]);
        this.setData([
            [" ", " "]
        ]);

        //
        this.createHtmlElement();

        this.sColorSelected = themeCurrent.grid_selected;
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
        this.refresh();
        // this.eleHTML.style.width = this.sWidth;
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
        this.refresh();
        // this.eleHTML.style.height = this.sHeight;
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
            if (!isNull(ele)) {
                ele.removeChild(this.eleHTML);
            }

            for (var property in this) {
                if (this.hasOwnProperty(property)) {
                    if (property.startsWith("tmr")) {
                        // by convention tmr is timer or
                        clearInterval(this[property]);
                        clearTimeout(this[property]);
                        continue;
                    }
                    if ((property !== "_owner") && (property !== "manager")) {
                        if (!isNull(this[property])) {
                            if (!isNull(this[property]) && !isUndefined(this[property].destroy)) {
                                this[property].destroy();
                                this[property] = null;
                                this[property] = undefined;
                                delete this[property];
                            }
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
     * updateColFilter description
     */
    this.updateColFilter = function() {
        try {
            if (this.sColFilterString !== "") {
                var spl = this.sColFilterString.split(",");
                this.aColFilter = spl;
            }
        } catch (err) {
            this.onException(err);
        }
    }; // updateColFilter

    /**
     * updateColVisible description
     */
    this.updateColVisible = function() {
        try {
            if (this.sColVisibleString !== "") {
                var spl = this.sColVisibleString.split(",");
                this.aColVisible = spl;
            }
        } catch (err) {
            this.onException(err);
        }
    }; // updateColVisible

    /**
     * isColVisible description
     */
    this.isColVisible = function(v) {
        try {
            var sColCurrent = this.aColNames[v];
            sColCurrent = sColCurrent.trim();
            return (this.aColVisible.indexOf(sColCurrent) > -1) || (sColCurrent === "");
        } catch (err) {
            this.onException(err);
        }

        return false;
    }; // isColVisible

    /**
     * refresh description
     */
    this.refresh = function() {
        try {
            if (isUndefined(this.aData[0])) {
                return;
            }

            if (!this.eleHTML) {
                return;
            }

            //
            this.updateColFilter();

            //
            this.updateColVisible();

            //
            this.eleHTML.innerHTML = "";
            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.getFloat());
            setCssProperty(this.eleHTML, "clear", this.getClear());
            setCssProperty(this.eleHTML, "background", this.getBackground());

            var sHtml = "";
            var i = 0;
            var j = 0;
            var sCellWidthFirst = "5%";
            var sRowHeight = this.iRowHeight + "px";
            var iCellNum = (StrToInt(this.iMaxCol) === 0) ? this.aData[0].length : this.iMaxCol;
            var sCellWidth = ((this.iShowRowHeadings > 0) ? 95 : 100) / iCellNum + "%";
            var sCellStyle = "width: " + sCellWidth + "; height: " + sRowHeight + "; float: left;";

            sHtml += "<div id=\"" + this.getName() + "_Grid\" class=\"oGridGrid\"";
            sHtml += " style=\"width: 100%; height: 100%; overflow: auto; cursor: pointer;\"";
            sHtml += ">";

            loopData: for (i = 0; i < this.aData.length; i++) {
                    // a max row is set..
                    if (this.iMaxRow > 0) {
                        if (i >= this.iMaxRow) {
                            break;
                        }
                    }
                    if (i === 0) {
                        if (this.iShowColHeadings > 0) {
                            sHtml += "<div class=\"oGridRow\" style=\"height: " + sRowHeight + "; width: 100%; clear: both;\" irow=\"" + i + "\">";

                            loopCol: for (j = 0; j < this.aData[i].length; j++) {
                                    // a max column is set..
                                    if (this.iMaxCol > 0) {
                                        if (j >= this.iMaxCol) {
                                            break loopCol;
                                        }
                                    }

                                    if (j === 0) {
                                        if (this.iShowRowHeadings > 0) {
                                            sHtml += "<div style=\"float: left; width: " + sCellWidthFirst + "; background: #DDDDDD; border-bottom: 1px solid #DDDDDD;\">&nbsp;</div>";
                                        }
                                    }

                                    if (!(this.aColNames[j])) {
                                        this.aColNames[j] = "";
                                    }

                                    // isColVisible
                                    if (this.sColVisibleString !== "") {
                                        if (!this.isColVisible(j)) {
                                            continue;
                                        }
                                    } //isColVisible

                                    sHtml += "<div style=\"" + sCellStyle + " background: #DDDDDD;\" irow=\"" + i + "\" icol=\"" + j + "\">" + (this.aColNames[j]) + "</div>";
                                } // loopCol

                            sHtml += "</div>";
                        }
                    }

                    sHtml += "<div id=\"" + this.getName() + "_Grid_Row_" + i + "\" class=\"oGridRow\" style=\"height: " + sRowHeight + "; border-bottom: 1px solid #DDDDDD; width: 100%; clear: both; overflow: hidden;\" irow=\"" + i + "\">";

                    loopCol: for (j = 0; j < this.aData[i].length; j++) {
                            // a max column is set..
                            if (this.iMaxCol > 0) {
                                if (j >= this.iMaxCol) {
                                    break loopCol;
                                }
                            }

                            // show headings
                            if (j === 0) {
                                if (this.iShowRowHeadings > 0) {
                                    sHtml += "<div style=\"float: left; width: " + sCellWidthFirst + "; background: #DDD; border-bottom: 1px solid #DDDDDD; overflow: hidden;\">" + i + "</div>";
                                }
                            } //

                            // isColVisible
                            if (this.sColVisibleString !== "") {
                                if (!this.isColVisible(j)) {
                                    continue;
                                }
                            } //isColVisible

                            sHtml += "<div id=\"" + this.getName() + "_Grid_Row_" + i + "_" + j + "\" style=\"" + sCellStyle + "\" irow=\"" + i + "\" icol=\"" + j + "\">";
                            sHtml += this.aData[i][j];
                            sHtml += "</div>";
                        } // loopCol

                    sHtml += "</div>";// row

                    // row child
                    // sHtml += "<div id=\"" + this.getName() + "_Grid_Row_" + i + "_child\">child";
                    // sHtml += "</div>";// secondary div




                } // loopData

            sHtml += "</div>";

            this.eleHTML.innerHTML = sHtml;

            this.setEvents();
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
    // this.startResizable = function() {
    //     try {
    //         var pressed = false;
    //         var start;
    //         var startX, startWidth;

    //         $("#" + this.getName() + " table th").mousedown(function(e) {

    //             start = $(this);
    //             pressed = true;
    //             startX = e.pageX;
    //             startWidth = $(this).width();
    //         });

    //         $(document).mousemove(function(e) {
    //             if (pressed) {
    //                 $(start).width(startWidth + (e.pageX - startX));
    //             }
    //         });

    //         $(document).mouseup(function() {
    //             if (pressed) {
    //                 pressed = false;
    //             }
    //         });
    //     } catch (err) {
    //         this.onException(err);
    //     }
    // }; // startResizable

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
     * get value
     */
    this.getValue = function() {
        var tmp = {
            aColNames: self.aColNames,
            aRows: [self.aData[self.aSelected[0]]],
            aColFilter: self.aColFilter
        };

        return tmp;
    }; //getValue

    /**
     * evRowClick description
     */
    this.evRowClick = function(e) {
        try {
            //console.log(e, "row click");

            var irow = e.target.getAttribute("irow");
            self.addSelected(irow);

            //
            if (self.evRowClickCb !== null) {
                self.evRowClickCb(irow);
            }

            // open form on click
            if (self.sRowClickForm !== "") {
                if(self._owner && self._owner._owner) {
                   self._owner._owner.doCreateForm(self.sRowClickForm, self);
                }
            }

        } catch (err) {
            self.onException(err);
        }
    }; // evRowClick

    /**
     * evCellClick description
     */
    this.evCellClick = function(e) {
        try {
            // console.log(e, "cell click");

            // var irow = e.target.getAttribute("irow");
            // var icol = e.target.getAttribute("icol");

        } catch (err) {
            self.onException(err);
        }
    }; // evCellClick

    /**
     * add selected value
     */
    this.addSelected = function(v) {
        var iS = 0;
        var teleRow = null;
        var aTmp = [];

        // check if item is already present in selected array
        var isPresent = function(num) {
            var ii = 0;
            for (ii = 0; ii < self.aSelected.length; ii++) {
                if (num === self.aSelected[ii]) {
                    return ii;
                }
            }

            return -1;
        };

        // clear by position in array selected
        var clearByPos = function(pos) {
            if (!isUndefined(self.aSelected[pos])) {
                teleRow = document.getElementById(self.getName() + "_Grid_Row_" + self.aSelected[pos]);
                if (!isNull(teleRow)) {
                    teleRow.style.background = "";
                    teleRow.style.color = "";
                }
            }
        };

        var iFoundPos = isPresent(v);
        if (iFoundPos < 0) {
            // not found
            if (self.iMulti > 0) {
                // is multi...
                self.aSelected.push(v);
            } else {
                // is not multi
                clearByPos(0);
                self.aSelected[0] = v;
            }
        } else {
            // found... remove!
            clearByPos(iFoundPos);
            aTmp = [];
            for (iS = 0; iS < self.aSelected.length; iS++) {
                if (iS === iFoundPos) {
                    continue;
                }
                aTmp.push(self.aSelected[iS]);
            }

            self.aSelected = aTmp;
            aTmp = null;
        }
        // console.log(self.aSelected);

        for (iS = 0; iS < self.aSelected.length; iS++) {
            teleRow = document.getElementById(this.getName() + "_Grid_Row_" + self.aSelected[iS]);

            if (!isNull(teleRow)) {
                teleRow.style.background = self.sColorSelected;
                teleRow.style.color = self.sColorSelectedText;
            }
        }
    }; //addSelected

    /**
     * setEvents description
     */
    this.setEvents = function() {
        try {
            var i = 0;
            var j = 0;

            var teleRow = null;
            var teleCell = null;
            loopData: for (i = 0; i < this.aData.length; i++) {
                    teleRow = document.getElementById(this.getName() + "_Grid_Row_" + i);
                    teleRow.onclick = this.evRowClick;

                    if (this.iRowSelect === 0) {
                        loopCol: for (j = 0; j < this.aData[i].length; j++) {
                            teleCell = document.getElementById(this.getName() + "_Grid_Row_" + i + "_" + j);
                            teleCell.onclick = this.evCellClick;
                        }
                    }
                } //loopData

        } catch (err) {
            this.onException(err);
        }
    }; // setEvents

    /**
     * getter for RowHeight
     */
    this.getRowHeight = function() {
        return this.iRowHeight;
    }; // getRowHeight

    /**
     * setter for RowHeight
     */
    this.setRowHeight = function(v) {
        this.iRowHeight = v;
    }; // setRowHeight

    /**
     * getter for ColNames
     */
    this.getColNames = function() {
        return this.aColNames;
    }; // getColNames

    /**
     * setter for ColNames
     */
    this.setColNames = function(v) {
        this.aColNames = v;
    }; // setColNames

    /**
     * getter for ColFilter
     */
    this.getColFilter = function() {
        return this.aColFilter;
    }; // getColFilter

    /**
     * setter for ColFilter
     */
    this.setColFilter = function(v) {
        this.aColFilter = v;
        this.refresh();
    }; // setColFilter

    /**
     * getter for ColFilterString
     */
    this.getColFilterString = function() {
        return this.sColFilterString;
    }; // getColFilterString

    /**
     * setter for ColFilterString
     */
    this.setColFilterString = function(v) {
        this.sColFilterString = v;
        this.refresh();
    }; // setColFilterString

    /**
     * getter for ColVisible
     */
    this.getColVisible = function() {
        return this.aColVisible;
    }; // getColVisible

    /**
     * setter for ColVisible
     */
    this.setColVisible = function(v) {
        this.aColVisible = v;
        this.refresh();
    }; // setColVisible

    /**
     * getter for ColVisibleString
     */
    this.getColVisibleString = function() {
        return this.sColVisibleString;
    }; // getColVisibleString

    /**
     * setter for ColVisibleString
     */
    this.setColVisibleString = function(v) {
        this.sColVisibleString = v;
        this.refresh();
    }; // setColVisibleString

    /**
     * getter for ShowRowHeadings
     */
    this.getShowRowHeadings = function() {
        return this.iShowRowHeadings;
    }; // getShowRowHeadings

    /**
     * setter for ShowRowHeadings
     */
    this.setShowRowHeadings = function(v) {
        this.iShowRowHeadings = v;
    }; // setShowRowHeadings

    /**
     * getter for ShowColHeadings
     */
    this.getShowColHeadings = function() {
        return this.iShowColHeadings;
    }; // getShowColHeadings

    /**
     * setter for ShowColHeadings
     */
    this.setShowColHeadings = function(v) {
        this.iShowColHeadings = v;
    }; // setShowColHeadings

    /**
     * getter for Multi
     */
    this.getMulti = function() {
        return this.iMulti;
    }; // getMulti

    /**
     * setter for Multi
     */
    this.setMulti = function(v) {
        this.iMulti = v;
    }; // setMulti

    this.setEvRowClickCb = function(v) {
        this.evRowClickCb = v;
    }; //setEvRowClickCb

    /**
     * getter for maxRow
     */
    this.getMaxRow = function() {
        return this.iMaxRow;
    }; // getMaxRow

    /**
     * setter for maxRow
     */
    this.setMaxRow = function(v) {
        this.iMaxRow = v;
    }; // setMaxRow

    /**
     * getter for maxCol
     */
    this.getMaxCol = function() {
        return this.iMaxCol;
    }; // getMaxCol

    /**
     * setter for maxCol
     */
    this.setMaxCol = function(v) {
        this.iMaxCol = v;
    }; // setMaxCol

    /**
     * getter for Float
     */
    this.getFloat = function() {
        return this.sFloat;
    }; // getFloat

    /**
     * setter for Float
     */
    this.setFloat = function(v) {
        this.sFloat = v;
        this.refresh();
    }; // setFloat

    /**
     * getter for Clear
     */
    this.getClear = function() {
        return this.sClear;
    }; // getClear

    /**
     * setter for Clear
     */
    this.setClear = function(v) {
        this.sClear = v;
        this.refresh();
    }; // setClear

    /**
     * find value in grid
     */
    this.find = function(v) {
        try {
            var iR;
            var rs = [];

            if (self.aData) {
                loopRows: for (iR = 0; iR < self.aData.length; iR++) {
                        if (v === (self.aData[iR][0])) {
                            rs.push(self.aData[iR]);
                        }
                    } //loopRows
            }

            return rs;
        } catch (err) {
            this.onException(err);
        }

    }; // find

    /**
     * getter for Sequence
     */
    this.getSequence = function() {
        return this.iSequence;
    }; // getSequence

    /**
     * setter for Sequence
     */
    this.setSequence = function(v) {
        this.iSequence = v;
    }; // setSequence

    /**
     * getter for Dataset
     */
    this.getDataset = function() {
        return this.sDataset;
    }; // getDataset

    /**
     * setter for Dataset
     */
    this.setDataset = function(v) {
        this.sDataset = v;
    }; // setDataset

    /**
     * getter for SqlFill
     */
    this.getSqlFill = function() {
        return this.sSqlFill;
    }; // getSqlfill

    /**
     * setter for SqlFill
     */
    this.setSqlFill = function(v) {
        this.sSqlFill = v;
    }; // setSqlfill
    /**
     * getter for RowClickForm
     */
    this.getRowClickForm = function() {
        return this.sRowClickForm;
    }; // getRowClickForm

    /**
     * setter for RowClickForm
     */
    this.setRowClickForm = function(v) {
        this.sRowClickForm = v;
    }; // setRowClickForm

    /**
     * getter for Background
     */
    this.getBackground = function() {
        return this.sBackground;
    }; // getBackground

    /**
     * setter for Background
     */
    this.setBackground = function(v) {
        this.sBackground = v;
        this.refresh();
    }; // setBackground

    /**
     * get object properties
     */
    this.getProperties = function() {
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
    }; //getProperties

    /**
     * set object properties
     */
    this.setProperties = function(v) {
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
        self.refresh();
    }; //setProperties

    /**
     * populate data from a sqlfill
     */
    this.populateData = function(d) {
        var getValueByColName = function(obj, irow, sColName) {
            var i = 0;
            var iFound = -1;
            for (i = 0; i < obj.aColNames.length; i++) {
                if (obj.aColNames[i] === sColName) {
                    iFound = i;
                    break;
                }
            }

            if (iFound > -1) {
                return obj.aRows[irow][iFound];
            }

            return "";
        }; //getValueByColName

        try {
            var jsonData = JSON.parse(d);
            if (!jsonData.aRes) {
                return;
            }
            // console.log(jsonData);
            // map the received data and populate component

            self.setColNames(jsonData.aRes[0].aColNames);
            self.setData(jsonData.aRes[0].aRows);
        } catch (err) {
            this.onException(err);
        }
    }; // populateData

    //create
    this.create(sParent, sName);

}; //oGrid

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oGrid = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oGrid(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setHeight("40px");

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oGrid
/**
 * END DESIGN TIME
 */
