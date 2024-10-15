import { Router } from "express";
import { prisma } from "../../utility/db/prisma";
import { IAuthBody } from "../../utility/Types";
import { encodeFunc } from "../../utility/encodeDecode";

const router = Router();

router.post("/register", async (req, res) => {
  const body = req.body as IAuthBody;

  if (!body.username || !body.email || !body.password || !body.displayName) {
    res.status(400).json({
      status: 400,
      message: "Username, DisplayName, Email, and Password is required",
      total: 0,
      data: [],
    });
    return;
  }

  const userDataDB = await prisma.user.findMany({
    where: {
      OR: [{ username: body.username }, { email: body.email }],
    },
  });

  if (userDataDB.length) {
    let dataResponse: string[] = [];
    const usernameExists = userDataDB.some((user) => user.username.toLowerCase() === body.username.toLowerCase());
    const emailExists = userDataDB.some((user) => user.email.toLowerCase() === body.email.toLowerCase());

    if (usernameExists && emailExists) {
      dataResponse = ["Username", "Email"];
    } else if (usernameExists) {
      dataResponse = ["Username"];
    } else if (emailExists) {
      dataResponse = ["Email"];
    }

    res.status(409).json({
      status: 409,
      message: "Data already exists",
      total: dataResponse.length,
      data: dataResponse,
    });
    return;
  }

  try {
    let password = `PSWU.${body.password}`;
    for (let x = 1; x <= 3; x++) {
      password = btoa(password);
    }

    const addUserDB = await prisma.user.create({
      data: {
        username: body.username,
        displayName: body.displayName,
        email: body.email,
        password: password,
      },
    });

    const userObjDB = {
      email: addUserDB.email,
      displayName: addUserDB.displayName,
    };

    const bufferToken = encodeFunc(userObjDB);

    res.status(201).json({
      status: 201,
      message: "User has been registered",
      total: 1,
      data: [
        {
          cookies: bufferToken,
        },
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      total: 0,
      data: [],
    });
  }
});

export default router;
