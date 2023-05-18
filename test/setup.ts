import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnectionManager } from "typeorm";

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'))
  } catch (err) {

  }
});

global.afterEach(async () => {

  // const conn = getConnectionManager().get('test');
  //
  // await conn.close();
});