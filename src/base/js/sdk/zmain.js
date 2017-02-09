/*
 * @Author: Giulio Mazzanti (evilstev3n@gmail.com)
 * @Company: Experiments
 * @Date:   2016-02-10 20:11:13
 * @Last Modified by:   giulio
 * @Last Modified time: 2016-04-16 14:34:24
 */

"use strict";
//
// definitions
var g_oGlobal = g_oGlobal || {};

includeJs("zmain.js","base/js/sdk/oManager.js", function() {
    g_oGlobal.manager1 = new nsNessuno.oManager("wrapper", "wrapper_manager1");
    g_oGlobal.manager1.setOwner(g_oGlobal.manager1);
});
