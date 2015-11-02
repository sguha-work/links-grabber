// to run this code use phantomjs fiddle-grabber.js

var LG= {};
LG.config = {
    url: "", // holds the url of main website
    ie: "11", // default 11 means both Internal and external links will be listed 10-only internal, 01-only external,
    jorc: "json",// default json, tooks json or csv. Defines the output format  
    pattern: "" // default empty, if given links with this pattern will be grabbed only
};

LG.page = require('webpage').create();

// ignoring all console log of the site
LG.page.onConsoleMessage = (function(msg) {
    console.log("");
});

// ignoring all javascript error of the site
LG.page.onError = (function(msg) {
    console.log("");
});

// ignoring all javascript alert of the page
LG.page.onAlert = (function(msg) {
  console.log("");
});

LG.tempURLObject = {}; // holds the list of visited URL for internal use
LG.finalOutputArray = []; // holds the final output list of URL

LG.validate = {};
LG.validate.url = (function(url) {
    return true;
});


LG.grab = {};
LG.grab.begin = (function() {

});

// set the values from command line input
(function(process) {
    var system = require('system');
    if(typeof system.args[1] =="undefined") {
        console.log("URL mast be specified");
        phantom.exit();
    } else {
        if(LG.validate.url(system.args[1])) {
            LG.config.url = system.args[1];
        } else {
            console.log("Provided URL is not valid");
            phantom.exit();
        }
    }
    
    if(typeof system.args[2] != "undefined") {
        LG.config.ie = system.args[2];   
    }

    if(typeof system.args[3] != "undefined") {
        LG.config.jorc = system.args[3];   
    }

    if(typeof system.args[4] != "undefined") {
        LG.config.pattern = system.args[4];   
    }
    LG.tempURLObject[LG.config.url] = {};
    LG.grab.begin();
})();



// var page;
// var fiddleFetch = {};
// fiddleFetch.url = [];
// fiddleFetch.rootDirectoryName = "fiddles";
// fiddleFetch.counter = -1;
// page = require('webpage').create();
// fiddleFetch.logFileName = fiddleFetch.rootDirectoryName + "/" + "log_"+(new Date()).getTime()+".json";
// // ignoring all console log of the site
// page.onConsoleMessage = (function(msg) {
//     console.log("");
// });

// // ignoring all javascript error of the site
// page.onError = (function(msg) {
//     console.log("");
// }); 

// // ignoring all javascript alert of the page
// page.onAlert = function(msg) {
//   console.log("");
// }
 
// var createLocalFiles = (function(urlObject) {
//     console.log("****** Start creating local files ******");
//     var fs = require('fs');
//     if (page.injectJs("jquery.js")) {
//         var value = page.evaluate(function() {
//             var html = $('#id_code_html').text();
//             var js = $('#id_code_js').text();
//             var css = $('#id_code_css').text();
//             var resources = [];
//             $(".filename").each(function() {
//                 resources.push($(this).attr("href"));
//             });
//             var options = {};
//             options.description = $('#id_description').text();
//             options.title = $("#id_title").val();
//             options.scss = 0;
//             if($("#panel_css_choice").length && $("#panel_css_choice").val()) {
//                 options.scss=1;
//             } else {
//                 options.scss=0;
//             }
//             return {
//                 html: html,
//                 js: js,
//                 css: css,
//                 resources: resources,
//                 options: options
//             };

//         });
//         var cssFileName = "demo.css";
//         if(typeof value.scss != "undefined" && value.scss) {
//             cssFileName = "demo.scss";
//         }
//         fs.makeDirectory(fiddleFetch.rootDirectoryName + "/" + urlObject.title);
//         fs.makeDirectory(fiddleFetch.rootDirectoryName + "/" + urlObject.title + "/" + "files");
//         fs.write(fiddleFetch.rootDirectoryName + "/" + urlObject.title + "/" + "files" + "/" + "demo.html", value.html);
//         fs.write(fiddleFetch.rootDirectoryName + "/" + urlObject.title + "/" + "files" + "/" + "demo.js", value.js);
//         fs.write(fiddleFetch.rootDirectoryName + "/" + urlObject.title + "/" + "files" + "/" + cssFileName, value.css);
//         fs.write(fiddleFetch.rootDirectoryName + "/" + urlObject.title + "/" + "files" + "/" + "url.txt", urlObject.url);

//         var detailsContent = "---\nname: " + value.options.title + "\ndescription: " + value.options.description + "\nresources: \n";
//         for (var index in value.resources) {
//             detailsContent += '  - ' + value.resources[index] + '\n';
//         }
//         detailsContent += '...';
//         fs.write(fiddleFetch.rootDirectoryName + "/" + urlObject.title + "/" + "files" + "/" + "demo.details", detailsContent, 'w');

