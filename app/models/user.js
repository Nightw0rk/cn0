var db = require("../middleware/db");
var q = require("bluebird");
var uuid = require("node-uuid");

var user = db.Schema({
    name: String,
    password: String,
    session: String
})

user.statics.createNewSession = function (userName, userPassword) {
    return new q(function (resolve, reject) {
        db.model("User", user).findOne({ name: userName, password: userPassword }, function (err, user) {
            if (err) {
                return reject(err);
            }
            if (!user) {
                return reject({ status: "ERROR", msg: "Пользователь не найден" });
            }
            user.session = uuid.v4();
            user.save(function (err) {
                if (err) {
                    reject(err);
                }
                resolve(user.session);
            })

        })
    });
}

user.methods.isInferior = function (user) {
    return new q(function (resolve, reject) {
        // Определить подчиненость
        reject("Нет доступа");
    });
}

user.statics.getUserBySession = function (session) {
    return new q(function (resolve, reject) {
        console.log("Find user with session",session);
        db.model("User", user).findOne({ session: session }, function (err, user) {
            if (err) {
                return reject(err);
            }
            if (!user) {
                return reject({ status: "ERROR", msg: "Пользователь не найден" });
            }
            resolve(user);
        })
    });
}
var result = db.model("User", user);
result.schema = user;
module.exports = result;
