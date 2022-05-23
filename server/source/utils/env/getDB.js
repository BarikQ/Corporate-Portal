export const getDB = () => {
  const DB_URL = process.env.DB_URL;
  const DB_NAME = process.env.DB_NAME;
  const SCALEGRID_URL = process.env.SCALEGRID_URL;
  const CLEVER_CLOUD = process.env.CLEVER_CLOUD;

  return {
    DB_URL,
    DB_NAME,
    SCALEGRID_URL,
    CLEVER_CLOUD
  };
};
