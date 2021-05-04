# cassandra-helper

> Cassandra helper functions which will make your code easier to fetch and write data to database. This library supports CQL transactions in a cleaner way. Its a wrapper upon cassandra-driver.

[![NPM](https://img.shields.io/npm/v/mysql-utils-js.svg)](https://www.npmjs.com/package/mysql-utils-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm i --save cassandra-helper
```

## Usage

```jsx
const cassutils = require('cassandra-helper');

const config = {
    contactPoints: ['h1', 'h2'],
    localDataCenter: 'datacenter1',
    keyspace: 'ks1'
};

// A generic callback which contains three parameters [err, data, msg]
const functioncallback = (err, data, msg) {
    console.log({err, data, msg})
}
const query = "SELECT * FROM table1 WHERE id = ? and name = ?" // sample query
const params = [1, 'name_1']; // sample parameter for above query

cassutils.createConnectionPool(config);
cassutils.connectAndRun(functioncallback, 
    cassutils.queryErrSucc(query, params, 
        (err) => {
            functioncallback(err, null, 'error happened'); 
        }, (data) => {
            functioncallback(null, data, 'success');
        }
    )
);
```

## License

ISC © [hanjas](https://github.com/hanjas)