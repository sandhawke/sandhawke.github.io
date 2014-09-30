"use strict";

var gotVersion=0;

function podURL() {
	// temporary hack until we have a nice way for users to select their pod
	return "http://"+document.getElementById("username").value+".fakepods.com";
}

function reload() {
	// just fetch everything, for now, since queries don't work yet
	httpGet(podURL()+"/**?wait-for-version-after="+gotVersion, function(responseText) {

		var responseJSON = JSON.parse(responseText);
		gotVersion = responseJSON._version;
		console.log('got version', gotVersion);
		var all = responseJSON._members;
		var messages = [];
		for (var i=0; i<all.length; i++) {
			var item = all[i];
			// consider the 'text' property to be the essential one
			if ('text' in item) {
				messages.push(item)
			}
		}
		messages.sort(function(a,b){return a.time-b.time});

		// not being clever, just remove and re-create the whole "out" element
		var out = document.getElementById("out")
		while(out.firstChild) { out.removeChild(out.firstChild) }
		for (i=0; i<messages.length; i++) {
			var message = messages[i];
			var div = document.createElement("div");
			div.innerHTML = message.time+" "+message._owner+" "+message.text;
			out.appendChild(div);
		}
		document.getElementById("chat").style.visibility = "visible"
		// wait for 100ms then reload when there's new data.  If data
		// comes faster than that, we don't really want it.
		setTimeout(reload, 50);
		
	})
}

function httpGet(url, callback) {
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
    		callback(request.responseText);
    	}
 	}
	request.send();
}

function newmsg() {
    var message = document.getElementById("message").value;
	document.getElementById("message").value = "";
    if (message) {
     	var request = new XMLHttpRequest();
	    request.open("POST", podURL());
    	request.onreadystatechange = function() {
            if (request.readyState==4 && request.status==201) {
				// why does this always print null, even though it's not?
				console.log("Location:", request.getResponseHeader("Location"));
				// reload();   (not if it's already looping!)
     		}
		}
		request.setRequestHeader("Content-type", "application/json");
		var content = JSON.stringify({text:message, time:Date.now()});
		request.send(content);
	} else {
		reload();

	}
}
