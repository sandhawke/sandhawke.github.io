"use strict";
/*
  
  In-browser API for accessing a world of linked data through the
  user's personal online database (pod).  Apps can store whatever data
  they want in the pod, and query for data from other apps and other
  users (using other pods).

  When you load this library, it will add a div to the DOM with id
  "pod-controller", which it uses to talk to the user, getting them to
  log in, etc.

*/

function CrosscloudPodClient(options) {

}


var pod = function () {

    // We're using Crockford's suggested maximal-encapsulation style,
    // not JS's normal inheritance style, to help dissuade apps from
    // tinkering with implementation internals.
    pod = {}

    // GET/SET items.  This interface is similar to LocalStorage, but
    // of course it's not local, and in fact is able to see other
    // people's public data.
    // 
    // The item values must be javascript objects.  Note that property
    // names starting with underscore are reserved.  Specifically:
    //
    //    _id is the global identifier of the object.  It will
    //    generally be an https URL and can be accessed through normal
    //    means (eg a browser or curl).
	//
    //    _owner is the id of the user's storage space (pod) which
    //    owns this object.  This can be considered to identify the
    //    user responsible for creating this item (in some app).
	//
    //    _etag is a string which will change whenever any part of the
    //     object changes.  In general etags will never be reused,
    //     although they might be if the item returns to a prior state.
	//
    //    _public is a boolean indicating whether the item is visible
    //     to the public or requires authorization to read (NOT
    //     IMPLEMENTED)
	//
    //    _content when present means that this resource behaves in
    //     part as a conventional web page.  This might be html, css,
    //     javascript, a jpeg, etc.  Requires _contentType also be
    //     set.  (NOT IMPLEMENTED)
	//
    //    _contentType the standard IANA media type of _content, if
    //    present (NOT IMPLEMENTED)
    //
    // It will soon be an error to use an undefined property.  See
    // defineProperty.
    //
    // When not logged in, the effect of these calls is queued up to
    // take effect when login happens.


    // add a new item to the pod storage, letting the pod assign the id
    //
    // calls callback(id, err) when done
	//
	// options = {
	//
	//     container: item in which to create this item; if container is 
	//                moved or removed, this item will be, too.  If absent,
	//                item is created directly in the pod (root container)
	//
	//     name: name for new item; if missing, a name will be
	//                assigned (typically a sequence number).  It is
	//                an error to state a name that's already taken.
	//                Invalid characters will be URL-escaped.
	//
	//     slug: like name, but only a hint; server will modify if
	//                necessary to make a reasonable-looking and
	//                unique name.
	//
	//     public: boolean initial value for _public
	//  
	// }
	//
    pod.createItem = function (newItemData, options, callback) {
    }


    // Modify item, replacing item newData._id with the given data.
    // 
	// If the _etag property is present, it is handled like an HTTP
	// ETag in a PUTs If-Match header.  That is, the replaceItem call
	// will fail if it turns out someone has modified the item in some
	// way.
    // 
    // calls callback(err) when done
    pod.replaceItem = function (newData, callback) {
    }

	// Modify item, like replaceItem, but only changing those
	// properties which are present in overlayData.  Use null values
	// to remove properties.  Values which are objects are handled
	// recursively as overlays.
	pod.overlayItem = function (overlayData, callback) {
	}


    // get the data (and etag) for given item, or
    // error if it doesn't exist
    //
    // calls callback(data), where data has _etag,
    // maybe _content and _contentType, _vocab, etc
    pod.getItem = function (id, callback) {
    };

    // removes the item
    pod.removeItem = function (id, callback) {
    };




	// Somewhat more advanced data modification operations...
	//

    // removes the item and all other items which have an id whose
    // text begins with the test of id.
    pod.removeTree = function (id, callback) {
    };

    // changes the items id from oldId to newId.  May be much more
    // efficient thant get+set, and also tells others about the move,
    // leaving in place a 301 Moved Permanently
    pod.moveItem = function (oldId, newId, callback) {
    }

    // like moveItem but also moves all items who have an id whose
    // text begins with the text of oldId; in the new location, that
    // suffix will remain.
    pod.moveTree = function(oldId, newId, callback) {
    }



    // Define a property of objects read/written by this application.
    //
    // name is property/key/field/attribute name used for it in this
    // application (eg "phoneNumber" for like { ..., phoneNumber:
    // "...", ...}
    //
    // type is 
    //    "object"
    //    "string"
    //    "float64"
    //    "decimal"
    //    "date"
    //    "boolean"
    //    "object set", "string set",...   unordered collection of these
    //    "object list", "string list", ...  ordered collection of these
    //
    // definition is an unambiguous natural language definition of the
    // property.  It should be phrased precisely enough that anyone else
    // who wrote the same text would mean the same thing.  If you want
    // multiple definitions for a property, call this multiple times with
    // the same name.   The first one will be considered primary.
    // Within the definition, syntax like [foo][] is used to link to
    // another property you define called "foo", ?item refers to the
    // item which has the property, and ?value refers to whatever the 
    // value of the property is.

    pod.defineProperty = function (name, type, definition) {
    }

    // TBD give it an set of properies, or the URL of such a set
    //
    pod.defineProperties = function (vocabulary) {
    }




    // offer some css you want to suggest make the login box look some way
    // (it's in an iframe so you can't control it directly)
    pod.setStyle = function (style) {

    }




    // does callback(userdata, err), each time user logs in to a different
    // pod.  userdata has _id (URL which identifies the user).
    //
    // does callback(null, err) on user logout
    pod.onLoginChange = function (callback) {

    }

    // get notified when a particular item changes.   watcher is:
    //
    //   w.item      item to watch (not id of item)
    //   w.onreplace called with the  new value when modified
	//   w.onoverlay called with an overlay json object, showing changes
    //   w.onmove    called with newid (also can appear as change to _id)
    //   w.onremove  called with no args
    pod.addItemWatcher = function(watcher) {
    }
    pod.removeItemWatcher = function(watcher) {
    }


    // Set up a query for certain objects (in this user's pod or in
    // someone else's pod that's accessible and determined to be
    // relevant).  Once the query is added, it runs until it's
    // removed.  As it's running, it updates the query object with
    // matches which appear and disappear.  That might be due to data
    // being added, access control being changed, network access
    // proceeding, processing proceeding, etc.
    //
    // These are FILTER queries (aka NoSQL queries), *NOT* joins.  If 
	// you want a join, use a Rule.
    //
    // Query Objects should be:
    //
    //   q.add    = function(newItem)
    //   q.remove = function(removedItem)
    //
    //       These signal that an object matching the query has
    //       appeared or has disappeared from the result set
    //
    //       q.remove is handed the exact same object that q.add was
    //       handed.  You can use the ._local property of that object
    //       to put your own information, such as DOM elements which
    //       reflect this value.  After q.remove is called on it once,
    //       it will never be used again.
	//
	//       Use item watchers if it matters when particular values are
	//       updated.  q.add and q.remove only tell you if an object
	//       joins/leaves a result set.
	//
    //   q.complete = function()
	//
	//       Called whenever the query processing is quiecent, having
	//       found all available results.  Will be called again if
	//       data changes in a way which adds or removes any items.
	//
    //   q.allResults = function(items)
    //       
    //       Shortcut for add/remove/complete.  If set, called
	//       whenever q.complete is called, but it's passed the set of
	//       all current results.    (map or list? @@)
    //
    //
    //   q.properties = [ ... ]
    //
    //       list of properties worth returning.  If not given, then
    //       all available ones are returned.    Generally much more
	//       efficient to include this.
	//
    //   q.filters = [ filter ]
    //
    //       a filter may be:
    //
    //       - the name of a property, in which case that property
    //         must be present (and non-null) in the matching item
    //
    //       - an array [property, operator, value], like ['age','>',21]
    //
    //       (other details TBD)
    //
    //   q.filterJS = "item.a > item.b && item.c === 33 && item.d !== null"
    //
    //       This is a JavaScript expression, in a string, which has
    //       one predefined term, "item".  The query matches for every
    //       item which makes this true for some var.  Only defined
    //       properties may be used.   Use === and !== not == and !=.
	//       Probably not actually run in a JS engine; just using JS
	//       expression syntax.   No side effects, functions, etc.
    //
    //

    pod.addQuery = function (queryObject) {
    }

    pod.removeQuery = function (queryObject) {
    }



	//
	//
	//    Rule API system to go here   
	//
	//    Both VirtualProperty rules and DerivedItem rules
	//
	//



    // See and/or change access control rules for some item
    //
    // The item's access controller has:
    //
    //    ac.readUsers   .forEach, .add, .remove
    //    ac.readGroups  .forEach, .add, .remove
    //
    // Or something like that...
    //
    // Basic public-or-not is the boolean _public property of every item
    //
    pod.itemAccessController = function (itemId) {
    }


	// Skins: look on the pod for items like { app:foo, defaultAppPreference: 100 }
	// and of the apps that say they can skin the data item, use the one with the 
	// highest preference
	//

	// Members.   Let's make _members be { id: item, ... } 
	// instead of [ { id: item }, ... ]
	
	// Can we abstract membership?
	//
	//    item._members   is a special value type, it's an { id: item } object
	//
	// for items which are classes ( object sets )
	//
	// Actually, that's just how object-sets are coded, I think.
	// String set is { string: true }, etc.
	//
	// This doesn't go well with LDP paging....
}();
