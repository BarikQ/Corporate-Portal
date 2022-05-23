import bcrypt from 'bcrypt';

const saltRounds = 10;
const salt = await bcrypt.genSalt(saltRounds);

export const saltData = async (data) => {
  return await bcrypt.hash(data, salt);
};
