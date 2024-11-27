import { Router } from "express";
import { prisma } from "../../utility/db/prisma";
import { IAuthBody } from "../../utility/Types";
import { encodeFunc, verifyPassword } from "../../utility/Function";

const router = Router();

router.post("/login", async (req, res) => {
  const body = req.body as IAuthBody;

  if (!body.email || !body.password) {
    res.status(400).json({
      status: 400,
      message: "Email and Password is required",
      total: 2,
      data: ["Email", "Password"],
    });
    return;
  }

  const userDataDB = await prisma.user.findMany({
    where: {
      email: body.email,
    },
  });

  if (!userDataDB.length) {
    res.status(404).json({
      status: 404,
      message: "Email not found",
      total: userDataDB.length,
      data: [],
    });
    return;
  }

  const passwordValid = await verifyPassword(body.password, userDataDB[0].password);

  if (!passwordValid) {
    res.status(401).json({
      status: 401,
      message: "Password is incorrect",
      total: userDataDB.length,
      data: [
        {
          email: body.email,
        },
      ],
    });
    return;
  }

  const userObjDB = {
    email: userDataDB[0].email,
    displayName: userDataDB[0].displayName,
  };

  const bufferToken = encodeFunc(userObjDB);

  if (body.rememberCheck) {
    let refreshToken = generateRandomText(15);

    if (userDataDB[0].password_remember) refreshToken = userDataDB[0].password_remember;

    await prisma.user.update({
      where: {
        email: body.email,
      },
      data: {
        password_remember: refreshToken,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Login successful",
      total: userDataDB.length,
      data: [
        {
          cookies: bufferToken,
          rememberToken: refreshToken,
        },
      ],
    });
    return;
  }

  res.status(200).json({
    status: 200,
    message: "Login successful",
    total: userDataDB.length,
    data: [
      {
        cookies: bufferToken,
      },
    ],
  });
  return;
});

export default router;

function generateRandomText(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
