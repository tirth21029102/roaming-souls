import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql
  .createPool({
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
  })
  .promise();

export const getAllCitiesInfo = async () => {
  const [rows] = await pool.query('SELECT * FROM cities;');
  return rows;
};

export const getAllUserFromDb = async email => {
  const [rows] = await pool.query('select * from users where email = ?', [
    email,
  ]);
  return rows;
};

export const getCityInfo = async id => {
  const [rows] = await pool.query('select * from cities where id = ?', [id]);
  return rows;
};

export const deleteCityd = async id => {
  const [rows] = await pool.query('delete from cities where id = ?', [id]);
  return rows;
};

export const saveRefreshTokenToDb = async tokenObj => {
  const {
    userId: user_id,
    tokenHash: token_hash,
    expiresAt: expires_at,
  } = tokenObj;

  const [result] = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE
  token_hash = VALUES(token_hash),
  expires_at = VALUES(expires_at);
`,
    [user_id, token_hash, expires_at],
  ); // on delete triggers on primary key or unique key

  return result;
};

export const findRefreshToken = async hash => {
  const [rows] = await pool.query(
    'select * from refresh_tokens where token_hash = ? ',
    [hash],
  );
  return rows;
};

export const deleteRefreshToken = async hash => {
  const [rows] = await pool.query(
    'delete from refresh_tokens where token_hash = ?',
    [hash],
  );
  return rows;
};

export const insertNewUser = async (n, e, p, i, i_p, otp, otp_expiry) => {
  const [rows] = await pool.query(
    'INSERT INTO users (user_name , email , password_hash , imageName , image_path,email_otp,otp_expires_at) VALUES ( ? , ? , ? , ? , ? , ? , ? )',
    [n, e, p, i, i_p, otp, otp_expiry],
  );
  console.log(rows);
  return rows;
};

export const delUsersFromDb = async () => {
  await pool.query('DELETE FROM refresh_tokens;');
  await pool.query('DELETE FROM users;');
};

export const insertCity = async (
  city,
  date,
  note,
  continent,
  countryName,
  lat,
  lng,
  user_id,
) => {
  const mysqlDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  console.log(city, lng, mysqlDate, note, continent, countryName, lat);
  const [rows] = await pool.query(
    'INSERT INTO cities (cityName , country , emoji , date, notes, lat,lng , user_id) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
    [city, countryName, continent, mysqlDate, note, lat, lng, user_id],
  );
  return rows;
};

export const getAllUsersFromDB = async () => {
  const [rows] = await pool.query('SELECT * FROM users;');
  return rows;
};

// export const saveMessage = async (conversationId, senderId, content) => {
//   const [result] = await pool.query(
//     `
//     INSERT INTO messages (conversation_id, sender_id, content)
//     VALUES (?, ?, ?)
//     `,
//     [conversationId, senderId, content]
//   );
//   return result;
// };

export const query1 = async (userId1, userId2) => {
  const [existing] = await pool.query(
    `
      SELECT c.id
      FROM conversations c
      JOIN conversation_participants p1 
        ON p1.conversation_id = c.id AND p1.user_id = ?
      JOIN conversation_participants p2
        ON p2.conversation_id = c.id AND p2.user_id = ?
      WHERE c.type = 'private'
      LIMIT 1
      `,
    [userId1, userId2],
  );
  return existing;
};

export const query2 = async () => {
  const [res] = await pool.query(`
      INSERT INTO conversations (type)
      VALUES ('private')
      `);
  return res;
};

export const query3 = async (conversationId, userId1, userId2) => {
  await pool.query(
    `
      INSERT INTO conversation_participants (conversation_id, user_id)
      VALUES (?, ?), (?, ?)
      `,
    [conversationId, userId1, conversationId, userId2],
  );
};

export const saveMessage = async (conversationId, senderId, content) => {
  const [result] = await pool.query(
    `
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES (?, ?, ?)
    `,
    [conversationId, senderId, content],
  );

  return {
    id: result.insertId,
    content,
    sender_id: senderId,
    conversation_id: conversationId,
  };
};

export const getMsgsFromDB = async id => {
  const [rows] = await pool.query(
    `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC;`,
    [id],
  );
  return rows;
};

export const getAllCitiesForParticularUser = async id => {
  const [rows] = await pool.query('SELECT * FROM cities where user_id = ?;', [
    id,
  ]);
  return rows;
};

export const getAllUserFriends = async id => {
  const [rows] = await pool.query(
    'SELECT u.* FROM users u JOIN friends f ON f.friend_id = u.id WHERE f.user_id = ?;',
    [id],
  );
  return rows;
};

export const markUserVerified = async email => {
  const [rows] = await pool.query(
    'UPDATE users SET is_verified = true WHERE email = ?',
    [email],
  );
  return rows;
};

export const getAllUsersPresentLocation = async () => {
  const [rows] = await pool.query('select * from user_locations');
  return rows;
};

export const getUserLoca = async id => {
  const [rows] = await pool.query(
    'select * from user_locations where user_id = ? ',
    [id],
  );
  return rows;
};

export const setUserLoca = async (
  user_id,
  countryCode,
  countryName,
  city,
  lat,
  lng,
) => {
  const [rows] = await pool.query(
    'INSERT INTO user_locations (user_id , countryCode , countryName , cityName , latitude , longitude) VALUES (?,?,?,?,?,?)',
    [user_id, countryCode, countryName, city, lat, lng],
  );
  return rows;
};

export const updateUserLoca = async (
  user_id,
  countryCode,
  countryName,
  city,
  lat,
  lng,
) => {
  const [rows] = await pool.query(
    'UPDATE user_locations SET countryCode = ? , countryName = ? , cityName = ? , latitude = ? , longitude = ? WHERE user_id = ?',
    [countryCode, countryName, city, lat, lng, user_id],
  );
  return rows;
};

export const getUsersInfoLocations = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM user_locations JOIN users ON users.id = user_locations.user_id',
  );
  return rows;
};
