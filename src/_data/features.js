// Site-wide feature flags, available in every template as `features.*`.
//
// room: the private room offer – the room section on the home page, the room
// entries in the FAQ, and the copy that mentions it (SEO descriptions, the
// availability line, the contact text, the JSON-LD price range). It stays off
// until the collective has agreed to free the room.
//
// Flip it by changing the default below and committing, or preview it without
// committing anything:
//   SHOW_ROOM=true yarn start
//   SHOW_ROOM=true yarn build
const fromEnv = (name, fallback) =>
  process.env[name] === undefined ? fallback : process.env[name] === 'true';

module.exports = {
  room: fromEnv('SHOW_ROOM', false),
};
