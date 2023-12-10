import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

class DocumentObject {
  static COLLECTION = '';

  static RUNIT_API_ENDPOINT = process.env.RUNIT_API_ENDPOINT || '';
  static RUNIT_API_KEY = process.env.RUNIT_API_KEY || '';
  static RUNIT_PROJECT_ID = process.env.RUNIT_PROJECT_ID || '';
  static REQUEST_API = `${DocumentObject.RUNIT_API_ENDPOINT}/document/`;
  static HEADERS = {};

  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        if (!(prop in target)) {
          target[prop] = new DocumentObject();
          DocumentObject.COLLECTION = prop
        }
        return target[prop];
      },
    });
  }

  initialize(
    api_endpoint = process.env.RUNIT_API_ENDPOINT || '',
    api_key = process.env.RUNIT_API_KEY || '',
    project_id = process.env.RUNIT_PROJECT_ID || ''
  ) {
    DocumentObject.API_ENDPOINT = api_endpoint;
    DocumentObject.API_KEY = api_key;
    DocumentObject.PROJECT_ID = project_id;
    DocumentObject.REQUEST_API = `${DocumentObject.API_ENDPOINT}/document/${DocumentObject.PROJECT_ID}/`;
    DocumentObject.HEADERS['Authorization'] = `Bearer ${DocumentObject.API_KEY}`;
  }

  async count(collection = '', _filter = {}) {
    try {
      collection = collection || DocumentObject.COLLECTION;
      const document_api = `${DocumentObject.REQUEST_API}${collection}/`;
      const data = {
        function: 'count',
        _filter,
      };

      const req = await axios.post(document_api, data, {
        headers: DocumentObject.HEADERS,
      });
      return req.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }

  async select(collection, projection = [], _filter = {}) {
    try {
      const document_api = `${DocumentObject.REQUEST_API}${collection}`;
      const data = {
        function: 'select',
        projection,
        _filter,
      };

      const req = await axios.get(document_api, {
        params: data,
        headers: DocumentObject.HEADERS,
      });
      return req.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }

  async all(collection = '', projection = []) {
    try {
      collection = collection || DocumentObject.COLLECTION;

      const document_api = `${DocumentObject.REQUEST_API}${collection}/`;
      const data = {
        function: 'all',
        _filter: {},
        projection,
      };

      const req = await axios.post(document_api, data, {
        headers: DocumentObject.HEADERS,
      });
      return req.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }

  async findOne(collection = '', _filter = {}, projection = []) {
    try {
      collection = collection || DocumentObject.COLLECTION;
      const document_api = `${DocumentObject.REQUEST_API}${collection}/`;
      const data = {
        function: 'find_one',
        _filter,
        projection,
      };

      const req = await axios.post(document_api, data, {
        headers: DocumentObject.HEADERS,
      });
      return req.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }

  async find(collection = '', _filter = {}, projection = []) {
    try {
      collection = collection || DocumentObject.COLLECTION;
      const documentApi = DocumentObject.REQUEST_API + collection + '/';
      const data = {};
      data.function = 'find';
      data._filter = _filter;
      data.projection = projection;

      const req = await axios.post(documentApi, data, {
        headers: DocumentObject.HEADERS,
      });
      return req.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }

  async insertOne(collection = '', document = {}) {
    try {
      collection = collection || DocumentObject.COLLECTION;
      let documentApi = `${DocumentObject.REQUEST_API}${collection}/`;

      let data = {};
      data['function'] = 'insert';
      data['document'] = document;

      let req = await axios.post(documentApi, data, {
        headers: DocumentObject.HEADERS,
      });
      return req.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }

  async insertMany(collection = '', documents = []) {
    try {
      collection = collection || DocumentObject.COLLECTION;
      const documentApi = `${DocumentObject.REQUEST_API}${collection}/`;

      const data = {};
      data.function = 'insert_many';
      data.documents = documents;

      const req = await axios.post(documentApi, data, {
        headers: DocumentObject.HEADERS,
      });
      return req.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }

  async update(collection = '', _filter = {}, update = []) {
    try {
      collection = collection || DocumentObject.COLLECTION;
      let documentApi = DocumentObject.REQUEST_API + collection + '/';
      let data = {};
      data['function'] = 'update';
      data['_filter'] = _filter;
      data['update'] = update;

      const req = await axios.post(documentApi, data, {
        headers: DocumentObject.HEADERS,
      });
      return req.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }

  async remove(collection = '', _filter = {}) {
    try {
      collection = collection || DocumentObject.COLLECTION;
      const documentApi = `${DocumentObject.REQUEST_API}${collection}/`;

      const res = await axios.post(
        documentApi,
        {
          function: 'remove',
          _filter: _filter,
        },
        {
          headers: DocumentObject.HEADERS,
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }
}

export const Document = new DocumentObject()
