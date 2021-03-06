"use strict";

var etag=null;

function podURL() {
	// temporary hack until we have a nice way for users to select their pod
	//return "http://"+document.getElementById("username").value+".fakepods.com";
	return document.getElementById("podurl").value
}


function reload() {

	var request = new XMLHttpRequest();

	// just fetch everything, for now, since queries don't work yet
	request.open("GET", podURL()+"/_nearby", true);
	if (etag !== null) {
		request.setRequestHeader("Wait-For-None-Match", etag);
		console.log('doing a long poll', etag);
	} else {
		console.log('initial fetch, not a long poll');
	}

	request.onreadystatechange = function() {
		if (request.readyState==4 && request.status==200) {
    		handleResponse(request.responseText);
    	}
 	}

	request.send();
}

function handleResponse(responseText) {
	console.log('got response');
	var responseJSON = JSON.parse(responseText);
	etag = responseJSON._etag;
	var all = responseJSON._members;
	var messages = [];
	console.log('got response');
	for (var i=0; i<all.length; i++) {
		var item = all[i];
		// consider the 'text' property to be the essential one
		var now = Date.now();
		if ('text' in item && 'time' in item) {
			item.timeDate = new Date(Number(item.time))
			if (now - item.timeDate < 86400000) {
				messages.push(item)
			}
		}
	}
	messages.sort(function(a,b){return Number(a.time)-Number(b.time)});
	
	// not being clever, just remove and re-create the whole "out" element
	var out = document.getElementById("out")
	while(out.firstChild) { out.removeChild(out.firstChild) }
	var padding = String("                             ");
	for (i=0; i<messages.length; i++) {
		var message = messages[i];
		if (Number(message.time) > 0) {
			var div = document.createElement("span");
			message.timeDate = new Date(Number(message.time))
			var date = message.timeDate.toLocaleString();
			var line = "  "+date + padding.slice(5).slice(date.length);
			line += " "+message._owner;
			line += padding.slice(message._owner.length)+"  ";
			line += message.text+"\n";
			var link = document.createElement("a");
			link.href=message._id;
			link.appendChild(document.createTextNode("item"));
			div.appendChild(link);
			div.appendChild(document.createTextNode(line));
			out.appendChild(div);
		}
	}
	window.scrollTo(0,document.body.scrollHeight);
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
