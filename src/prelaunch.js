/*jshint node:true, browser:true, newcap:false, unused:vars, esnext: true*/
"use strict";

/*
 * prelaunch script - set up to be executed before the main app fires engines
 */
require("es5-shim");
//require("es5-shim/es5-sham");
var config = require("../config");
require("@sportingsolutions/ss-pricing-sharedhtml/lib/polyfill-console")();

console.log("Prelaunch sequence starting...");
var httpRe = /^(https?):/;
var protocol = httpRe.exec(window.location)[1];

///////////////////////////////////////////////////////////////////////////////
// Redirect to https if config says so
console.log("Checking if we need to redirect to HTTPS...");
if (protocol === "http") {
	if (config.forceHTTPS) {
		var newUrl = window.location.toString().replace(httpRe, "https:");
		console.log("HTTP URL detected. Redirecting to", newUrl);
		window.location.replace(newUrl);
	} else {
		console.log("HTTP URL detected but no redirection required.");
	}
} else if (protocol === "https") {
	console.log("HTTPS detected. No redirection required.");
} else {
	console.log("Weird protocol " + protocol + " detected. Proceeding with trepidation.");
}


///////////////////////////////////////////////////////////////////////////////
// Flexbox support
console.log("Detecting flexible box layout support...");
function detectStyleSupport (styleName, styleValue) {
  var subject = document.createElement("div");
  try {
    subject.style[styleName] = styleValue;
  } catch (e) {
    // probably horrid old IE
  }
  return subject.style[styleName] === styleValue;
}

var flexOk = detectStyleSupport("display", "flex");
var msFlexboxOk = detectStyleSupport("display", "-ms-flexbox");
var webkitFlexboxOk = detectStyleSupport("display", "-webkit-flexbox");

var html = document.getElementsByTagName("html")[0];
html.className += (flexOk || msFlexboxOk || webkitFlexboxOk) ? " flexbox": " no-flexbox";
html.className += (flexOk) ? " realflexbox": " no-realflexbox";
html.className += msFlexboxOk? " msflexbox": " no-msflexbox";
html.className += webkitFlexboxOk? " webkitflexbox": " no-webkitflexbox";
console.log(flexOk? "Full flexbox support detected. Congratulations." : 
  msFlexboxOk? "Limited -ms-prefixed flexbox support detected. You should start saving up for a new browser." : 
  webkitFlexboxOk? "-webkit-prefixed flexbox support detected. We can work with this." :
  "No flexbox support detected. Some page elements will revert to static sizing.");


///////////////////////////////////////////////////////////////////////////////
// XDomain
console.log("Detecting native CORS support...");
if (config.forceXDomain || ! ('withCredentials' in new XMLHttpRequest())) {
	var xdomain = require("@sportingsolutions/ss-pricing-sharedhtml/vendor/xdomain").xdomain;
	var url = require("url");
	console.log("CORS support not detected. Initializing XDomain.");
	var slaves = {};

  var remotes = [config.baseUrl, config.aussieRulesApiUrl];
  for (var i=0; i < remotes.length; i++) {
    var remoteUrl = url.resolve(remotes[i], "proxy.html");
    remoteUrl = url.parse(remoteUrl, false, true);
    remoteUrl.protocol = protocol;
    var origin = remoteUrl.protocol + "://" + remoteUrl.host;
    var path = remoteUrl.path;
    console.log("Slaving origin " + origin + " to path " + path);
    slaves[origin] =  path;
  }

	xdomain.slaves(slaves);
} else {
	console.log("CORS support detected. Well done captain.");
}

// what does this look like?
var wonka = foo => { return foo * 2 ;};

console.log("Prelaunch sequence complete. Go for launch.");
















































console.log("                                                   ,:\n\
                                                 ,^ |\n\
                                                /   :\n\
                                             --^   /\n\
                                             \/ />/\n\
                                             / <//_\\\n\
                                          __/   /\n\
                                          )^-. /\n\
                                          ./  :\\\n\
                                           /.^ ^\n\
                                         ^/^\n\
                                         +\n\
                                        ^\n\
                                      ^.\n\
                                  .-*-\n\
                                 (    |\n\
                              . .-^  ^.\n\
                             ( (.   )8:\n\
                         .^    / (_  )\n\
                          _. :(.   )8P  ^\n\
                      .  (  ^-^ (  ^.   .\n\
                       .  :  (   .a8a)\n\
                      /_^( *a ^a. )*^\n\
                  (  (/  .  ^ )==^\n\
                 (   (    )  .8*   +\n\
                   (^^8a.( _(   (\n\
                ..-. ^8P    ) ^  )  +\n\
              -^   (      -ab:  )\n\
            ^    _  ^    (8P*Ya\n\
          _(    (    )b  -^.  ) +\n\
         ( 8)  ( _.aP* _a   \( \   *\n\
       +  )/    (8P   (88    )  )\n\
          (a:f   *     ^*       ^\n");