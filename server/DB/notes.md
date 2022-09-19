# Notes for Database and Data handling related items:

## Preferred Data types
General guidelines on how data should be stored and the way to use them.
- Tables should always be normalized to at least 3NF, and BCNF for most
- Database should always contain the FINAL state of the value. Avoid intermediate states as much as possible.
- But it can take on liberal forms of state representation
    - Meaning, we do not always have to have the final literal value, as long as the final state can be derived from what is stored in the database.
- When we read it, we should ONLY be transforming the data to a different representation, AND NOT modifying the value to compute final state.
    - For example, representing state with time limits is fine, since when we read it, we are just transforming the data to the final form.
    - But when I read it, I should not be modifying underlying state to show my final form.
- Also we should not rely on creating new records or document on READ for cases of "default values" / "first reads", because READs should ALWAYS be indempotent

## Dealing with timestamp
- Always store time as either ISO 8061 strings or unix seconds in data layer and handle time zones in presentation layer.
    - Meaning, for inserts, convert dates/time/timestamps to UTC unix seconds and store them in DB,
    - Read them as UTC unix seconds from DB and use it however is needed on frontend,
    - E.g. show time as date time in user's local timezone.
- Timestamp standard values
    - unix timestamp of the start of the day at 00:00:00 UTC
    - unix timestamp for end of day should be 23:59:59 UTC
    - Then when you read them on the frontend, convert it to show either the user's local time
    - OR show the time based on the timezone that the user specified
- If anything stored as timestamptz type,
    - frontend/client will get it back as a ISO 8061 timestamp
- There are 2 types of "time" data insertions. Firstly for default value insertions for tables with columns like createdAt. Secondly, values inserted programmatically.
    - These 2 types of value can be treated differently.
    - default values are easier with ISO 8601, and is only used for reading and stuff
    - the stuff that I insert, can be kept in unix seconds UTC timestamp format.
- Specifying default inserts for "unix seconds" if needed
    - In SQL
        ```sql
        -- Note that the "::bigint" cast is only needed when selecting like this,
        -- if used as default value for table with type bigint, it will be casted automatically
        SELECT EXTRACT(EPOCH FROM now() at time zone 'utc')::bigint
        ```
    - In dbml
        ```dbml
        createdAt bigint [default: `EXTRACT(EPOCH FROM now() at time zone 'utc')`]
        // Generated --> "createdAt" bigint DEFAULT (EXTRACT(EPOCH FROM now() at time zone 'utc'))
        ```
        createdAt timestamptz [default: `now() at time zone 'utc'`]
        
- References:
    - <https://kb.objectrocket.com/postgresql/postgres-timestamps-1054#postgresql+unix+timestamp>
    - <https://tapoueh.org/blog/2018/04/postgresql-data-types-date-timestamp-and-time-zones/>


## Using foreign keys as primary keys
Yes and no,
- Yes if it is a 1 to 1 and 1 to 0..1 relationships
- Because primary keys always need to be unique
- Refer to this [answer](https://stackoverflow.com/a/10983099/13137262) for more details

## Handling cyclic constraints
- <https://begriffs.com/posts/2017-08-27-deferrable-sql-constraints.html>

## Using Cloud SQL
How to set up connections for Cloud SQL and connect to it:
- <https://cloud.google.com/sql/docs/postgres/configure-ip>
- <https://stackoverflow.com/questions/55925270/connect-pgadmin4-to-cloud-sql/55939033#55939033>
- <https://stackoverflow.com/questions/24749810/how-to-make-a-google-cloud-sql-instance-accessible-for-any-ip-address/24750403#24750403>

## Firstore
- Firestore document paths MUST BE STRINGS, therefore, and numbers should all be converted to string first.