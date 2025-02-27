import { MySql2Database } from 'drizzle-orm/mysql2';
import { reset, seed } from 'drizzle-seed';
import * as schema from '../db/schema';
import { randomBytes } from 'crypto';

export default async function seedDb(db: MySql2Database): Promise<void> {
  await reset(db, schema);
  await seed(db, schema).refine((f) => ({
    passkeyTable: {
      columns: {
        cred_public_key: f.valuesFromArray({
          values: Array.from({ length: 10 }, () =>
            randomBytes(32).toString('hex'),
          ),
        }),
      },
    },
    lehrerTable: {
      count: 10,
    },
  }));
}
