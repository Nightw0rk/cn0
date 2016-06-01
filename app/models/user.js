var db = require("../middleware/db");
var q = require("bluebird");
var uuid = require("node-uuid");
var deportament  = db.Schema({
  Id:Number,
  ParentId:Number,
  Title:String,
  ShortTitle:String,
  HeadId:Number,
  IsTrgPoint:Boolean
})

var sotrud = db.Schema({
    Id:Number,
    Family:String,
    SecondName:String,
    Name:String,
    Profession:String,
    Deportament:deportament
})

var user = db.Schema({
    Title: String,
    Password: String,
    session:  String
    NameType: String
    Sotrud:sotrud,
    NameOfLevelAccess:String
})

user.statics.createNewSession = function (userName, userPassword) {
    console.log("begin auth");
    return new q(function (resolve, reject) {
        db.model("User", user).findOne({ Title: userName, Password: userPassword }, function (err, user) {
            if (err) {
                console.log("auth err",err);
                return reject(err);
            }
            if (!user) {
                console.log("auth err","not users");
                return reject({ status: "ERROR", msg: "Пользователь не найден" });
            }
            user.session = uuid.v4();
            user.save(function (err) {
                if (err) {
                    console.log("save auth err",err);
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
