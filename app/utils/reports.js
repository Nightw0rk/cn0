var q = require("bluebird");
module.exports = {
    getScetchByRangeToConsultant: params => {
        return new q((resolve, reject) => {
            params.model.find({
                "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                "user.Title": params.user.Title
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                var allCount = result.reduce((value, item) => {
                    return value + item.count;
                }, 0);
                result.allCount = allCount || 0;
                return resolve(result);
            });
        });
    },
    getByRangeToConsultant: params => {
        return new q((resolve, reject) => {
            params.model.find({
                "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                "user.Title": params.user.Title
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                var allCount = result.reduce((value, item) => {
                    return value + item.count;
                }, 0);
                result.count = allCount || 0;
                result.result = [];
                return resolve(result);
            });
        });
    },
    getByRangeCostToConsultant: params => {
        return new q((resolve, reject) => {
            params.model.find({
                "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                "user.Title": params.user.Title
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                var allCount = result.reduce((value, item) => {
                    return value + item.cost;
                }, 0);
                result.cost = allCount || 0;
                return resolve(result);
            });
        });
    },
    getByRangeCostToHeadSalon: params => {
        return new q((resolve, reject) => {
            params.model.aggregate([
                {
                    $match: {
                        "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                        "salon": new RegExp(params.user.Sotrud.Deportament.Title.split(' ')[0])
                    }
                },
                {
                    $group: {
                        _id: { day: "$day", month: "$month", year: "$year" },
                        cost: { $sum: "$cost" }
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
                    return resolve({ cost: 0, result: [] });
                }
                return resolve({ cost: reportItem[0].cost || 0, result: reportItem });
            })
        });
    },
    getClientByRangeToConsultant: params => {
        return new q((resolve, reject) => {
            params.model.find({
                "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                "user.Title": params.user.Title
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
    getByRangeToHeadSalon: params => {
        return new q((resolve, reject) => {
            params.model.aggregate([
                {
                    $match: {
                        "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                        "salon": new RegExp(params.user.Sotrud.Deportament.Title.split(' ')[0])
                    }
                },
                {
                    $group: {
                        _id: { day: "$day", month: "$month", year: "$year", type: "$type" },
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
                    return resolve({ count: 0, result: [] });
                }
                return resolve({ count: reportItem[0].count || 0, result: reportItem });
            })
        });
    },
    getClientByRangeToHeadBranch: params => {
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
    getClientByRangeToMaster: params => {
        return new q((resolve, reject) => {
            params.model.aggregate([
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
                return resolve(reportItem[0].count || 0);
            });
        });
    }
}