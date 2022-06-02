import { MongoClient } from 'mongodb';
import md5 from 'md5';

const client = new MongoClient('mongodb://mongo/test');

export default class User {

  constructor (params) {
    this.login = params.login;

    if (params.password) this.password = md5(params.password);
    if (params._id) this._id = params._id;
  }

  async save () {
    const conn = await client.connect(),
          db = conn.db();
    let result;

    if (this._id) result = await db.collection('user').updateOne({ _id: this._id }, this);
    else result = await db.collection('user').insertOne(this);

    conn.close();

    return result;
  }

}
