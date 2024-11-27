import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const encodeFunc = (userObjDB: { email: string; displayName: string }): string => {
  const token = jwt.sign(userObjDB, "secretToken", { expiresIn: "1h" });

  let bufferToken: string = token;
  for (let x = 1; x <= 5; x++) {
    bufferToken = btoa(bufferToken);
  }

  return `SECSEC.${bufferToken}==`;
};

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
}

const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export { encodeFunc, hashPassword, verifyPassword };
