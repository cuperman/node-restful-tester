/* global async */

(function() {
    var base = "",
        api = base + "/api";

    // helpers

    var errorCallback = function(jqXHR) {
        window.console.log("jqXHR", jqXHR);
        window.console.log("this", this);
        QUnit.ok(false, "Error from api when " + this.type + "ing " + this.url);
    };

    var sortObjectKeys = function(obj) {
        var newObject = {};
        Object.keys(obj).sort().forEach(function(key) {
            newObject[key] = obj[key];
        });
        return newObject;
    };

    var compareObjects = function(a, b) {
        return JSON.stringify(sortObjectKeys(a)) === JSON.stringify(sortObjectKeys(b));
    };

    var findObjectInArray = function(array, key, value) {
        var results = array.filter(function(obj) {
            return obj[key] === value;
        });
        return results[0];
    };

    var cloneObject = function(obj) {
        return jQuery.extend(true, {}, obj);
    };

    // test objects

    var testUser = {
        name: "Jeff Cooper",
        age: 31,
        birthdate: Date.parse("1982-06-05"),
        living: true,
        array: ["foo", "bar"],
        ofString: ["a", "b", "c"],
        ofNumber: [1, 2, 3],
        ofDates: [Date.parse("1999-12-31"), Date.parse("2009-10-11")],
        ofBoolean: [true, false],
        ofMixed: ["blue", 42],
        nested: {
            stuff: "blah"
        }
    };

    // tests

    QUnit.module("User CRUD");

    QUnit.asyncTest("Create User", function() {
        QUnit.expect(1);

        jQuery.post(api + "/users", testUser, function(result) {
                QUnit.ok(result, "POST user successful");
            })
            .fail(errorCallback)
            .always(QUnit.start);
    });

    QUnit.asyncTest("Read User", function() {
        QUnit.expect(6);

        async.waterfall([
            // create user
            function(callback) {
                jQuery.post(api + "/users", testUser, function(result) {
                        QUnit.ok(result, "POST user successful");
                        callback(null, result);
                    })
                    .fail(callback);
            },

            // get user
            function(createdUser, callback) {
                jQuery.get(api + "/users/" + createdUser._id)
                    .done(function(result) {
                        QUnit.ok(result, "GET user successful");
                        QUnit.ok(compareObjects(result, createdUser), "User matches created user");
                        callback(null, createdUser);
                    })
                    .fail(callback);
            },

            // get all users
            function(createdUser, callback) {
                jQuery.get(api + "/users")
                    .done(function(result) {
                        QUnit.ok(result, "GET all users successful");

                        var user = findObjectInArray(result, "_id", createdUser._id);
                        QUnit.ok(user, "All users includes created user");
                        QUnit.ok(compareObjects(user, createdUser), "User matches created user");

                        callback(null);
                    })
                    .fail(callback);
            }
        ], function(err) {
            if (err) {
                QUnit.ok(false, "Error");
            }
            QUnit.start();
        });
    });

    QUnit.asyncTest("Update User", function() {
        QUnit.expect(7);

        async.waterfall([
            // create user
            function(callback) {
                jQuery.post(api + "/users", testUser)
                    .done(function(result) {
                        QUnit.ok(result, "POST user successful");
                        callback(null, result);
                    })
                    .fail(callback);
            },

            // get user
            function(createdUser, callback) {
                jQuery.get(api + "/users/" + createdUser._id)
                    .done(function(result) {
                        QUnit.ok(result, "GET user successful");
                        QUnit.ok(compareObjects(result, createdUser), "User matches created user");
                        callback(null, createdUser);
                    })
                    .fail(callback);
            },

            // update user
            function(createdUser, callback) {
                var user = cloneObject(createdUser);
                user.name = "Dimebag Darrell";
                user.age = 38;
                user.birthdate = Date.parse("1966-08-20");
                user.living = false;
                user.array = ["re", "spect"];
                user.ofString = ["w", "a", "l", "k"];
                user.ofNumber = [4, 5, 6];
                user.ofDates = [Date.parse("2004-12-08")];
                user.ofBoolean = [true, false, true, true, false];
                user.ofMixed = ["cowboy", "from", "hell"];
                user.nested.stuff = "pantera";

                jQuery.ajax(api + "/users/" + user._id, {type: "PUT", data: user})
                    .done(function(result) {
                        QUnit.ok(result, "PUT updated user successful");
                        QUnit.ok(compareObjects(result, user), "User matches updated user");
                        callback(null, user);
                    })
                    .fail(callback);
            },

            // get user again
            function(updatedUser, callback) {
                jQuery.get(api + "/users/" + updatedUser._id)
                    .done(function(result) {
                        QUnit.ok(result, "GET updated user successful");
                        QUnit.ok(compareObjects(result, updatedUser), "User matches updated user");
                        callback(null, updatedUser);
                    })
                    .fail(callback);
            }
        ], function(err) {
            if (err) {
                QUnit.ok(false, "Error");
            }
            QUnit.start();
        });
    });

    QUnit.asyncTest("Delete User", function() {
        async.waterfall([
            // create user
            function(callback) {
                jQuery.post(api + "/users", testUser)
                    .done(function(result) {
                        QUnit.ok(result, "POST user successful");
                        callback(null, result);
                    })
                    .fail(callback);
            },

            // delete user
            function(createdUser, callback) {
                jQuery.ajax(api + "/users/" + createdUser._id, {type: "DELETE"})
                    .done(function() {
                        QUnit.ok(true, "DELETE user successful");
                        callback(null, createdUser);
                    })
                    .fail(callback);
            },

            // get user
            function(deletedUser, callback) {
                jQuery.get(api + "/users/" + deletedUser._id)
                    .done(function(result) {
                        QUnit.ok(!result, "GET deleted user returns no results");
                        callback(null);
                    })
                    .fail(callback);
            }
        ], function(err) {
            if (err) {
                QUnit.ok(false, "Error");
            }
            QUnit.start();
        });
    });
})();
