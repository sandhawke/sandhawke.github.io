"use strict";

var etag=null;

function podURL() {
	// temporary hack until we have a nice way for users to select their pod
	//return "http://"+document.getElementById("username").value+".fakepods.com";
	return document.getElementById("podurl").value
}


function reload() {
	enterChat();
	var request = new XMLHttpRequest();

	// just fetch everything, for now, since queries don't work yet
	request.open("GET", podURL()+"/_nearby", true);
	if (etag !== null) {
		request.setRequestHeader("Wait-For-None-Match", etag);
	}

	request.onreadystatechange = function() {
		if (request.readyState==4 && request.status==200) {
    		handleResponse(request.responseText);
    	}
 	}

	request.send();

	
}

function handleResponse(responseText) {
	var responseJSON = JSON.parse(responseText);
	etag = responseJSON._etag;
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
		message.timeDate = new Date(Number(message.time))
		var div = document.createElement("div");
		div.innerHTML = message.timeDate.toLocaleString()+" "+message._owner+" "+message.text;
		out.appendChild(div);
	}
	document.getElementById("chat").style.visibility = "visible"
	// wait for 100ms then reload when there's new data.  If data
	// comes faster than that, we don't really want it.
	setTimeout(reload, 50);
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
				// console.log("Location:", request.getResponseHeader("Location"));
     		}
		}
		request.setRequestHeader("Content-type", "application/json");
		var content = JSON.stringify({text:message, time:Date.now()});
		request.send(content);
	} 
}


var presencePage = null;
function enterChat() {
	if (podURL() && presencePage == null) {
		var request = new XMLHttpRequest();
		request.open("POST", podURL());
    	request.onreadystatechange = function(r) {
			console.log('r=', r)
			console.log('r=request', r===request)
            if (request.readyState==4 && request.status==201) {
				// why does this always print null, even though it's not?
				// console.log("Location:", request.getResponseHeader("Location"));
     		}
		}
		request.setRequestHeader("Content-type", "application/json");
		var content = JSON.stringify({inchat:podURL(), asOf:Date.now()});
		request.send(content);
	}
}

function exitChat() {
	if (presencePage) {
		var request = new XMLHttpRequest();
		request.open("DELETE", presencePage);
		request.send(content);
	}
	return null
}
window.onbeforeunload = exitChat