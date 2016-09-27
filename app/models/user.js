var db = require("../middleware/db");
var uuid = require("node-uuid");
var deportament = db.Schema({
    Id: Number,
    ParentId: Number,
    Title: String,
    ShortTitle: String,
    HeadId: Number,
    IsTrgPoint: Boolean
})
var conntactionFaceZakaz = db.Schema({
    NameOrg: String
})
var sotrud = db.Schema({
    Id: Number,
    Family: String,
    SecondName: String,
    Name: String,
    Profession: String,
    Deportament: deportament,
    ConntactionFaceZakaz: conntactionFaceZakaz
})

var user = db.Schema({
    Title: String,
    Password: String,
    session: String,
    NameType: String,
    Sotrud: sotrud,
    NameOfLevelAccess: String
})


var notification = db.Schema({
    user: user,
    message: String,
    action: String,
    closed: Boolean
});


user.statics.createNewSession = function (userName, userPassword) {
    return new Promise(function (resolve, reject) {
        db.model("User", user).findOne({ Title: userName, Password: userPassword }, function (err, user) {
            if (err) {
                console.log("auth err", err);
                return reject(err);
            }
            if (!user) {
                console.log("auth err", "not users");
                return reject({ status: "ERROR", msg: "Пользователь не найден" });
            }
            user.session = uuid.v4();
            user.save(function (err) {
                if (err) {
                    console.log("save auth err", err);
                    reject(err);
                }
                resolve(user);
            })

        })
    });
}

user.methods.isInferior = function (user) {
    return new Promise(function (resolve, reject) {
        // Определить подчиненость
        reject("Нет доступа");
    });
}

user.statics.getUserBySession = function (session) {
    return new Promise(function (resolve, reject) {
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
result.deportament = deportament;
result.notifications = db.model("Notification", notification);
//result.events = db.model("Event", events);
module.exports = result;
