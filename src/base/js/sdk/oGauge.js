/*
 * oGauge
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:27
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oGauge = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oGauge"; // tag
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

    this.tmrIntervalDemo = null;

    this.sLabel = "";
    this.iValue = 0;
    this.iMin = 0;
    this.iMax = 100;
    this.iSize = 100;
    this.sFloat = "";
    this.sClear = "both";

    function Gauge(placeholderName, configuration) {
        this.placeholderName = placeholderName;

        var self = this; // for internal d3 functions

        this.configure = function(configuration) {
            this.config = configuration;

            this.config.size = this.config.size * 1;
            // this.config.size = this.config.size * 0.9;

            this.config.radius = this.config.size * 0.97 / 2;
            this.config.cx = this.config.size / 2;
            this.config.cy = this.config.size / 2;

            this.config.min = undefined !== configuration.min ? configuration.min : 0;
            this.config.max = undefined !== configuration.max ? configuration.max : 100;
            this.config.range = this.config.max - this.config.min;

            this.config.majorTicks = configuration.majorTicks || 5;
            this.config.minorTicks = configuration.minorTicks || 2;

            this.config.greenColor = configuration.greenColor || "#109618";
            this.config.yellowColor = configuration.yellowColor || "#FF9900";
            this.config.redColor = configuration.redColor || "#DC3912";

            this.config.transitionDuration = configuration.transitionDuration || 500;
        };

        this.render = function() {
            var index, fontSize, point1, point2;
            this.body = d3.select("#" + this.placeholderName)
                .append("svg:svg")
                .attr("class", "gauge")
                .attr("width", this.config.size)
                .attr("height", this.config.size);

            this.body.append("svg:circle")
                .attr("cx", this.config.cx)
                .attr("cy", this.config.cy)
                .attr("r", this.config.radius)
                .style("fill", "#ccc")
                .style("stroke", "#000")
                .style("stroke-width", "0.5px");

            this.body.append("svg:circle")
                .attr("cx", this.config.cx)
                .attr("cy", this.config.cy)
                .attr("r", 0.9 * this.config.radius)
                .style("fill", "#fff")
                .style("stroke", "#e0e0e0")
                .style("stroke-width", "2px");

            for (index in this.config.greenZones) {
                this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
            }

            for (index in this.config.yellowZones) {
                this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
            }

            for (index in this.config.redZones) {
                this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
            }

            if (undefined !== this.config.label) {
                fontSize = Math.round(this.config.size / 9);
                this.body.append("svg:text")
                    .attr("x", this.config.cx)
                    .attr("y", this.config.cy / 2 + fontSize / 2)
                    .attr("dy", fontSize / 2)
                    .attr("text-anchor", "middle")
                    .text(this.config.label)
                    .style("font-size", fontSize + "px")
                    .style("fill", "#333")
                    .style("stroke-width", "0px");
            }

            fontSize = Math.round(this.config.size / 16);
            var majorDelta = this.config.range / (this.config.majorTicks - 1);
            for (var major = this.config.min; major <= this.config.max; major += majorDelta) {
                var minorDelta = majorDelta / this.config.minorTicks;
                for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta) {
                    point1 = this.valueToPoint(minor, 0.75);
                    point2 = this.valueToPoint(minor, 0.85);

                    this.body.append("svg:line")
                        .attr("x1", point1.x)
                        .attr("y1", point1.y)
                        .attr("x2", point2.x)
                        .attr("y2", point2.y)
                        .style("stroke", "#666")
                        .style("stroke-width", "1px");
                }

                point1 = this.valueToPoint(major, 0.7);
                point2 = this.valueToPoint(major, 0.85);

                this.body.append("svg:line")
                    .attr("x1", point1.x)
                    .attr("y1", point1.y)
                    .attr("x2", point2.x)
                    .attr("y2", point2.y)
                    .style("stroke", "#333")
                    .style("stroke-width", "2px");

                if (major == this.config.min || major == this.config.max) {
                    var point = this.valueToPoint(major, 0.63);

                    this.body.append("svg:text")
                        .attr("x", point.x)
                        .attr("y", point.y)
                        .attr("dy", fontSize / 3)
                        .attr("text-anchor", major == this.config.min ? "start" : "end")
                        .text(major)
                        .style("font-size", fontSize + "px")
                        .style("fill", "#333")
                        .style("stroke-width", "0px");
                }
            }

            var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");

            var midValue = (this.config.min + this.config.max) / 2;

            var pointerPath = this.buildPointerPath(midValue);

            var pointerLine = d3.svg.line()
                .x(function(d) {
                    return d.x;
                })
                .y(function(d) {
                    return d.y;
                })
                .interpolate("basis");

            pointerContainer.selectAll("path")
                .data([pointerPath])
                .enter()
                .append("svg:path")
                .attr("d", pointerLine)
                .style("fill", "#dc3912")
                .style("stroke", "#c63310")
                .style("fill-opacity", 0.7);

            pointerContainer.append("svg:circle")
                .attr("cx", this.config.cx)
                .attr("cy", this.config.cy)
                .attr("r", 0.12 * this.config.radius)
                .style("fill", "#4684EE")
                .style("stroke", "#666")
                .style("opacity", 1);

            fontSize = Math.round(this.config.size / 10);
            pointerContainer.selectAll("text")
                .data([midValue])
                .enter()
                .append("svg:text")
                .attr("x", this.config.cx)
                .attr("y", this.config.size - this.config.cy / 4 - fontSize)
                .attr("dy", fontSize / 2)
                .attr("text-anchor", "middle")
                .style("font-size", fontSize + "px")
                .style("fill", "#000")
                .style("stroke-width", "0px");

            this.redraw(this.config.min, 0);
        };

        this.buildPointerPath = function(value) {
            var delta = this.config.range / 13;

            var head = valueToPoint(value, 0.85);
            var head1 = valueToPoint(value - delta, 0.12);
            var head2 = valueToPoint(value + delta, 0.12);

            var tailValue = value - (this.config.range * (1 / (270 / 360)) / 2);
            var tail = valueToPoint(tailValue, 0.28);
            var tail1 = valueToPoint(tailValue - delta, 0.12);
            var tail2 = valueToPoint(tailValue + delta, 0.12);

            return [head, head1, tail2, tail, tail1, head2, head];

            function valueToPoint(value, factor) {
                var point = self.valueToPoint(value, factor);
                point.x -= self.config.cx;
                point.y -= self.config.cy;
                return point;
            }
        };

        this.drawBand = function(start, end, color) {
            if (0 >= end - start) return;

            this.body.append("svg:path")
                .style("fill", color)
                .attr("d", d3.svg.arc()
                    .startAngle(this.valueToRadians(start))
                    .endAngle(this.valueToRadians(end))
                    .innerRadius(0.65 * this.config.radius)
                    .outerRadius(0.85 * this.config.radius))
                .attr("transform", function() {
                    return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)";
                });
        };

        this.redraw = function(value, transitionDuration) {
            var pointerContainer = this.body.select(".pointerContainer");

            pointerContainer.selectAll("text").text(Math.round(value));

            var pointer = pointerContainer.selectAll("path");
            pointer.transition()
                .duration(undefined !== transitionDuration ? transitionDuration : this.config.transitionDuration)
                //.delay(0)
                //.ease("linear")
                //.attr("transform", function(d)
                .attrTween("transform", function() {
                    var pointerValue = value;
                    if (value > self.config.max) pointerValue = self.config.max + 0.02 * self.config.range;
                    else if (value < self.config.min) pointerValue = self.config.min - 0.02 * self.config.range;
                    var targetRotation = (self.valueToDegrees(pointerValue) - 90);
                    var currentRotation = self._currentRotation || targetRotation;
                    self._currentRotation = targetRotation;

                    return function(step) {
                        var rotation = currentRotation + (targetRotation - currentRotation) * step;
                        return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")";
                    };
                });
        };

        this.valueToDegrees = function(value) {
            // thanks @closealert
            //return value / this.config.range * 270 - 45;
            return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
        };

        this.valueToRadians = function(value) {
            return this.valueToDegrees(value) * Math.PI / 180;
        };

        this.valueToPoint = function(value, factor) {
            return {
                x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
                y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value))
            };
        };

        // initialization
        this.configure(configuration);
    } //Gauge

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
     * getter for Value
     */
    this.getValue = function() {
        return this.iValue;
    }; // getValue

    /**
     * setter for Value
     */
    this.setValue = function(v) {
        v = (!isNaN(parseInt(v))) ? v : 0;

        self.iValue = v;
        this.refresh();
        // self.myGauge.redraw(self.iValue);
    }; // setValue

    /**
     * getter for Label
     */
    this.getLabel = function() {
        return this.sLabel;
    }; // getLabel

    /**
     * setter for Label
     */
    this.setLabel = function(v) {
        this.sLabel = v;
        this.refresh();
    }; // setLabel

    /**
     * getter for Min
     */
    this.getMin = function() {
        return this.iMin;
    }; // getMin

    /**
     * setter for Min
     */
    this.setMin = function(v) {
        this.iMin = v;
    }; // setMin

    /**
     * getter for Max
     */
    this.getMax = function() {
        return this.iMax;
    }; // getMax

    /**
     * setter for Max
     */
    this.setMax = function(v) {
        this.iMax = v;
    }; // setMax

    /**
     * getter for Size
     */
    this.getSize = function() {
        return this.iSize;
    }; // getSize

    /**
     * setter for Size
     */
    this.setSize = function(v) {
        this.iSize = v;
    }; // setSize

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
    }; //setHeight

    /**
     * get height
     */
    this.getHeight = function() {
        return this.sHeight;
    }; //getHeight

    /**
     * set Float
     */
    this.setFloat = function(v) {
        this.sFloat = v;
        setCssProperty(this.eleHTML, "float", this.getFloat());
    }; //setFloat

    /**
     * get Float
     */
    this.getFloat = function() {
        return this.sFloat;
    }; //getFloat

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
     * on exception
     */
    this.onException = function(e) {
        console.log(e.stack);
    }; // onException

    /**
     * getter for SqlFill
     */
    this.getSqlFill = function() {
        return this.sSqlFill;
    }; // getSqlFill

    /**
     * setter for SqlFill
     */
    this.setSqlFill = function(v) {
        this.sSqlFill = v;
    }; // setSqlFill

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
     * refresh
     * @return {[type]} [description]
     */
    this.draw = function() {
        this.iSize = document.getElementById(this.getName()).clientWidth;

        var config = {
            size: this.iSize,
            label: this.sLabel,
            min: undefined !== this.iMin ? this.iMin : 0,
            max: undefined !== this.iMax ? this.iMax : 100,
            minorTicks: 5
        };

        var range = config.max - config.min;
        config.yellowZones = [{
            from: config.min + range * 0.75,
            to: config.min + range * 0.9
        }];
        config.redZones = [{
            from: config.min + range * 0.9,
            to: config.max
        }];

        this.myGauge = new Gauge(this.getName(), config);
        // this.myGauge = new Gauge(this.getName() + "_Container", config);
        this.myGauge.render();

        self.myGauge.redraw(self.iValue);
    }; //refresh

    /**
     * start demonstration
     */
    this.startDemo = function() {
        function updateValues() {
            self.setValue(getRandomValue(self.myGauge));
            // self.myGauge.redraw(value);
        }

        function getRandomValue(gauge) {
            var overflow = 0; //10;
            return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow * 2) * Math.random();
        }

        clearInterval(this.tmrIntervalDemo);
        this.tmrIntervalDemo = setInterval(updateValues, 3000);
    }; // startDemo

    /**
     * refresh
     */
    this.refresh = function() {
        this.eleHTML.innerHTML = "";
        // set properties...
        setCssProperty(this.eleHTML, "width", this.getWidth());
        setCssProperty(this.eleHTML, "height", this.getHeight());
        setCssProperty(this.eleHTML, "float", this.getFloat());
        setCssProperty(this.eleHTML, "clear", this.getClear());
        this.draw();
    }; //refresh

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
            var sValue = "";
            var sCaption = "";
            var jsonData = JSON.parse(d);
            if (!jsonData.aRes) {
                return;
            }
            // console.log(jsonData);
            // map the received data and populate component
            sValue = getValueByColName(jsonData.aRes[0], 0, "sValue");
            // sCaption = getValueByColName(jsonData.aRes[0], 0, "sCaption");

            self.setValue(sValue);
            // self.setCaption(sCaption);
        } catch (err) {
            this.onException(err);
        }
    }; // populateData

    //create
    this.create(sParent, sName);

}; //oGauge

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oGauge = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();
    self.pnlContentDesigner[iDi] = new nsNessuno.oGauge(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setWidth("100px");
    self.pnlContentDesigner[iDi].setHeight("100px");
    self.pnlContentDesigner[iDi].setFloat("left");
    self.pnlContentDesigner[iDi].setLabel("CPU");
    self.pnlContentDesigner[iDi].setMin(0);
    self.pnlContentDesigner[iDi].setMax(100);
    self.pnlContentDesigner[iDi].setValue(10);


    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oGauge
/**
 * END DESIGN TIME
 */
