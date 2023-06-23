export class Model {
    static TABLE_NAME = "";
    static SELECTED_COLUMNS = [];
    static WHERE_CLAUSE = [];
    static GROUP_BY = "";
    static ORDER_BY = [];
    static LIMIT = 0;

    constructor(createdAt, updatedAt, id) {
        const now = new Date().toUTCString();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
        this.id = id || uuid();
    }

    static createTable() {
        /*
            Create Database Table for model (Only in Mysql).\n
            E.g: `CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME}
                (
                id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name varchar(50) not null,
                email varchar(100) not null,
                password varchar(500) not null,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )`
            
            @paramas None
            @return Database query result
        */
    }

    static async save() {
        const data = {};
        return await DBMS.Database.insert(Model.TABLE_NAME, data);
    }

    static async update(update, query = {}) {
        if (DBMS.Database.dbms === 'mongodo') {
            update['updated_at'] = (new Date()).toUTCString();
        }
        return await DBMS.Database.update(this.TABLE_NAME, this.normalise(query, 'params'), update);
    }

    static async remove(query) {
        return await DBMS.Database.remove(this.TABLE_NAME, this.normalise(query, 'params'));
    }

    static async count() {
        return await DBMS.Database.count(this.TABLE_NAME);
    }

    static async sum(column) {
        return await DBMS.Database.sum(this.TABLE_NAME, column);
    }

    static async get(id = null) {
        if (id !== null) {
            let model = await DBMS.Database.find_one(this.TABLE_NAME, this.normalise({
                id: id
            }, 'params'));
            return new this(...Object.values(this.normalise(model))) || null;
        }

        let query = `SELECT `;
        if (this.SELECTED_COLUMNS) {
            query += typeof this.SELECTED_COLUMNS === 'string' ? this.SELECTED_COLUMNS : this.SELECTED_COLUMNS.join(', ');
        } else {
            query += `*`;
        }

        query += ` FROM ${this.TABLE_NAME}`;

        if (this.WHERE_CLAUSE.length) {
            query += ` WHERE`;
            for (let clause of this.WHERE_CLAUSE) {
                if (typeof clause === 'string') {
                    query += ` (${clause}) AND`;
                } else if (typeof clause === 'object') {
                    query += ` (`;
                    for (let [key, value] of Object.entries(clause)) {
                        query += `${key}='${value}' AND `;
                    }
                    query = query.replace(/AND $/, '').trim();
                    query += `) AND`;
                }
            }
            query = query.replace(/AND$/, '').trim();
        }

        if (this.GROUP_BY) {
            query += ` GROUP BY ${this.GROUP_BY}`;
        }

        if (this.ORDER_BY.length) {
            query += ` ORDER BY ${this.ORDER_BY[0]} ${this.ORDER_BY[1]}`;
        }

        if (this.LIMIT) {
            query += ` LIMIT ${this.LIMIT}`;
        }

        this.clear();

        return await DBMS.Database.query(query);
    }


    static async all() {
        /*
          Class Method for retrieving all 
          model data from database
      
          @params None
          @return List[Model] instance(s)
          */

        const results = await DBMS.Database.find(this.TABLE_NAME, {});
        return results.map(elem => new this(...this.normalise(elem)));
    }

    static async find(params) {
        /*
          Class Method for retrieving models
          by provided parameters
      
          @param params
          @return List[Model]
          */

        const results = await DBMS.Database.find(this.TABLE_NAME, this.normalise(params, 'params'));
        return results.map(elem => new this(...this.normalise(elem)));
    }

    static async query(column, search) {
        /*
          Class Method for retrieving products
          by their names
      
          @param name
          @return Product Instance
          */

        const sql = `SELECT * from ${this.TABLE_NAME} WHERE ${column} LIKE '%${search}%'`;
        const results = await DBMS.Database.query(sql);
        return results.map(elem => new this(...this.normalise(elem)));
    }

    static async select(columns) {
        /**
         * Class Method for retrieving model
         * grouped by specified column
         *
         * @param column Column Name to group by
         * @return Class
         */

        this.SELECTED_COLUMNS = columns;
        return this;
    }

    static async where(clause) {
        /**
         * Class Method for retrieving model
         * grouped by specified column
         *
         * @param column Column Name to group by
         * @return Class
         */

        this.WHERE_CLAUSE.push(clause);
        return this;
    }

    static async groupBy(column) {
        /**
         * Class Method for retrieving model
         * grouped by specified column
         *
         * @param column Column Name to group by
         * @return Class
         */

        this.GROUP_BY = column;
        return this;
    }

    static async orderBy(column, order = 'ASC') {
        this.ORDER_BY = [column, order.toUpperCase()];
        return this;
    }

    static async limit(count = 0, offset = 0) {
        this.LIMIT = `${count}`;
        if (offset) {
            this.LIMIT += `, ${offset}`;
        }
        return this;
    }

    async json() {
        return {};
    }

    static clear() {
        this.SELECTED_COLUMNS = []
        this.WHERE_CLAUSE = []
        this.GROUP_BY = ""
        this.ORDER_BY = []
        this.LIMIT = 0
    }

    static async normalise(content, optype = 'dbresult') {
        let normalized = {};
        if (DBMS.Database.dbms === 'mongodb') {
            if (optype === 'dbresult') {
                let elem = Object.assign({}, content);
                elem.id = elem._id.toString();
                delete elem._id;
                for (let key of Object.keys(elem)) {
                    if (key.endsWith('_id')) {
                        elem[key] = elem[key].toString();
                    }
                }
                normalized = elem;
            } else {
                if ('id' in content) {
                    content._id = ObjectId(content.id);
                    delete content.id;
                }
                for (let key of Object.keys(content)) {
                    if (key.endsWith('_id')) {
                        content[key] = ObjectId(content[key]);
                    }
                }
                for (let [key, value] of Object.entries(content)) {
                    if (Array.isArray(value)) {
                        content[key] = value.map(v => v.toString()).join('::');
                    }
                }
                normalized = content;
            }
            return normalized;
        }
        return content;
    }
}