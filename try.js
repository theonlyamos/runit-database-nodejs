import {
    Document
} from './index.js';

Document.initialize(
    'http://runit.test:9000/api',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4NzUyNjIxOSwianRpIjoiNTRlMjkxMWEtYzgzMS00YzU1LTlkOTctYmEwYjA4MjhjNDcwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYyYjAxY2E4ZGVmN2YzMTcwMDNiZWUyYiIsIm5iZiI6MTY4NzUyNjIxOSwiZXhwIjoxNjkwMTE4MjE5fQ.hj2ha9Sw8oCyt05cxGJJaGxImAhS30rsSMiqT6UIyHg',
    '648c7f6886abacf21d21faf2'
)

try {
    let docs = await Document.findOne('runnable_db', {'id': '648c9c00f10c6bdb5099f0b3'})
    // let docs = await Document.insertOne('runnable_db', {
    //     'name': 'checklist1',
    //     'type': 'checklist',
    //     'show_checked': false,
    //     'locked': false,
    //     'items': [1,2,3]
    // })
    console.log(docs)
} catch (error) {
    console.log(error)
}

