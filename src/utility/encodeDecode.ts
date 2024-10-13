import jwt from "jsonwebtoken";

const encodeFunc = (userObjDB: { email: string; displayName: string }): string => {
  const token = jwt.sign(userObjDB, "secretToken", { expiresIn: "1h" });

  let bufferToken: string = token;
  for (let x = 1; x <= 5; x++) {
    bufferToken = btoa(bufferToken);
  }

  return `${bufferToken}==`;
};

export { encodeFunc };
