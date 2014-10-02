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
    //     object changes
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
    // return error if (etag) and item has changed
    // since it had that etag
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

    // be notified when the given item changes
    //
    // calls callback(newData) each time the item
    // changes.   Use addQuery for more complex
    // apps.  Wont call again until/unless callback
    // returns true
    pod.onItemChange = function (url, callback) {
    
    }


    // Set up a query for certain objects (in this user's pod or in
    // someone else's pod that's accessible and determined to be
    // relevant).  Once the query is added, it runs until it's
    // removed.  As it's running, it updates the query object with
    // matches which appear and disappear.  That might have do to data
    // being added, access control being changed, network access
    // proceeding, processing proceeding, etc.
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
