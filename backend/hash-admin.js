// backend/hash-admin.js
import bcrypt from 'bcryptjs';

(async () => {
  const plain = 'qwerty';  // ← change this
  const saltRounds = 10;
  const hash = await bcrypt.hash(plain, saltRounds);
  console.log('BCRYPT HASH:', hash);
})();
