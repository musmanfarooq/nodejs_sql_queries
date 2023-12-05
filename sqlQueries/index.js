export const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS demo;";
export const useDatabaseQuery = "USE demo;";
export const createTableQuery = `
  CREATE TABLE IF NOT EXISTS beers (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(25),
    tagline VARCHAR(25),
    description VARCHAR(25),
    PRIMARY KEY (id)
  );
`;

