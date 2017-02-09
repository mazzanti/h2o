/*
 * oChartShowReel
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:26
 * @Description: template
 */

var nsNessuno = nsNessuno || {};

nsNessuno.oChartShowReel = function(sParent, sName) {
    "use strict";
    var self = this;

    this.TAG = "oChartShowReel"; // tag
    this.sParent = ""; // parent id
    this.sName = ""; // name
    this.eleHTML = null; // html element generated
    this._owner = null;
    this.sWidth = "100%";
    this.sHeight = "100%";
    this.iSequence = 0;

    this.aData = [];
    this.aFields = [];

    this._iCountIncludes = 0;
    this.aIncludes = [];
    this.sClear = "";
    this.sFloat = "";
    this.sDataset = "datastocks.csv";

    // timers...
    this.tmrInterval1 = null;
    this.tmrInterval2 = null;
    this.tmrInterval3 = null;
    this.tmrInterval4 = null;
    this.tmrInterval5 = null;
    this.tmrInterval6 = null;
    this.tmrInterval7 = null;
    this.tmrInterval8 = null;
    this.tmrInterval9 = null;
    this.tmrInterval10 = null;
    this.tmrInterval11 = null;
    this.tmrInterval12 = null;

    this.svg = null;

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
     * on exception
     */
    this.onException = function(e) {
        console.log(e.stack);
    }; // onException

    /**
     * clearTimers description
     */
    this.clearTimers = function() {
        try {
            for (var property in this) {
                if (this.hasOwnProperty(property)) {
                    if (property.startsWith("tmr")) {
                        // by convention tmr is timer or
                        clearInterval(this[property]);
                        clearTimeout(this[property]);
                    }
                }
            }
        } catch (err) {
            this.onException(err);
        }
    }; // clearTimers

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
        } catch (err) {
            this.onException(err);
        }
    }; //createHtmlElement

    /**
     * refresh description
     */
    this.refresh = function() {
        try {
            if (!this.eleHTML) {
                return;
            }
            this.clearTimers();
            this.eleHTML.innerHTML = "";
            // set properties...
            setCssProperty(this.eleHTML, "width", this.getWidth());
            setCssProperty(this.eleHTML, "height", this.getHeight());
            setCssProperty(this.eleHTML, "float", this.getFloat());
            setCssProperty(this.eleHTML, "clear", this.getClear());

            this.draw();
        } catch (err) {
            this.onException(err);
        }
    }; // refresh

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
     * draw description
     */
    this.draw = function() {
        try {
            var iRealWidth = document.getElementById(this.getName()).clientWidth;
            var iRealHeight = document.getElementById(this.getName()).clientHeight;

            var m = [20, 20, 30, 20],
                w = iRealWidth - m[1] - m[3], //960
                h = iRealHeight - m[0] - m[2]; //500

            var x,
                y,
                duration = 1500,
                delay = 500;

            var color = d3.scale.category10();

            var svg = d3.select("#" + this.getName()).append("svg")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .append("g")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
            self.svg = svg;

            var stocks,
                symbols;

            // A line generator, for the dark stroke.
            var line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) {
                    return x(d.date);
                })
                .y(function(d) {
                    return y(d.price);
                });

            // A line generator, for the dark stroke.
            var axis = d3.svg.line()
                .interpolate("basis")
                .x(function(d) {
                    return x(d.date);
                })
                .y(h);

            // A area generator, for the dark stroke.
            var area = d3.svg.area()
                .interpolate("basis")
                .x(function(d) {
                    return x(d.date);
                })
                .y1(function(d) {
                    return y(d.price);
                });

            d3.csv(this.sDataset, function(data) {
                var parse = d3.time.format("%b %Y").parse;

                // Nest stock values by symbol.
                symbols = d3.nest()
                    .key(function(d) {
                        return d.symbol;
                    })
                    .entries(stocks = data);

                // Parse dates and numbers. We assume values are sorted by date.
                // Also compute the maximum price per symbol, needed for the y-domain.
                symbols.forEach(function(s) {
                    s.values.forEach(function(d) {
                        d.date = parse(d.date);
                        d.price = +d.price;
                    });
                    s.maxPrice = d3.max(s.values, function(d) {
                        return d.price;
                    });
                    s.sumPrice = d3.sum(s.values, function(d) {
                        return d.price;
                    });
                });

                // Sort by maximum price, descending.
                symbols.sort(function(a, b) {
                    return b.maxPrice - a.maxPrice;
                });

                var g = svg.selectAll("g")
                    .data(symbols)
                    .enter().append("g")
                    .attr("class", "symbol");

                self.tmrInterval1 = setTimeout(lines, duration);
                // self.tmrInterval1 = setTimeout(lines, duration);
                // self.tmrInterval1 = setTimeout(donut, duration);
            });

            var lines = function() {
                x = d3.time.scale().range([0, w - 60]);
                y = d3.scale.linear().range([h / 4 - 20, 0]);

                // Compute the minimum and maximum date across symbols.
                x.domain([
                    d3.min(symbols, function(d) {
                        return d.values[0].date;
                    }),
                    d3.max(symbols, function(d) {
                        return d.values[d.values.length - 1].date;
                    })
                ]);

                var g = svg.selectAll(".symbol")
                    .attr("transform", function(d, i) {
                        return "translate(0," + (i * h / 4 + 10) + ")";
                    });

                g.each(function(d) {
                    var e = d3.select(this);

                    e.append("path")
                        .attr("class", "line");

                    e.append("circle")
                        .attr("r", 5)
                        .style("fill", function(d) {
                            return color(d.key);
                        })
                        .style("stroke", "#000")
                        .style("stroke-width", "2px");

                    e.append("text")
                        .attr("x", 12)
                        .attr("dy", ".31em")
                        .text(d.key);
                });

                var draw = function(k) {
                    g.each(function(d) {
                        var e = d3.select(this);
                        y.domain([0, d.maxPrice]);

                        e.select("path")
                            .attr("d", function(d) {
                                return line(d.values.slice(0, k + 1));
                            });

                        e.selectAll("circle, text")
                            .data(function(d) {
                                return [d.values[k], d.values[k]];
                            })
                            .attr("transform", function(d) {
                                return "translate(" + x(d.date) + "," + y(d.price) + ")";
                            });
                    });
                };

                var k = 1,
                    n = symbols[0].values.length;
                d3.timer(function() {
                    draw(k);
                    if ((k += 2) >= n - 1) {
                        draw(n - 1);
                        self.tmrInterval2 = setTimeout(horizons, 500);
                        return true;
                    }
                });
            };

            var horizons = function() {
                svg.insert("defs", ".symbol")
                    .append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", w)
                    .attr("height", h / 4 - 20);

                var color = d3.scale.ordinal()
                    .range(["#c6dbef", "#9ecae1", "#6baed6"]);

                var g = svg.selectAll(".symbol")
                    .attr("clip-path", "url(#clip)");

                area.y0(h / 4 - 20);

                g.select("circle").transition()
                    .duration(duration)
                    .attr("transform", function() {
                        return "translate(" + (w - 60) + "," + (-h / 4) + ")";
                    })
                    .remove();

                g.select("text").transition()
                    .duration(duration)
                    .attr("transform", function() {
                        return "translate(" + (w - 60) + "," + (h / 4 - 20) + ")";
                    })
                    .attr("dy", "0em");

                g.each(function(d) {
                    y.domain([0, d.maxPrice]);

                    d3.select(this).selectAll(".area")
                        .data(d3.range(3))
                        .enter().insert("path", ".line")
                        .attr("class", "area")
                        .attr("transform", function(d) {
                            return "translate(0," + (d * (h / 4 - 20)) + ")";
                        })
                        .attr("d", area(d.values))
                        .style("fill", function(d, i) {
                            return color(i);
                        })
                        .style("fill-opacity", 1e-6);

                    y.domain([0, d.maxPrice / 3]);

                    d3.select(this).selectAll(".line").transition()
                        .duration(duration)
                        .attr("d", line(d.values))
                        .style("stroke-opacity", 1e-6);

                    d3.select(this).selectAll(".area").transition()
                        .duration(duration)
                        .style("fill-opacity", 1)
                        .attr("d", area(d.values))
                        .each("end", function() { d3.select(this).style("fill-opacity", null); });
                });

                self.tmrInterval3 = setTimeout(areas, duration + delay);
            };

            var areas = function() {
                var g = svg.selectAll(".symbol");

                axis.y(h / 4 - 21);

                g.select(".line")
                    .attr("d", function(d) {
                        return axis(d.values);
                    });

                g.each(function(d) {
                    y.domain([0, d.maxPrice]);

                    d3.select(this).select(".line").transition()
                        .duration(duration)
                        .style("stroke-opacity", 1)
                        .each("end", function() { d3.select(this).style("stroke-opacity", null); });

                    d3.select(this).selectAll(".area")
                        .filter(function(d, i) {
                            return i;
                        })
                        .transition()
                        .duration(duration)
                        .style("fill-opacity", 1e-6)
                        .attr("d", area(d.values))
                        .remove();

                    d3.select(this).selectAll(".area")
                        .filter(function(d, i) {
                            return !i;
                        })
                        .transition()
                        .duration(duration)
                        .style("fill", color(d.key))
                        .attr("d", area(d.values));
                });

                svg.select("defs").transition()
                    .duration(duration)
                    .remove();

                g.transition()
                    .duration(duration)
                    .each("end", function() { d3.select(this).attr("clip-path", null); });

                self.tmrInterval4 = setTimeout(stackedArea, duration + delay);
            };

            var stackedArea = function() {
                var stack = d3.layout.stack()
                    .values(function(d) {
                        return d.values;
                    })
                    .x(function(d) {
                        return d.date;
                    })
                    .y(function(d) {
                        return d.price;
                    })
                    .out(function(d, y0) { d.price0 = y0; })
                    .order("reverse");

                stack(symbols);

                y.domain([0, d3.max(symbols[0].values.map(function(d) {
                        return d.price + d.price0;
                    }))])
                    .range([h, 0]);

                line.y(function(d) {
                    return y(d.price0);
                });

                area.y0(function(d) {
                        return y(d.price0);
                    })
                    .y1(function(d) {
                        return y(d.price0 + d.price);
                    });

                var t = svg.selectAll(".symbol").transition()
                    .duration(duration)
                    .attr("transform", "translate(0,0)")
                    .each("end", function() { d3.select(this).attr("transform", null); });

                t.select("path.area")
                    .attr("d", function(d) {
                        return area(d.values);
                    });

                t.select("path.line")
                    .style("stroke-opacity", function(d, i) {
                        return i < 3 ? 1e-6 : 1;
                    })
                    .attr("d", function(d) {
                        return line(d.values);
                    });

                t.select("text")
                    .attr("transform", function(d) {
                        d = d.values[d.values.length - 1];
                        return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")";
                    });

                self.tmrInterval5 = setTimeout(streamgraph, duration + delay);
            };

            var streamgraph = function() {
                var stack = d3.layout.stack()
                    .values(function(d) {
                        return d.values;
                    })
                    .x(function(d) {
                        return d.date;
                    })
                    .y(function(d) {
                        return d.price;
                    })
                    .out(function(d, y0) { d.price0 = y0; })
                    .order("reverse")
                    .offset("wiggle");

                stack(symbols);

                line.y(function(d) {
                    return y(d.price0);
                });

                var t = svg.selectAll(".symbol").transition()
                    .duration(duration);

                t.select("path.area")
                    .attr("d", function(d) {
                        return area(d.values);
                    });

                t.select("path.line")
                    .style("stroke-opacity", 1e-6)
                    .attr("d", function(d) {
                        return line(d.values);
                    });

                t.select("text")
                    .attr("transform", function(d) {
                        d = d.values[d.values.length - 1];
                        return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")";
                    });

                self.tmrInterval6 = setTimeout(overlappingArea, duration + delay);
            };

            var overlappingArea = function() {
                var g = svg.selectAll(".symbol");

                line.y(function(d) {
                    return y(d.price0 + d.price);
                });

                g.select(".line")
                    .attr("d", function(d) {
                        return line(d.values);
                    });

                y.domain([0, d3.max(symbols.map(function(d) {
                        return d.maxPrice;
                    }))])
                    .range([h, 0]);

                area.y0(h)
                    .y1(function(d) {
                        return y(d.price);
                    });

                line.y(function(d) {
                    return y(d.price);
                });

                var t = g.transition()
                    .duration(duration);

                t.select(".line")
                    .style("stroke-opacity", 1)
                    .attr("d", function(d) {
                        return line(d.values);
                    });

                t.select(".area")
                    .style("fill-opacity", 0.5)
                    .attr("d", function(d) {
                        return area(d.values);
                    });

                t.select("text")
                    .attr("dy", ".31em")
                    .attr("transform", function(d) {
                        d = d.values[d.values.length - 1];
                        return "translate(" + (w - 60) + "," + y(d.price) + ")";
                    });

                svg.append("line")
                    .attr("class", "line")
                    .attr("x1", 0)
                    .attr("x2", w - 60)
                    .attr("y1", h)
                    .attr("y2", h)
                    .style("stroke-opacity", 1e-6)
                    .transition()
                    .duration(duration)
                    .style("stroke-opacity", 1);

                self.tmrInterval7 = setTimeout(groupedBar, duration + delay);
            };

            var groupedBar = function() {
                x = d3.scale.ordinal()
                    .domain(symbols[0].values.map(function(d) {
                        return d.date;
                    }))
                    .rangeBands([0, w - 60], 0.1);

                var x1 = d3.scale.ordinal()
                    .domain(symbols.map(function(d) {
                        return d.key;
                    }))
                    .rangeBands([0, x.rangeBand()]);

                var g = svg.selectAll(".symbol");

                var t = g.transition()
                    .duration(duration);

                t.select(".line")
                    .style("stroke-opacity", 1e-6)
                    .remove();

                t.select(".area")
                    .style("fill-opacity", 1e-6)
                    .remove();

                g.each(function(p) {
                    d3.select(this).selectAll("rect")
                        .data(function(d) {
                            return d.values;
                        })
                        .enter().append("rect")
                        .attr("x", function(d) {
                            return x(d.date) + x1(p.key);
                        })
                        .attr("y", function(d) {
                            return y(d.price);
                        })
                        .attr("width", x1.rangeBand())
                        .attr("height", function(d) {
                            return h - y(d.price);
                        })
                        .style("fill", color(p.key))
                        .style("fill-opacity", 1e-6)
                        .transition()
                        .duration(duration)
                        .style("fill-opacity", 1);
                });

                self.tmrInterval8 = setTimeout(stackedBar, duration + delay);
            };

            var stackedBar = function() {
                x.rangeRoundBands([0, w - 60], 0.1);

                var stack = d3.layout.stack()
                    .values(function(d) {
                        return d.values;
                    })
                    .x(function(d) {
                        return d.date;
                    })
                    .y(function(d) {
                        return d.price;
                    })
                    .out(function(d, y0) { d.price0 = y0; })
                    .order("reverse");

                var g = svg.selectAll(".symbol");

                stack(symbols);

                y.domain([0, d3.max(symbols[0].values.map(function(d) {
                        return d.price + d.price0;
                    }))])
                    .range([h, 0]);

                var t = g.transition()
                    .duration(duration / 2);

                t.select("text")
                    .delay(symbols[0].values.length * 10)
                    .attr("transform", function(d) {
                        d = d.values[d.values.length - 1];
                        return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")";
                    });

                t.selectAll("rect")
                    .delay(function(d, i) {
                        return i * 10;
                    })
                    .attr("y", function(d) {
                        return y(d.price0 + d.price);
                    })
                    .attr("height", function(d) {
                        return h - y(d.price);
                    })
                    .each("end", function() {
                        d3.select(this)
                            .style("stroke", "#fff")
                            .style("stroke-opacity", 1e-6)
                            .transition()
                            .duration(duration / 2)
                            .attr("x", function(d) {
                                return x(d.date);
                            })
                            .attr("width", x.rangeBand())
                            .style("stroke-opacity", 1);
                    });

                self.tmrInterval9 = setTimeout(transposeBar, duration + symbols[0].values.length * 10 + delay);
            };

            var transposeBar = function() {
                x.domain(symbols.map(function(d) {
                        return d.key;
                    }))
                    .rangeRoundBands([0, w], 0.2);

                y.domain([0, d3.max(symbols.map(function(d) {
                    return d3.sum(d.values.map(function(d) {
                        return d.price;
                    }));
                }))]);

                var stack = d3.layout.stack()
                    .x(function(d, i) {
                        return i;
                    })
                    .y(function(d) {
                        return d.price;
                    })
                    .out(function(d, y0) { d.price0 = y0; });

                stack(d3.zip.apply(null, symbols.map(function(d) {
                    return d.values;
                }))); // transpose!

                var g = svg.selectAll(".symbol");

                var t = g.transition()
                    .duration(duration / 2);

                t.selectAll("rect")
                    .delay(function(d, i) {
                        return i * 10;
                    })
                    .attr("y", function(d) {
                        return y(d.price0 + d.price) - 1;
                    })
                    .attr("height", function(d) {
                        return h - y(d.price) + 1;
                    })
                    .attr("x", function(d) {
                        return x(d.symbol);
                    })
                    .attr("width", x.rangeBand())
                    .style("stroke-opacity", 1e-6);

                t.select("text")
                    .attr("x", 0)
                    .attr("transform", function(d) {
                        return "translate(" + (x(d.key) + x.rangeBand() / 2) + "," + h + ")";
                    })
                    .attr("dy", "1.31em")
                    .each("end", function() { d3.select(this).attr("x", null).attr("text-anchor", "middle"); });

                svg.select("line").transition()
                    .duration(duration)
                    .attr("x2", w);

                self.tmrInterval10 = setTimeout(donut, duration / 2 + symbols[0].values.length * 10 + delay);
            };

            var donut = function() {
                var g = svg.selectAll(".symbol");

                g.selectAll("rect").remove();

                var pie = d3.layout.pie()
                    .value(function(d) {
                        return d.sumPrice;
                    });

                var arc = d3.svg.arc();

                var arcTween = function(d) {
                    var path = d3.select(this),
                        text = d3.select(this.parentNode.appendChild(this.previousSibling)),
                        x0 = x(d.data.key),
                        y0 = h - y(d.data.sumPrice);

                    return function(t) {
                        var r = h / 2 / Math.min(1, t + 1e-3),
                            a = Math.cos(t * Math.PI / 2),
                            xx = (-r + (a) * (x0 + x.rangeBand()) + (1 - a) * (w + h) / 2),
                            yy = ((a) * h + (1 - a) * h / 2),
                            f = {
                                innerRadius: r - x.rangeBand() / (2 - a),
                                outerRadius: r,
                                startAngle: a * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle,
                                endAngle: a * (Math.PI / 2) + (1 - a) * d.endAngle
                            };

                        path.attr("transform", "translate(" + xx + "," + yy + ")");
                        path.attr("d", arc(f));
                        text.attr("transform", "translate(" + arc.centroid(f) + ")translate(" + xx + "," + yy + ")rotate(" + ((f.startAngle + f.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
                    };
                };

                g.append("path")
                    .style("fill", function(d) {
                        return color(d.key);
                    })
                    .data(function() {
                        return pie(symbols);
                    })
                    .transition()
                    .duration(duration)
                    .tween("arc", arcTween);

                g.select("text").transition()
                    .duration(duration)
                    .attr("dy", ".31em");

                svg.select("line").transition()
                    .duration(duration)
                    .attr("y1", 2 * h)
                    .attr("y2", 2 * h)
                    .remove();

                var iK = (duration + delay) * 2;
                self.tmrInterval11 = setTimeout(donutExplode, iK);
                // self.tmrInterval11 = setTimeout(donutExplode, duration + delay);
            };

            var donutExplode = function() {
                var r0a = h / 2 - x.rangeBand() / 2,
                    r1a = h / 2,
                    r0b = 2 * h - x.rangeBand() / 2,
                    r1b = 2 * h,
                    arc = d3.svg.arc();

                var transitionExplode = function(d) {
                    d.innerRadius = r0a;
                    d.outerRadius = r1a;
                    d3.select(this).transition()
                        .duration(duration / 2)
                        .tween("arc", tweenArc({
                            innerRadius: r0b,
                            outerRadius: r1b
                        }));
                };

                var tweenArc = function(b) {
                    return function(a) {
                        var path = d3.select(this),
                            text = d3.select(this.nextSibling),
                            i = d3.interpolate(a, b);
                        for (var key in b) {
                            if (b.hasOwnProperty(key)) {
                                a[key] = b[key]; // update data
                            }
                        }
                        return function(t) {
                            var a = i(t);
                            path.attr("d", arc(a));
                            text.attr("transform", "translate(" + arc.centroid(a) + ")translate(" + w / 2 + "," + h / 2 + ")rotate(" + ((a.startAngle + a.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
                        };
                    };
                };

                svg.selectAll(".symbol path")
                    .each(transitionExplode);

                self.tmrInterval12 = setTimeout(function() {
                    svg.selectAll("*").remove();
                    svg.selectAll("g").data(symbols).enter().append("g").attr("class", "symbol");
                    lines();
                }, duration);
            };

        } catch (err) {
            this.onException(err);
        }
    }; // draw

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
        this.refresh();
    }; // setDataset

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

    //create
    this.create(sParent, sName);

}; //oChartShowReel

/**
 * BEGIN DESIGN TIME
 */
nsNessuno.oToolboxItem = nsNessuno.oToolboxItem || {};

nsNessuno.oToolboxItem.oChartShowReel = function() {
    "use strict";
    var self = nsNessuno.oToolboxItem._idForm;
    var iDi = self.getNewHandle();

    self.pnlContentDesigner[iDi] = new nsNessuno.oChartShowReel(self.pnlContentDesigner.getName(), self.pnlContentDesigner.getChildName(iDi));
    self.pnlContentDesigner[iDi].setClear("both");
    self.pnlContentDesigner[iDi].setWidth("100%");
    self.pnlContentDesigner[iDi].setHeight("500px");


    self.updateCboDesignerItem(iDi);
}; //nsNessuno.oToolboxItem.oChartShowReel
/**
 * END DESIGN TIME
 */
