/*
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Date:   2016-02-10 20:11:13
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:23
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oRadialProgress = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oRadialProgress";
    this.sName = "";
    this.sParent = "";
    this.eleHTML = null;
    this._owner = null;
    this.iSequence = 0;
    this.sSqlFill = "";

    this.sWidth = "100%";
    this.sHeight = "100%";

    this.sFloat = "";
    this.sClear = "both";

    this.iIntervalRadial = 5000;
    this.tmrIntervalRadial = null;

    this.iArcAngle = 300;
    this.iRotationAngle = 0;
    this.iLabelNum = 10;
    this.iMin = 0;
    this.iMax = 100;
    this.iValue = 0;
    this.sCaption = "";

    this.aColors = {
        blue: "#3791ED",
        orange: "#FF9900"
    };
    this.sColorProgress = "#3791ED";
    this.sColorLabels = "#DDDDDD";

    /**
     * create function
     */
    this.create = function(sParent, sName) {
        this.sName = sName;
        this.sParent = sParent;

        this.createHtmlElement();
    }; // create

    this.setName = function(v) {
        this.sName = v;
    }; //setName

    this.getName = function() {
        return this.sName;
    }; //getName

    this.setParent = function(v) {
        this.sParent = v;
    }; //setParent

    this.getParent = function() {
        return this.sParent;
    }; //getParent

    this.setWidth = function(v) {
        this.sWidth = v;
        setCssProperty(this.eleHTML, "width", this.getWidth());
    }; //setWidth
    this.getWidth = function() {
        return this.sWidth;
    }; //getWidth

    this.setHeight = function(v) {
        this.sHeight = v;
        setCssProperty(this.eleHTML, "height", this.getHeight());
    }; //setHeight

    this.getHeight = function() {
        return this.sHeight;
    }; //getHeight

    this.setIntervalRadial = function(v) {
        this.iIntervalRadial = v;
    }; //setIntervalRadial

    this.getIntervalRadial = function() {
        return this.iIntervalRadial;
    }; //getIntervalRadial

    this.setValue = function(v) {
        this.iValue = v;
        this.refresh();
    }; //setValue

    this.getValue = function() {
        return this.iValue;
    }; //getValue

    this.setMin = function(v) {
        this.iMin = v;
    }; //setMin

    this.getMin = function() {
        return this.iMin;
    }; //getMin

    this.setMax = function(v) {
        this.iMax = v;
    }; //setMax

    this.getMax = function() {
        return this.iMax;
    }; //getMax

    this.setCaption = function(v) {
        this.sCaption = v;
        this.refresh();
    }; //setCaption

    this.getCaption = function() {
        return this.sCaption;
    }; //getCaption

    this.setFloat = function(v) {
        this.sFloat = v;
        this.refresh();
    }; //setFloat

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
     * getter for ArcAngle
     */
    this.getArcAngle = function() {
        return this.iArcAngle;
    }; // getArcAngle

    /**
     * setter for ArcAngle
     */
    this.setArcAngle = function(v) {
        this.iArcAngle = v;
    }; // setArcAngle

    /**
     * getter for RotationAngle
     */
    this.getRotationAngle = function() {
        if (typeof this.iRotationAngle === "string") {
            this.iRotationAngle = StrToInt(this.iRotationAngle);
        }
        return this.iRotationAngle;
    }; // getRotationAngle

    /**
     * setter for RotationAngle
     */
    this.setRotationAngle = function(v) {
        v = v || 0;

        if (typeof v === "string") {
            v = StrToInt(v);
        }

        this.iRotationAngle = v;
    }; // setRotationAngle

    /**
     * getter for LabelNum
     */
    this.getLabelNum = function() {
        if (typeof this.iLabelNum === "string") {
            this.iLabelNum = StrToInt(this.iLabelNum);
        }
        return this.iLabelNum;
    }; // getLabelNum

    /**
     * setter for LabelNum
     */
    this.setLabelNum = function(v) {
        v = v || 0;

        if (typeof v === "string") {
            v = StrToInt(v);
        }
        this.iLabelNum = v;
    }; // setLabelNum

    this.setColorProgress = function(v) {
        this.sColorProgress = v;
        this.refresh();
    }; //setColorProgress

    this.getColorProgress = function() {
        return this.sColorProgress;
    }; //getColorProgress

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

    this.createHtmlElement = function() {
        var node = document.createElement('div');
        node.className = this.TAG;
        node.id = this.sName;
        // set properties...
        setCssProperty(node, "width", this.getWidth());
        setCssProperty(node, "height", this.getHeight());

        document.getElementById(this.sParent).appendChild(node);

        this.eleHTML = node;
        this.refresh();
    }; //createHtmlElement

    /**
     * draw function
     */
    this.draw = function() {
        var iRealWidth = document.getElementById(this.sName).clientWidth;
        var iRealHeight = document.getElementById(this.sName).clientHeight;

        // var iRealWidth = document.getElementById(this.sParent).clientWidth;
        // var iRealHeight = document.getElementById(this.sParent).clientHeight;

        var iTotalArcAngle = this.getArcAngle();
        var iStartAngle = -(iTotalArcAngle / 2);
        var iEndAngle = -(iTotalArcAngle / 2);

        iStartAngle += self.getRotationAngle();
        iEndAngle += self.getRotationAngle();

        self.cp = {};
        self.cp._svgId = '';
        self.cp.dotLabelSettings = [];
        self.cp.textLabelSettings = [];

        self.cp.arcSettings = [{
            "totalArcAngle": iTotalArcAngle,
            "startAngle": iStartAngle,
            "endAngle": iEndAngle,
            //"progressValue":200,
            "radius": (iRealWidth / 4), //150 raggio
            "thickness": (iRealWidth / 10), //40 larghezza
        }];

        //settings for labels
        self.cp.labels = [{
            "pointThickness": 0,
            "distance": (iRealWidth / 10), // distance of dots from prograss
            "textDistance": (iRealWidth / 14), // distance of text
            "strokeColor": "transparent", // line stroke color
            "strokeWidth": 0,
            "textColor": "#ddd", // text inside color
            "pointColor": "#888",
            "textSize": 4,
            //"interval":100,
            //"precision":2,
            "num": self.getLabelNum(),
            "startValue": self.iMin,
            "endValue": self.iMax
        }];

        self.cp.graphTitle = {
            "text": "", //self.sCaption,
            "size": 20,
            "color": "#bbb"
        };

        //styling circular graph elements
        self.cp.graphStyles = {
            "progressColor": self.sColorProgress,
            "transitionTiming": 1500,
            "innerCircle": {
                "radius": null,
                "lineWidth": 0,
                // "strokeColor": "rgba(200,200,200,0.9)",
                "fillColor": "transparent", // inside circle color
                "text": "270",
                "textSize": 7,
                "textColor": "#096ed4"
            }
        };

        self.cp.init = function(_svgId, width, height) {
            self._svgId = _svgId;
            self.cp.setCenter(width, height);
            self.svg = d3.select(self._svgId)
                .attr("height", height)
                .attr("width", width)
                //.attr("viewBox","0 0 500 500")
                //.attr("preserveAspectRatio", "xMidYMid meet")
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            //initailize graph styles
            self.cp.initGraphStyles();

            self.svg.append("text")
                .attr("x", 0)
                .attr("y", 10)
                .attr("text-anchor", "middle")
                .attr("fill", self.sColorProgress)
                .attr("font-size", 24)
                .attr("id", self.sName + "_progressValue");
        };

        self.cp.getSvg = function() {
            return d3.select(this._svgId);
        };

        self.cp.setCenter = function(width, height) {
            this.svgCenter = {
                cx: 0,
                cy: 0
            };
        };

        self.cp.getCenter = function() {
            return this.svgCenter;
        };

        self.cp.getOneUnit = function() {
            return (this.arcSettings[0].totalArcAngle) / (this.labels[0].endValue - this.labels[0].startValue);
        };

        self.cp.currentProgress = self.cp.arcSettings[0].endAngle;

        self.cp.getCurrentProgress = function() {
            return self.cp.currentProgress;
        };

        self.cp.setProgress = function(val) {
            var oneUnit = self.cp.getOneUnit();
            self.cp.currentProgress = self.cp.arcSettings[0].startAngle + (val * oneUnit);
            self.cp.displayValue(val);
        };
        self.cp.degreeToRadian = function(deg) {
            return deg * Math.PI / 180.0;
        };

        var arc = d3.svg.arc()
            .startAngle(function(d) {
                return self.cp.degreeToRadian(d.startAngle);
            })
            .endAngle(function(d) {
                return self.cp.degreeToRadian(d.endAngle);
            })
            .innerRadius(function(d) {
                return d.radius;
            })
            .outerRadius(function(d) {
                return d.thickness + d.radius;
            });

        self.cp.bind = function() {
            var g;
            g = self.svg.selectAll("g")
                .data(this.arcSettings)
                .enter().append("g")
                .attr("class", "arc");
            g.append("path")
                .style("fill", this.graphStyles.progressColor)
                .attr("d", arc);
        };

        self.cp.graph = function() {
            self.cp.bind();
            self.cp.selectArcs();
        };

        self.cp.initGraphStyles = function() {
            //circle that passes through dot labels
            self.svg.append("circle")
                .attr("class", "dotLabelsCircle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this.arcSettings[0].radius + this.labels[0].distance)
                .style("fill", "none")
                .style("stroke", this.labels[0].strokeColor);

            //inncer circle
            self.svg.append("circle")
                .attr("class", "innerCircle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this.arcSettings[0].radius + this.arcSettings[0].thickness - 0.6)
                .style("fill", this.graphStyles.innerCircle.fillColor)
                .style("stroke", "none");

            self.svg.append("text")
                .attr("x", 0)
                .attr("y", -this.arcSettings[0].radius / 2)
                .attr("text-anchor", "middle")
                .attr("fill", this.graphTitle.color)
                .attr("font-size", this.graphTitle.size)
                .text(this.graphTitle.text);

            this.drawLabel();
        };

        self.cp.selectArcs = function() {
            self.svg.selectAll("g.arc > path")
                .each(self.cp.arcTween);
        };

        self.cp.arcTween = function() {
            d3.select(this)
                .transition().duration(self.cp.graphStyles.transitionTiming)
                .attrTween("d", self.cp.tweenArc({
                    endAngle: self.cp.getCurrentProgress()
                }));
        };

        self.cp.tweenArc = function(b) {
            return function(a) {
                var i = d3.interpolate(a, b);
                for (var key in b) {
                    a[key] = b[key]; // update data
                }
                return function(t) {
                    return arc(i(t));
                };
            };
        };

        self.cp.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        };

        self.cp.displayValue = function(val) {
            self.svg.select("#" + self.sName + "_progressValue")
                .text(val);
        };

        // i am planning to use this function for drawing the labels
        self.cp.drawLabel = function() {
            var textLabelRadius = this.arcSettings[0].radius + this.labels[0].distance + this.labels[0].textDistance;

            //invisible circle for label text
            // this.drawCircle(this.circularProgressSettings.x, this.circularProgressSettings.y, textLabelRadius, 1, "rgba(0,0,0,1)","none");

            var label = this.labels[0];
            var interval = 0;
            if (label.num) {
                interval = (label.endValue - label.startValue) / label.num;
            } else {
                interval = label.interval;
            }
            var numOfLabels = (label.endValue - label.startValue) / interval;
            var angleInterval = (this.arcSettings[0].totalArcAngle) / numOfLabels;

            var labels = [];
            var angle = (-this.arcSettings[0].totalArcAngle / 2);

            angle += self.getRotationAngle();

            for (var value = label.startValue; value <= label.endValue; value += interval) {
                labels.push({
                    angle: angle,
                    value: value
                });
                angle += angleInterval;
            }

            //loop for label and text
            var i = 0;
            for (i = 0; i < labels.length; i++) {
                angle = labels[i].angle;
                value = labels[i].value;
                if (label.precision === null) {
                    if (value % 1 !== 0) {
                        value = value.toFixed(2);
                    }
                } else {
                    value = value.toFixed(label.precision);
                }

                var pointRadius = this.arcSettings[0].radius + label.distance;
                var DotPoints = this.polarToCartesian(this.getCenter().cx, this.getCenter().cy, pointRadius, angle);
                var TextPoints = this.polarToCartesian(this.getCenter().cx, this.getCenter().cy, textLabelRadius, angle);

                this.dotLabelSettings.push({
                    dotX: DotPoints.x,
                    dotY: DotPoints.y,

                });
                this.textLabelSettings.push({
                    value: value,
                    textX: TextPoints.x,
                    textY: TextPoints.y
                });

                //draw dots here using d3 and the data i that i will be probably binding is this.labelSettings
                /**this.drawCircle(DotPoints.x, DotPoints.y,this.circularProgressSettings.label.pointThickness, '', '', this.circularProgressSettings.label.pointColor);
                this.set("id",this.get_SvgId()+"_label_dot_"+i);

                //draw text labels using d3
                   this.drawText(value, TextPoints.x, TextPoints.y+2, this.circularProgressSettings.label.textSize, 'none', this.circularProgressSettings.label.textColor);
                   this.set("id",this.get_SvgId()+"_label_text_"+i);
                */
            }

            this.drawDots();
            this.drawTextLabels();
        };

        self.cp.drawDots = function() {
            self.svg.selectAll("circle.dots")
                .style("fill", this.labels[0].pointColor)
                .style("stroke", "none")
                .data(this.dotLabelSettings)
                .enter()
                .append("circle")
                .attr("class", "dots")
                .attr("r", this.labels[0].pointThickness)
                .attr("cx", function(d) {
                    return d.dotX;
                })
                .attr("cy", function(d) {
                    return d.dotY;
                });

        };

        self.cp.drawTextLabels = function() {
            self.svg.selectAll("text.dots")
                .data(this.textLabelSettings)
                .enter()
                .append("text")
                .attr("class", "dots")
                .attr("x", function(d) {
                    return d.textX;
                })
                .attr("y", function(d) {
                    return d.textY + 5;
                })
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return d.value;
                })
                .attr("font-size", 11)
                .attr("fill", self.sColorLabels);
        };

        //
        self.graph = self.cp;
        self.graph.init("#" + this.sName + "_svg", iRealWidth, iRealHeight);
        self.graph.labels[0].startValue = this.iMin;
        self.graph.labels[0].endValue = self.iMax;
        self.graph.setProgress(self.iValue);
        // self.graph.setProgress(280);
        self.graph.graph();

        var ele = document.getElementById(this.sName + "_Title");
        if (!isNull(ele)) {
            ele.style.fontWeight = "bold";
            ele.style.color = self.sColorProgress;
            ele.style.fontSize = (iRealWidth / 10) + "px";
            ele.innerHTML = self.sCaption;
        }

        //
        // clearInterval(self.tmrIntervalRadial);
        // self.tmrIntervalRadial = window.setInterval(function() {
        //     self.graph.setProgress(Math.round(self.getRandomRange(1, 250)));
        //     self.graph.graph();
        // }, self.iIntervalRadial);

    }; //draw

    /**
     * get a random range
     */
    this.getRandomRange = function(min, max) {
        return Math.random() * (max - min) + min;
    }; // getRandomRange

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
            sCaption = getValueByColName(jsonData.aRes[0], 0, "sCaption");

            self.setValue(sValue);
            self.setCaption(sCaption);
        } catch (err) {
            this.onException(err);
        }
    }; // populateData

    /**
     * refresh
     */
    this.refresh = function() {
        this.eleHTML.innerHTML = "<div id=\"" + this.getName() + "_Title\" style=\"text-align: center;\"></div><svg id=\"" + this.getName() + "_svg\"></svg>";
        // set properties...
        setCssProperty(this.eleHTML, "width", this.getWidth());
        setCssProperty(this.eleHTML, "height", this.getHeight());
        setCssProperty(this.eleHTML, "float", this.getFloat());
        setCssProperty(this.eleHTML, "clear", this.getClear());
        self.setIntervalRadial(5000);
        self.draw();
    }; // refresh

    //create
    this.create(sParent, sName);
}; //oRadialProgress

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oRadialProgress = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var i = 0;
    var jsonData = [{
        sCaption: "TEST",
        iValue: 50,
        sColor: "#3791ED"
    }];

    var iPrgWidth = (document.getElementById(self.pnlToolbar2.getName()).clientWidth / jsonData.length);
    iPrgWidth = getMinMaxPreventOverflow(iPrgWidth, 0, 200);

    var iDi = self.getNewHandle();

    self.pnlContentDesigner[iDi] = new nsNessuno.oRadialProgress(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setWidth("100px");
    self.pnlContentDesigner[iDi].setHeight("100px");
    self.pnlContentDesigner[iDi].setIntervalRadial(5000);
    self.pnlContentDesigner[iDi].sCaption = jsonData[i].sCaption;
    self.pnlContentDesigner[iDi].sColorProgress = jsonData[i].sColor;
    self.pnlContentDesigner[iDi].setValue(jsonData[i].iValue);
    self.pnlContentDesigner[iDi].draw();

    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oRadialProgress
/**
 * END DESIGN TIME
 */