//         //creating full page
//         var totalHTMLContent = '<!DOCTYPE HTML><html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><meta http-equiv="edit-Type" edit="text/html; charset=utf-8" />';

//         // adding the title
//         totalHTMLContent += '<title>' + value.options.title + '</title>';

//         //adding css
//         totalHTMLContent += "<style>" + value.css + "</style>";
//         // adding the external resources
//         for (var index in value.resources) {
//             if ((value.resources[index].split(".").pop()).toLowerCase() == "js") {
//                 totalHTMLContent += '<script type="text/javascript" src="' + value.resources[index] + '"></script>';
//             } else {
//                 totalHTMLContent += '<link rel="stylesheet" type="text/css" href="' + value.resources[index] + '"></link>';
//             }
//         }
//         // closing header and starting the body
//         totalHTMLContent += "</head><body>";
//         //adding the html
//         totalHTMLContent += value.html;
//         //adding the javascript
//         totalHTMLContent += '<script type="text/javascript">' + value.js + '</script>';
//         //ending page
//         totalHTMLContent += '</body></html>';

//         fs.write(fiddleFetch.rootDirectoryName + "/" + urlObject.title + "/" + urlObject.title + ".html", totalHTMLContent, 'w');

//         // updating the log file
//         var logFileData = JSON.parse(fs.read(fiddleFetch.logFileName));
//         var logObject = {};
//         logObject.url = urlObject.url;
//         logObject.grabStatus = ((value.js.length)?1:0);
//         logObject.grabbedOn = (new Date()).getTime();
//         logFileData.push(logObject);;
//         fs.write(fiddleFetch.logFileName, JSON.stringify(logFileData, null, 4), "w");
        
//         console.log("****** File write done ******");
//     }

// });

// var startRender = (function() {
//     fiddleFetch.counter += 1;
//     if (fiddleFetch.counter >= fiddleFetch.url.length) {
//         phantom.exit();
//     }
//     console.log("****** " + (fiddleFetch.counter + 1) + " Openning link " + fiddleFetch.url[fiddleFetch.counter].url + " *****");
//     page.open(fiddleFetch.url[fiddleFetch.counter].url, function(status) {
//         if (status == 'success') {
//             createLocalFiles(fiddleFetch.url[fiddleFetch.counter]);
//         } else {
//             fiddleFetch.counter -= 1;
//             console.log("****** Link cannot be opened may be broken or slow internet connectivity, will retry now ******");
//         }
//     });
// });

// var initiateLogFile = (function() {
//     var fs = require('fs');
//     fs.write(fiddleFetch.logFileName, "[]", "w+");
// });

// var startRenderInterval = (function() {
//     console.log("");
//     console.log("");
//     console.log("Initializing the program");
//     console.log("Local folder created");
//     console.log("");
//     console.log("");
//     initiateLogFile();
//     setInterval(function() {
//         startRender();
//     }, 20000)
// });

// // creating root folder
// (function() {
//     var fs = require('fs');
//     fs.makeDirectory(fiddleFetch.rootDirectoryName);
// })();

// var isValidFiddleLink = (function(url) {
//     if (url.indexOf("//jsfiddle.net/") == -1) {
//         return false;
//     }
//     return true;
// });

// // parse the csv to get the url array
// var getURLArrayFromCSV = (function(fileContent) {
//     var fileContentArray = fileContent.split("\n");
//     for (var index = 1; index < fileContentArray.length; index++) {
//         var lineArray = fileContentArray[index].split(",");
//         if (typeof lineArray[0] != "undefined" && lineArray[0].trim().length != 0 && isValidFiddleLink(lineArray[0])) {
//             var tempObject = {};
//             tempObject.url = lineArray[0];
//             if (typeof lineArray[1] != "undefined" && lineArray[1].trim().length != 0) {
//                 tempObject.title = lineArray[1];
//             } else {
//                 tempObject.title = "untitled" + index;
//             }
//             fiddleFetch.url.push(tempObject);
//         } else {
//             continue;
//         }
//     }
//     startRenderInterval();
// });

// // set the csv file name
// (function(process) {
//     var indexOfCsvFile = 1;
//     var system = require('system');
//     fiddleFetch.csvFileName = system.args[indexOfCsvFile];
// })();

// // if csv file name not provided exiting the program
// (function() {
//     if (typeof fiddleFetch.csvFileName != "undefined" && fiddleFetch.csvFileName.trim() != "") {
//         var fs = require('fs');
//         var fileContent = fs.read(fiddleFetch.csvFileName);
//         if (typeof fileContent == "undefined" || fileContent.trim().length == 0) {
//             console.log("Invalid file content.");
//             phantom.exit();
//         } else {
//             getURLArrayFromCSV(fileContent);
//         }
//     } else {
//         console.log("CSV file name not provided");
//         phantom.exit();
//     }
// })();
