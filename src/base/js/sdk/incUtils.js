/*
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Date:   2016-02-12 19:52:33
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-05-01 14:29:10
 */

"use strict";

/**
 * is empty
 */
function isEmpty(v) {
    return (v === "") ? true : false;
} //isEmpty

/**
 * is undefined
 */
function isUndefined(v) {
    return (v === undefined) ? true : false;
} //isUndefined

/**
 * is null
 */
function isNull(v) {
    return (v === null) ? true : false;
} //isNull

/**
 * prevent overflow
 */
function getMinMaxPreventOverflow(n, iMin, iMax) {
    return Math.max(iMin, Math.min(n, iMax));
} //getMinMaxPreventOverflow

/*
 * xhttp html request
 */

function httpGet(sUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", sUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function httpPost(sUrl, sParams) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", sUrl, false); // synchronous
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(sParams);
    //xmlHttp.send("fname=Henry&lname=Ford");
    return xmlHttp.responseText;
}

function httpGetAsync(sUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", sUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function httpPostAsync(sUrl, sParams, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("POST", sUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(sParams);
}

// HttpClient object
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                aCallback(xmlHttp.responseText);
            }
        };

        xmlHttp.open("GET", aUrl, true);
        xmlHttp.send(null);
    };

    this.post = function(sUrl, sParams, aCallback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                aCallback(xmlHttp.responseText);
            }
        };

        xmlHttp.open("POST", sUrl, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(sParams);
    };
}; // HttpClient object

/*
 * include js
 */
function includeJs(sender, v, callback) {
    var isPresent = function() {
        var ele = document.getElementsByTagName("head")[0];
        var eles = ele.getElementsByTagName("script");
        var ssrc = "";
        var i = 0;
        for (i = 0; i < eles.length; i++) {
            ssrc = eles[i].getAttribute("src");
            // console.log(ssrc);
            if (ssrc === v) {
                return true;
            }
        }

        return false;
    };

    if (isPresent(v)) {
        return false;
    }

    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("charset", "utf-8");
    fileref.setAttribute("async", true);
    fileref.setAttribute("src", v);
    fileref.onload = function(d) {
        // console.log(d);
        if (typeof callback !== "undefined") {
            callback(d);
        }
    };

    if (typeof fileref !== "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }

    return true;
} // includeJs

/**
 * remove a js file
 */
function removeJs(v) {

} //removeJs

/**
 * call get data
 */
function callGetData(params, fun) {
    var sUrl = "";

    sUrl = "base/gates/app.php";

    // httpGetAsync(sUrl, fun);
    httpPostAsync(sUrl, "", fun);
} //callGetData

/**
 * free object
 */
function freeObj(b) {
    if (typeof b === 'object') {
        if (b.destroy !== undefined) {
            b.destroy();
        }
    }
    b = null;
    b = undefined;
} //freeObj

/**
 * pad with zeros
 */
function padZeros(n, width, z) {
    z = z || '0';
    n = n + '';
    width = width || 2;

    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
} // padZeros

/**
 * merge 2 array
 */
function mergeArray(array1, array2) {
    var item;
    for (item in array1) {
        array2[item] = array1[item];
    }
    return array2;
} //mergeArray

/**
 * format
 */
// if (!String.prototype.format) {
//     String.prototype.format = function() {
//         var args = arguments;
//         return this.replace(/{(\d+)}/g, function(match, number) {
//             return typeof args[number] != 'undefined' ? args[number] : match;
//         });
//     };
// } // format

/**
 * sprintf
 */
// function sprintf() {
//     var args = arguments,
//     string = args[0],
//     i = 1;
//     return string.replace(/%((%)|s|d)/g, function (m) {
//         // m is the matched format, e.g. %s, %d
//         var val = null;
//         if (m[2]) {
//             val = m[2];
//         } else {
//             val = args[i];
//             // A switch statement so that the formatter can be extended. Default is %s
//             switch (m) {
//                 case '%d':
//                     val = parseFloat(val);
//                     if (isNaN(val)) {
//                         val = 0;
//                     }
//                     break;
//             }
//             i++;
//         }
//         return val;
//     });
// }// sprintf

/**
 * sprintf
 */
function sprintf() {
    var args = arguments;
    var s = args[0];
    var t = [];
    var i = 0;
    for (i = 1; i < args.length; i++) {
        t.push(args[i]);
    }
    args = t;

    s = s.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
    return s;
} // sprintf

/**
 * convert string to int
 */
function StrToInt(v) {
    return parseInt(v);
} //StrToInt

/**
 * unload css file
 */
function removeCss(filename) {
    var ele = document.getElementsByTagName("head")[0];
    var eles = null;
    var i = 0;
    if (ele) {
        eles = ele.getElementsByTagName("link");
        if (eles) {
            for (i = 0; i < eles.length; i++) {
                if (eles[i]) {
                    if (eles[i].getAttribute("href") === filename) {
                        // console.log(eles[i]);
                        ele.removeChild(eles[i]);
                    }
                }
            }
        }
    }
} //removeCss

/**
 * load a css file
 */
function includeCss(sender, filename, callback) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    fileref.setAttribute("async", true);
    fileref.onload = function(d) {
        // console.log(d);
        if (typeof callback !== "undefined") {
            callback(d);
        }
    };

    if (typeof fileref !== "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
} //includeCss

/**
 * get a file extension
 */
function getFileExtension(v) {
    return v.split('.').pop();
    //return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
} //getFileExtension

/**
 * returns an integer
 */
function castInt(v) {
    if (typeof v === "string") {
        v = parseInt(v);
    }

    return v;
} //castInt

/**
 * set a css property to a element
 */
function setCssProperty(v, sname, value) {
    v["style"][sname] = value;
} //setCss


function appendCode(filter, tpl) {
    $(filter).append(tpl).trigger('create');
}//appendCode

function destroyItem(filter) {
    $(filter).remove();
}//destroyItem

function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }

    return false;
} //isMobile

function isChrome() {}

function isFirefox() {}

function isExplorer() {}

function isEdge() {}

function isOpera() {}

function isSafari() {}
