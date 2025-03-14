import {
  boolean,
  customType,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

const bytea = customType<{ data: Uint8Array; notNull: false; default: false }>({
  dataType() {
    return 'blob';
  },
  toDriver(value: Uint8Array) {
    return Buffer.from(value);
  },
  fromDriver(value: unknown) {
    return new Uint8Array(value as Buffer);
  },
});

export const lehrerTable = mysqlTable('lehrer_table', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const voteTable = mysqlTable('vote_table', {
  id: int('id').primaryKey().autoincrement(),
  lehrerId: int('lehrer_id')
    .references(() => lehrerTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  vote: int('vote').notNull(),
  abstimmungId: int('abstimmung_id')
    .references(() => abstimmungenTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
});

export const abstimmungenTable = mysqlTable('abstimmungen_table', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
});

export const passkeyTable = mysqlTable('passkey_table', {
  cred_id: varchar('cred_id', { length: 255 }).primaryKey(),
  cred_public_key: bytea('cred_public_key').notNull(),
  user_id: varchar('user_id', { length: 255 })
    .references(() => userTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  webauthn_user_id: varchar('webauthn_user_id', { length: 255 }).notNull(),
  counter: int('counter').notNull(),
  backup_eligible: boolean('backup_eligible').notNull(),
  backup_status: boolean('backup_status').notNull(),
  transports: varchar('transports', { length: 512 }).notNull(),
  created_at: timestamp('created_at').notNull(),
  last_used: timestamp('last_used').notNull(),
});

export const userTable = mysqlTable('user_table', {
  id: varchar('id', { length: 255 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  currentChallenge: varchar('current_challenge', { length: 255 }),
});
