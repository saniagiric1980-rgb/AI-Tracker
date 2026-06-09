import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool, types } = pkg;

//Return DATE colums(OID 1082) as plain 'YYYY-MM-DD' strings instead of JS Date,
//so JSON serialization doesn't  UTC-shift the date for clients in non-UTC timezones.
types.setTypeParser(1082, (val) => val);

const connectionString = process.env.DATABASE_URL?.replace('postgresql://', 'postgres://');

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  },
});

pool.on('connect', () => {
    console.log('Connected to Neon Postgres');
});

pool.on('error', (err) => {
    console.error('Unexpected  Postgres error occurred:', err);
    process.exit(-1);
});

export default pool;