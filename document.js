const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

class DocumentType {
    static __getAttr__(cls, key) {
        cls.COLLECTION = key;
        return cls;
    }
}

class Document {
    static COLLECTION = "";

    static RUNIT_API_ENDPOINT = process.env.RUNIT_API_ENDPOINT || "";
    static RUNIT_API_KEY = process.env.RUNIT_API_KEY || "";
    static RUNIT_PROJECT_ID = process.env.RUNIT_PROJECT_ID || "";
    static REQUEST_API = `${Document.RUNIT_API_ENDPOINT}/document/`;
    static HEADERS = {};

    static initialize(
        api_endpoint = process.env.RUNIT_API_ENDPOINT || "",
        api_key = process.env.RUNIT_API_KEY || "",
        project_id = process.env.RUNIT_PROJECT_ID || ""
    ) {
        Document.API_ENDPOINT = api_endpoint;
        Document.API_KEY = api_key;
        Document.PROJECT_ID = project_id;
        Document.REQUEST_API = `${api_endpoint}/document/${project_id}/`;
        Document.HEADERS["Authorization"] = `Bearer ${api_key}`;
    }

    static async count(collection = "", _filter = {}) {
        collection = collection || Document.COLLECTION;
        const document_api = `${Document.REQUEST_API}${collection}/`;
        const data = {
            function: "count",
            _filter
        };

        const req = await axios.post(document_api, data, {
            headers: Document.HEADERS
        });
        return req.data;
    }

    static async select(collection, projection = [], _filter = {}) {
        const document_api = `${Document.REQUEST_API}${collection}`;
        const data = {
            function: "select",
            projection,
            _filter
        };

        const req = await axios.get(document_api, {
            params: data,
            headers: Document.HEADERS
        });
        return req.data;
    }

    static async all(collection = "", projection = []) {
        collection = collection || Document.COLLECTION;
        const document_api = `${Document.REQUEST_API}${collection}/`;
        const data = {
            function: "all",
            projection
        };

        const req = await axios.post(document_api, data, {
            headers: Document.HEADERS
        });
        return req.data;
    }

    static async findOne(collection = "", _filter = {}, projection = []) {
        collection = collection || Document.COLLECTION;
        const document_api = `${Document.REQUEST_API}${collection}/`;
        const data = {
            function: "find",
            _filter,
            projection
        };

        const req = await axios.post(document_api, data, {
            headers: Document.HEADERS
        });
        return req.data;
    }

    static async find(collection = '', _filter = {}, projection = []) {
        collection = collection || this.COLLECTION;
        const documentApi = this.REQUEST_API + collection + '/';
        const data = {};
        data.function = 'all';
        data._filter = _filter;
        data.projection = projection;

        const req = await axios.post(documentApi, {
            json: data,
            headers: this.HEADERS
        });
        return req.data;
    }

    static async insert_one(collection = '', document = {}) {
        collection = collection || this.COLLECTION;
        let documentApi = `${this.REQUEST_API}${collection}/`;

        let data = {};
        data['function'] = 'insert';
        data['document'] = document;

        let req = await axios.post(documentApi, data, {
            headers: this.HEADERS
        });
        return req.data;
    }

    static async insertMany(collection = '', document = []) {
        collection = collection || this.COLLECTION;
        const documentApi = `${this.REQUEST_API}${collection}/`;

        const data = {};
        data.function = 'insert';
        data.document = document;

        const req = await axios.post(documentApi, data, {
            headers: this.HEADERS
        });
        return req.data;
    }

    static async update(collection = '', _filter = {}, update = []) {
        collection = collection || this.COLLECTION;
        let documentApi = this.REQUEST_API + collection + '/';
        let data = {};
        data['function'] = 'update';
        data['_filter'] = _filter;
        data['update'] = update;

        const req = await axios.post(documentApi, data, {
            headers: this.HEADERS
        });
        return req.data;
    }

    static async remove(collection = '', _filter = {}) {
        collection = collection || this.COLLECTION;
        const documentApi = `${this.REQUEST_API}${collection}/`;

        const res = await axios.post(documentApi, {
            function: 'remove',
            _filter: _filter
        }, {
            headers: this.HEADERS
        });
        return res.data;
    }
}