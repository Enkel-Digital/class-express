-- SQL script to test and play around with using time and timestamp in PostgreSQL
-- 


-- set timezone = 'Asia/Singapore';
set timezone = 'utc';
show timezone;

-- select EXTRACT(EPOCH FROM now() at time zone 'utc')::bigint;
-- select (now() at time zone 'utc')::timestamptz;
select now();
-- select now() at time zone 'Asia/Singapore'

DROP TABLE IF EXISTS t;
CREATE TABLE "t" (
	"id" SERIAL PRIMARY KEY NOT NULL,
--  "createdAt" timestamptz DEFAULT (now() at time zone 'utc'),
--  "createdAt" timestamp DEFAULT (now() at time zone 'utc'),
--  "createdAt" bigint DEFAULT (EXTRACT(EPOCH FROM now() at time zone 'utc')::bigint),
	"createdAt" bigint DEFAULT (EXTRACT(EPOCH FROM now() at time zone 'utc'))
);

-- One with and 1 without timezone. Actually doesnt matter, since it is garunteed that both will always generate utc time stamps
-- however for timestamps that are user inserted, do I need to include timestamp or not? Or store as bigints?

-- Read data from table and see their values
-- insert into t default values;
-- select * from t