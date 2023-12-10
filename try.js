import {
    Document
} from './index.js';

Document.initialize(
    'http://runit.test:9000/api',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4Nzc3NDU3NSwianRpIjoiOWEyMDQwNDEtODU3ZS00NDcyLTliNTMtNmI2YmU1MmFmNjdkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYzNWFiM2EzNzU0NGFjZDZjZDAyZGVkMiIsIm5iZiI6MTY4Nzc3NDU3NSwiZXhwIjoxNjkwMzY2NTc1fQ.mld7tPmJCKLT_sm82EgFiq_4Obj8YOszIDL_c96oyLk',
    '63d6a50cf55a1a560f5a6de4'
)

try {
    let docs = await Document.find('scratch', {'type': 'note'})
    // let docs = await Document.insertOne('runnable_db', {
    //     'name': 'checklist1',
    //     'type': 'checklist',
    //     'show_checked': false,
    //     'locked': false,
    //     'items': [1,2,3]
    // })
    let doc = docs[0]
    console.log(doc.text.trimEnd())
} catch (error) {
    console.log(error)
}

