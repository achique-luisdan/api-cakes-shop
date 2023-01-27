import {Connection, createConnection } from 'typeorm';
import Database from 'better-sqlite3';

export class TestHelper {

    private static _instance: TestHelper;

    private constructor() {}

    public static get instance(): TestHelper {
        if(!this._instance) this._instance = new TestHelper();

        return this._instance;
    }

    private dbConnect!: Connection;
    private testdb!: any;


    async setupTestDB() {
        this.testdb = new Database(':memory:', { verbose: console.log });
        this.dbConnect = await createConnection({
            name: 'default',
            type: 'better-sqlite3',
            database: ':memory:',
            entities: ['src/entities/**/*.ts'],
            synchronize: true
        });
    }

    teardownTestDB() {
        this.dbConnect.close();
        this.testdb.close();
    }

}