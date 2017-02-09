/*
 * oDraw
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:27
 * @Description: template
 */


var nsNessuno = nsNessuno || {};

nsNessuno.oDraw = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oDraw"; // tag
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
        setCssProperty(this.eleHTML, "width", this.getWidth());
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
        setCssProperty(this.eleHTML, "height", this.getHeight());
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
                        if (!isNull(this[property])&&!isUndefined(this[property].destroy)) {
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

    this.draw = function() {

        var ele = document.getElementById(this.getName());
        var iW = ele.clientWidth;
        var iH = ele.clientHeight;

        var svg = d3.select("#"+this.getName())
            .append('svg')
            .attr('width', iW)
            .attr('height', iH);

        var color = d3.scale.category20();

        var line = d3.svg.line()
            .interpolate("basis");

        var drawObj = {
            isDown: false,
            dataPoints: [],
            currentPath: null,
            color: 0
        };

        svg.on("mousedown", function() {
            drawObj.isDown = true;
        });
        svg.on("mousemove", function() {
            // console.log(d3.event.y, ele.offsetTop);
            //FIXME correct in case of scroll
            var deltaX = ele.offsetLeft;
            var deltaY = ele.offsetTop;

            if (drawObj.isDown) {
                drawObj.dataPoints.push(
                    [d3.event.x-deltaX, d3.event.y-deltaY]
                );
                if (!drawObj.currentPath) {
                    drawObj.currentPath = svg.append("path")
                        .attr("class", "currentPath")
                        .style("stroke-width", 1)
                        .style("stroke", color(drawObj.color))
                        .style("fill", "none");
                }
                drawObj.currentPath
                    .datum(drawObj.dataPoints)
                    .attr("d", line);
            }
        });
        svg.on("mouseup", function() {
            drawObj.isDown = false;
            drawObj.currentPath.attr("class", "oldPath");
            drawObj.dataPoints = [];
            drawObj.currentPath = null;
            // if (++drawObj.color > 19) {
            //     drawObj.color = 0;
            // }
        });

    }; //draw

    this.draw1 = function() {
        this.eleHTML.innerHTML = "<canvas id=\"" + this.getName() + "_sheet\" style=\"width: 100%; height: 100%;\"></canvas>";

        //
        var context = document.getElementById(this.getName() + "_sheet").getContext("2d");
        var canvas = document.getElementById(this.getName() + "_sheet");
        context = canvas.getContext("2d");
        context.strokeStyle = "#ff0000";
        context.lineJoin = "round";
        context.lineWidth = 5;

        var clickX = [];
        var clickY = [];
        var clickDrag = [];
        var paint;

        /**
         * Add information where the user clicked at.
         * @param {number} x
         * @param {number} y
         * @return {boolean} dragging
         */
        function addClick(x, y, dragging) {
            clickX.push(x);
            clickY.push(y);
            clickDrag.push(dragging);
        }

        /**
         * Redraw the complete canvas.
         */
        function redraw() {
            // Clears the canvas
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            for (var i = 0; i < clickX.length; i += 1) {
                if (!clickDrag[i] && i === 0) {
                    context.beginPath();
                    context.moveTo(clickX[i], clickY[i]);
                    context.stroke();
                } else if (!clickDrag[i] && i > 0) {
                    context.closePath();

                    context.beginPath();
                    context.moveTo(clickX[i], clickY[i]);
                    context.stroke();
                } else {
                    context.lineTo(clickX[i], clickY[i]);
                    context.stroke();
                }
            }
        }

        /**
         * Draw the newly added point.
         * @return {void}
         */
        function drawNew() {
            var i = clickX.length - 1;
            if (!clickDrag[i]) {
                if (clickX.length === 0) {
                    context.beginPath();
                    context.moveTo(clickX[i], clickY[i]);
                    context.stroke();
                } else {
                    context.closePath();

                    context.beginPath();
                    context.moveTo(clickX[i], clickY[i]);
                    context.stroke();
                }
            } else {
                context.lineTo(clickX[i], clickY[i]);
                context.stroke();
            }
        }

        function mouseDownEventHandler(e) {
            paint = true;
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;
            if (paint) {
                addClick(x, y, false);
                drawNew();
            }
        }

        function touchstartEventHandler(e) {
            paint = true;
            if (paint) {
                addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, false);
                drawNew();
            }
        }

        function mouseUpEventHandler(e) {
            context.closePath();
            paint = false;
        }

        function mouseMoveEventHandler(e) {
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;
            if (paint) {
                addClick(x, y, true);
                drawNew();
            }
        }

        function touchMoveEventHandler(e) {
            if (paint) {
                addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, true);
                drawNew();
            }
        }

        function setUpHandler(isMouseandNotTouch, detectEvent) {
            removeRaceHandlers();
            if (isMouseandNotTouch) {
                canvas.addEventListener('mouseup', mouseUpEventHandler);
                canvas.addEventListener('mousemove', mouseMoveEventHandler);
                canvas.addEventListener('mousedown', mouseDownEventHandler);
                mouseDownEventHandler(detectEvent);
            } else {
                canvas.addEventListener('touchstart', touchstartEventHandler);
                canvas.addEventListener('touchmove', touchMoveEventHandler);
                canvas.addEventListener('touchend', mouseUpEventHandler);
                touchstartEventHandler(detectEvent);
            }
        }

        function mouseWins(e) {
            setUpHandler(true, e);
        }

        function touchWins(e) {
            setUpHandler(false, e);
        }

        function removeRaceHandlers() {
            canvas.removeEventListener('mousedown', mouseWins);
            canvas.removeEventListener('touchstart', touchWins);
        }

        canvas.addEventListener('mousedown', mouseWins);
        canvas.addEventListener('touchstart', touchWins);
    }; //draw

    //create
    this.create(sParent, sName);

}; //oDraw
