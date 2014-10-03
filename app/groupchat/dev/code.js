"use strict";

console.log('document load started');
document.addEventListener('DOMContentLoaded',function(){
	console.log('document loaded');
})

// temporary hack until we have a nice way for users to select their pod
var podURL = null;

function gotPodURL() {
	document.getElementById("loginForm").style.visibility = "hidden";
	podURL = document.getElementById("podurl").value

	enterChat();
	renderMessages();
}

function newmsg() {
	addToPod({text:message, time:Date.now()})
}

function renderMessages() {
	addDataWatcher({
		//requiredProperties: ["text", "time", "_owner"],
		filters: [ 
			"text",
			["time", ">", ""+(Date.now() - 86400)]
		],
		updateAll: function (messages) {

			// brute force, just redraw it all

			messages.forEach(function (m) {
				m.timeDate = new Date(Number(m.time))
			});
			messages.sort(function(a,b){return a.timeDate-b.timeDate});
			
			var out = document.getElementById("out")
			while(out.firstChild) { out.removeChild(out.firstChild) }

			messages.forEach(function (m) {
				var div = document.createElement("div");
				div.innerHTML = m.timeDate.toLocaleString()+" "+m._owner+" "
				// prevent HTML from being rendered
				div.appendChild(document.createTextNode(m.text));
				out.appendChild(div);
			});
			document.getElementById("chat").style.visibility = "visible"
		}});
}


var myPresencePage = null;

function enterChat() {
	if (myPresencePage == null) {
		addToPod({inchat:podURL, asOf:Date.now()}, function(ref) {
			myPresencePage = ref
		});
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

//////////////////////////////////////////
//  
//   basic pod access stuff
//
////////////////////////////////////////

// Send this JS object to the user's pod to be stored.  When it's saved 
// the callback function is called with the URL of the new page where this
// is stored.  We can PUT to update it or DELETE to get rid of it.
function addToPod(msg, callback) {
	if (podURL) {
		var request = new XMLHttpRequest();
		request.open("POST", podURL);
    	request.onreadystatechange = function(event) {
            if (request.readyState==4 && request.status==201) {
				if (callback) {
					callback(request.getResponseHeader("Location"));
				}
     		}
		}
		request.setRequestHeader("Content-type", "application/json");
		request.send(JSON.stringify(msg));
	}
}

// The callback will be called, with a list of all available objects
// whenever data in that list changes
//
// Assumes podURL is already set and doesn't change
//
// if requiredProperties, then only return objects where they are not
// null
//
var etag=null;
var dataWatchers=[];
function addDataWatcher(w) {
	dataWatchers.push(w);
	if (dataWatchers.length == 1) _requestData()
}

function _requestData() {
	var request = new XMLHttpRequest();
	request.open("GET", podURL+"/_nearby", true);
	if (etag !== null) {
		request.setRequestHeader("Wait-For-None-Match", etag);
	}
	request.onreadystatechange = function() {
		if (request.readyState==4 && request.status==200) {
			var responseJSON = JSON.parse(request.responseText);
			var items = responseJSON._members

			// FOR NOW we're doing this filtering, and maybe more here
			// the client, but soon we'll be passing it to the server.
		
			dataWatchers.forEach(function (w) {
				var selected = []
				items.forEach(function (item) {
					var hasThemAll = true;
					w.requiredProperties.forEach(function (rp) {
						if (!item.hasOwnProperty(rp)) hasThemAll = false;
					});
					if (hasThemAll) {
						selected.push(item);
					}
				})
				w.updateAll(selected)
			});

			// should get this from http, but server isn't sending it yet
			etag = responseJSON._etag;
		}

		// wait a bit request to be told when there is more data.  If it's
		// changing faster that that, we don't really care.
		setTimeout(_requestData, 50);
	}
	request.send();
}
