var LG= {};
LG.config = {
    url: "", // holds the url of main website
    ie: "11", // default 11 means both Internal and external links will be listed 10-only internal, 01-only external,
    jorc: "json",// default json, tooks json or csv. Defines the output format  
    pattern: "" // default empty, if given links with this pattern will be grabbed only
};

page = require('webpage').create();
LG.fs   = require('fs');

// ignoring all console log of the site
page.onConsoleMessage = (function(msg) {
    //console.log("");
});

// ignoring all javascript error of the site
page.onError = (function(msg) {
    //console.log("");
});

// ignoring all javascript alert of the page
page.onAlert = (function(msg) {
  //console.log("");
});

LG.validate = {};
LG.validate.url = (function(url) {
    return true;
});
LG.validate.isInternalUrl = (function(url) {
    return true;
});
LG.validate.isExternalUrl = (function(url) {
    return true;
});

LG.prepareFullURL = (function(url){
    if(LG.config.url[LG.config.url.length-1]=="/") {
        return LG.config.url+url.substr(1);
    } else {
        return LG.config.url+url; 
    }
});

LG.linkArray = [];
LG.counter = -1;
LG.init = false;
LG.pointer = 0;

LG.removeDuplicate = (function(currentData){

    var uniqLinks = [];
    for(var i=0; i<currentData.length; i++)
    {
      var current = currentData[i];
      if(uniqLinks.indexOf(current) < 0)
      uniqLinks.push(current);
    } 

    return uniqLinks;  
});

LG.reRunProgram = (function(){
  var fileData = LG.fs.read('stack.json');
  
  if(fileData !== "")
  { 
    fileData     = JSON.parse(fileData); 
    LG.counter   = fileData.pointer ;
    LG.pointer   = fileData.pointer;
    LG.linkArray = fileData.stack;
    LG.openLink();
  } else {
    LG.openLink();
  }

});

LG.readContents = (function(fcobj){
     
      var data = page.evaluate(function() {

            var anchors = document.getElementsByTagName('a'), 
            index, 
            singleAnchor, 
            href,
            links = [];

            for(index=0; index<anchors.length; index++) {
                href = anchors[index].href;
                

                if(href !== "" && href !== 'javascript:void(0)' && typeof href !== 'object') 
                {

                  links.push(href);
                    
                }

            } //end of for loop*/

            return links;

        });

      //console.log('test - 1 ' + data.length);

      //for(var i=0; i<data.length; i++) 
      //LG.fs.write('output.txt',  data);

    

      if( data && data !== null )
      {

       data = LG.removeDuplicate(data);
       var newData = [];
       newData = newData.concat(LG.linkArray);
       newData = newData.concat(data); 
       LG.linkArray = LG.removeDuplicate(newData);
       LG.openLink();

      }

}); //end of LG.readContent



LG.openLink = (function() {
   
    LG.counter += 1;
    if ( LG.init && LG.counter >= LG.linkArray.length) {

        for(var i=0; i<LG.linkArray.length; i++) 
        LG.fs.write('output-final.txt',  LG.linkArray[i] +  '\n', 'a+');
        phantom.exit();

    }
    
    LG.init = true;

   if(LG.counter === (LG.pointer + 450))
   {
    var obj = {};
    obj.pointer = LG.counter - 1;
    obj.stack = LG.linkArray;
    LG.fs.write('stack.json', JSON.stringify(obj, null, 4));
    phantom.exit();
   } 

  

    console.log('\n-- LG.linkArray length --> '+ LG.linkArray.length +'   -- pointer --> ' + LG.counter + '-----------');  
    console.log("** Openning "+ (LG.counter + 1) +" link " + LG.linkArray[LG.counter] + " **");
    page.open(LG.linkArray[LG.counter], function(status) {
        if (status == 'success') {
            LG.readContents();
        } else {
            LG.counter -= 1;
            console.log("** Link cannot be opened may be broken or slow internet connectivity, will retry now **");

            setTimeout(function() {
                LG.openLink();
            }, 10000);      
        }

    });    
});



LG.grabCommandLine = (function(){

    var system = require('system');

    if(typeof system.args[1] =="undefined") {
        console.log("URL mast be specified");
        phantom.exit();
    } else {
        if(LG.validate.url(system.args[1])) {
            LG.config.url = system.args[1];
            LG.linkArray.push(system.args[1]);
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
});


(function(){
  LG.grabCommandLine ();
  //LG.openLink();  
  LG.reRunProgram();   
})();

