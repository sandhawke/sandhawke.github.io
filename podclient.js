"use scrict";
/*
  
  In-browser API for accessing a world of linked data through the
  user's personal online database (pod).  Apps can store whatever data
  they want in the pod, and query for data from other apps and other
  users.

  Actual login processing and network access might be done in a loaded
  iframe, so pod providers can use modified network protocols and
  perhaps to avoid some CORS issues.

*/

var pod = function () {

    // We're using Crockford's suggest maximally-encapsulated style,
    // not JS's normal inheritance style, to help dissuade apps from
    // tinkering with implementation internals.
    pod = {}

    // GET/SET items.  This interface is a lot like LocalStorage, but
    // of course it's not local, and in fact is able to see other
    // people's public data.  
    // 
    // The item values must be javascript objects.  Note that property
    // names starting with underscore are reserved.  Specifically:
    //
    //    _id is the global identifier (URL) of the object
    //    _owner is the id of the system (pod) which owns this object
    //    _etag is a string which will change whenever any part of the 
    //     object changes.  In general etags will never be reused, although
	//     they can be if the item returns to a prior state.
	//    _public is a boolean indicating whether the item is visible to
	//     the public or requires authorization to read
    //    _content when present means that this resource behaves in part 
    //     as a conventional web page.   This might be html, css, javascript, 
    //     a jpeg, etc.   Requires _contentType also be set
    //    _contentType the standard IANA media type of _content, if present
    //
    // It will soon be an error to use an undefined property.  See
    // defineProperty.
    //
    // When not logged in, the effect of these calls is queued up to
    // take effect when login happens.


    // add a new item to the pod storage, letting the pod assign the id
    //
    // calls callback(id, err) when done
    pod.createItem = function (item, callback) {
    }


    // set new data for item, creating if necessary
    // 
    // return error if etag provided and item has changed
    // since it had that etag; this allows client to make
	// sure no one else has changed it
    // 
    // calls callback(err) when done
    pod.setItem = function (id, newData, etag, callback) {
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
    //   w.item      id of the item to watch
    //   w.onupdate  called with new value (or with just the modified fields?)
    //   w.onmove    called with newid (might also appear as onupdate on _id)
    //   w.onremove  called with no args
    pod.addItemWatcher = function(watcher) {
    }
    pod.removeItemWatcher = function(watcher) {
    }

    // Set up a query for certain objects (in this user's pod or in
    // someone else's pod that's accessible and determined to be
    // relevant).  Once the query is added, it runs until it's
    // removed.  As it's running, it updates the query object with
    // matches which appear and disappear.  That might have do to data
    // being added, access control being changed, network access
    // proceeding, processing proceeding, etc.
    //
    // Query items do NOT have _id, etc, unless those properties are
    // requested, and if a join is done are not subsets of objects anyone
    // added.   (Similarly, provenance information will be provided only
    // if asked for in the query.)
    //
    // Query Objects should be:
    //
    //   q.add    = function(newItem)
    //   q.update = function(updatedItem)
    //   q.remove = function(removedItem)
    //
    //       These signal that an object matching the query has
    //       appeared, has changed, or has disappeared (perhaps
    //       because it changed to no longer match the query).
    //
    //       q.update and q.remove are handed the exact same object
    //       that q.add was handed.  You can use the ._local property
    //       of that object to put your own information, such as DOM
    //       elements which reflect this value.  After q.remove is
    //       called on it once, it will never be used again.
    //
    //   q.properties = [ ... ]
    //
    //       list of properties worth returning.  If not given, then
    //       all available ones are returned.

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
    //   q.filterJS = "item.a > item.b && item.c = var.x && var.x.name=='foo'"
    //
    //       This is a JavaScript expression, in a string, which has two
    //       predefined terms, "item" and "var".  The query matches for every
    //       item which makes this true for some var.  Only defined properties
    //       may be used.
    //
    //   q.complete = function()
    //   q.completeWithItems = function(items)
    //       
    //       Called if the query has succeeded in obtaining all the
    //       currently matching items.  Does not mean the query is
    //       done -- as the data changes, more calls to add, update,
    //       remove, and complete may be done.
    //
    //       completeWithItems is passed new array with all the
    //       current items in it.  This is a convenience function.
    //
    //
    //

    pod.addQuery = function (queryObject) {
    }

    pod.removeQuery = function (queryObject) {
    }

    //  (This is a sketch of something we probably want...)
    //
    //  r.ifJS          an expression like q.filterJS
    //  r.thenValuesJS  an object whose keys are properties and values are 
    //                  JavaScript expressions to run when ifJS is true;
    //                  the values of item and var will be assigned before
    //                  these are evaluated.  This will be a new item unless
    //                  it has { _id: "_id" } 
    //                  We could do without this part, but we'd have extra
    //                  work calculating fields that might not be asked for
    //  r.thenCommonJS  some JS code to run after ifJS is matched and before
    //                  r.thenValuesJS expressions are evaluated
    //  r.thenConstraintJS  an expression like q.filterJS which is required
    //                  to be true at rule completion.  This may help catch
    //                  errors, but mostly it allows for somewhat efficient
    //                  rule execution (that is, backward chaining)
    //
	//  All of the JS bits should be considered to be running in a highly
	//  constrained/sandboxed environment.
	//
	//  In general, complex queries should be broken down into rules.
	//
	//  @@@todo: decide how these differ from normal items.  If you created
	//  an item with these fields, or someone else did, would it automatically
	//  be used?   I think maybe, give or take trust/provenance limits.
	//
	//  so maybe we need a rule-filtering-rule?  :-)
	//
	pod.addRule = function (ruleObject) {
	}
	pod.removeRule = function (ruleObject) {
	}

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


}();
