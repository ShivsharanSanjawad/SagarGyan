CREATE TABLE dataset (
    datasetID       TEXT PRIMARY KEY ,       -- unique identifier for each ZIP/archive
    format          TEXT,                   -- e.g., "DwC-A","PNG"
    name            TEXT,                   -- optional: dataset title
    emlXML          TEXT,                   
    ingestionDate   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


