const cassandra = require('cassandra-driver');
const Q = require('q');

let client = null;

let creatConnection = (options) => {
    client = new cassandra.Client(options);
}

let funcresults = (callback, succmsg, failmsg) => {
    return (err, results) => {
        if (err) {
            callback(err, null, failmsg);
        } else {
            callback(null, results.rows, succmsg);
        }
    };
};


let queryReturn = (queryCQL, queryArg, callback, succmsg, failmsg) => {
    let queryExec = client.execute(queryCQL, queryArg, {prepare: true, fetchSize: 500000},
        funcresults(callback, succmsg, failmsg));
    console.log({queryCQL, queryArg, queryExec}, 'CQL stuff.');
};

let queryRunParallel = (listofqueries, callback) => {
    let queryReturn = [];
    let promises = [];
    console.log({listofqueries}, 'CQL stuff.');
    for (let eachidx in listofqueries) {
        let querycql = listofqueries[eachidx][1];
        let queryarg = listofqueries[eachidx][2];
        console.log({querycql, queryarg}, 'CQL stuff.');
        let queryDefered = Q.defer();
        client.execute(querycql, queryarg,
            {prepare: true, fetchSize: 500000},
            queryDefered.makeNodeResolver());
        listofqueries[eachidx].push(queryDefered);
        queryReturn.push(listofqueries[eachidx]);
        promises.push(queryDefered.promise);
    }
    Q.allSettled(promises).then(function(results) {
        let resultObj = {};
        let allSuccess = true;
        for (let eachidx in results) {
            let nextResult = results[eachidx];
            if (nextResult.state == 'fulfilled') {
                resultObj[listofqueries[eachidx][0]] = nextResult.value.rows;
            } else {
                resultObj[listofqueries[eachidx][0]] = nextResult.reason;
                allSuccess = false;
            }
        }
        if (allSuccess) callback(null, resultObj, 'All queries ran successfully');
        else {
            callback({ errs: resultObj }, null, 'Atleast one query failed');
        }
    });
};

module.exports = {
    creatConnection,
    queryReturn,
    queryRunParallel
};
