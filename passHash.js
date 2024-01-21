const bcrypt = require('bcrypt');

async function hashPassword(){
  const password = 'admin.123';
  const hash = await bcrypt.hash(password, 10);
  const hashGenerate = '$2b$10$V17cV4Drh/qkN10drnifmufRfDaQqKGlLfMqeWWgajmrgm9nHUrre';
  const compare = await bcrypt.compare(password, hashGenerate);
  console.log(hash);
  console.log(compare);
}

hashPassword();
