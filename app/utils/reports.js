var q = require("bluebird");
module.exports = {
    getClientByRangeToConsultant = params => {
        return new q((resolve, reject) => {
            params.model.find({
                "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                "user._id": params.user._id
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                var allCount = result.reduce((value, item) => {
                    return value + item.count;
                }, 0);
                result.allCount = allCount;
                return resolve(result);
            });
        });
    },
    getClientByRangeToHeadSalon = params => {
        return new q((resolve, reject) => {
            local_model.aggregate([
                {
                    $match: {
                        "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                        "user.Sotrud.Deportament.HeadId": user.Sotrud.Id
                    }
                },
                {
                    $group: {
                        _id: { day: "$day", month: "$month", year: "$year" },
                        count: { $sum: "$count" }
                    }
                }
            ], (err, reportItem) => {
                if (err) {
                    return reject(err);
                }
                if (!reportItem) {
                    return resolve(0);
                }
                if (!reportItem.length) {
                    return resolve(0);
                }
                var allCount = result.reduce((value, item) => {
                    return value + item.count;
                }, 0);
                reportItem.all
                return resolve(reportItem[0].count || 0);
            })
        });
    },
    getClientByRangeToHeadBranch = params => {
        return new q((resolve, reject) => {
            local_model.aggregate([
                {
                    $match: {
                        "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                        "user.NameFolder": user.NameFolder
                    }
                },
                {
                    $group: {
                        _id: { day: "$day", month: "$month", year: "$year" },
                        count: { $sum: "$count" }
                    }
                }
            ], (err, reportItem) => {
                if (err) {
                    return reject(err);
                }
                if (!reportItem) {
                    return resolve(0);
                }
                if (!reportItem.length) {
                    return resolve(0);
                }
                var allCount = result.reduce((value, item) => {
                    return value + item.count;
                }, 0);
                reportItem.all
                return resolve(reportItem[0].count || 0);
            })
        });
    },
    getClientByRangeToMaster = params => {
        local_model.aggregate([
            {
                $match: {
                    "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                }
            },
            {
                $group: {
                    _id: { day: "$day", month: "$month", year: "$year" },
                    count: { $sum: "$count" }
                }
            }
        ], (err, reportItem) => {
            if (err) {
                return reject(err);
            }
            if (!reportItem) {
                return resolve(0);
            }
            if (!reportItem.length) {
                return resolve(0);
            }
            var allCount = result.reduce((value, item) => {
                return value + item.count;
            }, 0);
            reportItem.all
            return resolve(reportItem[0].count || 0);
        })
    }
};