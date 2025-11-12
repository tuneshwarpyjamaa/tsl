import { getClient } from '../config/db.js';

export const db = {
  query: (text, params) => getClient().query(text, params),
  one: (text, params) => getClient().query(text, params).then(res => res.rows[0]),
  many: (text, params) => getClient().query(text, params).then(res => res.rows),
  manyOrNone: (text, params) => getClient().query(text, params).then(res => res.rows),
  any: (text, params) => getClient().query(text, params).then(res => res.rows),
  none: (text, params) => getClient().query(text, params)
};