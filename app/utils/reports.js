var q = require("bluebird");
module.exports = {
    /*getScetchByRangeToConsultant: params => {
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
    },*/
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
    getByRangeCostToHeadBranch: params=>{
        return new q((resolve, reject) => {
            params.model.aggregate([
                {
                    $match: {
                        "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                        "user.NameFolder": params.user.NameFolder
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
                var cost = reportItem.reduce((p, c) => {
                    return p + c.cost || 0;
                }, 0)
                return resolve({ cost: cost, result: reportItem });
            })
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
                var cost = reportItem.reduce((p, c) => {
                    return p + c.cost || 0;
                }, 0)
                return resolve({ cost: cost, result: reportItem });
            })
        });
    },
    getByRangeCostToMaster: params => {
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
                var cost = reportItem.reduce((p, c) => {
                    return p + c.cost || 0;
                }, 0)
                return resolve({ cost: cost, result: reportItem });
            })
        });
    },
    /*getClientByRangeToConsultant: params => {
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
    },*/
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
                        _id: { day: "$day", month: "$month", year: "$year", type: "$type", group:"$user.Title" },
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
    getByRangeToHeadBranch: params => {
        return new q((resolve, reject) => {
            params.model.aggregate([
                {
                    $match: {
                        "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                        "user.NameFolder": params.user.NameFolder
                    }
                },
                {
                    $group: {
                        _id: { day: "$day", month: "$month", year: "$year", group: "$salon" },
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
                var allCount = reportItem.reduce((value, item) => {
                    return value + item.count ||0;
                }, 0);               
                return resolve({ count: allCount, result: reportItem });
            })
        });
    },
    getByRangeToMaster: params => {
        return new q((resolve, reject) => {
            params.model.aggregate([
                {
                    $match: {
                        "stamp": { "$gte": params.range.start, "$lte": params.range.end },
                    }
                },
                {
                    $group: {
                        _id: { day: "$day", month: "$month", year: "$year", group: "$salon", type:"$type" },
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
                var cost = reportItem.reduce((p, c) => {
                    return p + c.count || 0;
                }, 0)
                return resolve({ count: cost, result: reportItem });
            });
        });
    }
}