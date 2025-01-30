export const databaseUrlProvider = {
  provide: 'DATABASE_URL',
  useValue:
    process.env.DATABASE_URL ||
    'mysql://root:password@localhost:3306/cooslterlehrer',
};
