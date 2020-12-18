export const createTables = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS testtable (
    id INTEGER PRIMARY KEY NOT NULL,
    test TEXT
  );
  COMMIT TRANSACTION
`;