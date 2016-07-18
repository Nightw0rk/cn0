var user = require("../models/user");
module.exports = function (params) {
    return function (req, res, next) {
        session = req.body.session || req.query.session || req.headers["X-Session"];
        user.getUserBySession(session)
            .then((user) => {
                req.user = user;
                return next(null);                
            })
            .catch((err) => {                
                return res.send(err);                
            });
    }
}
