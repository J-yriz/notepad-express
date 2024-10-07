import jwt from "jsonwebtoken";
import { Router } from "express";
import { prisma } from "../../utility/db/prisma";
import { IAuthBody } from "../../utility/Types";

const router = Router();

router.post("/register", async (req, res) => {
  const body = req.body as IAuthBody;

  if (!body.username || !body.email || !body.password || !body.displayName) {
    res.status(400).json({
      error: "Username, DisplayName, Email, and Password is required",
      status: 400,
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
    const usernameExists = userDataDB.some((user) => user.username === body.username);
    const emailExists = userDataDB.some((user) => user.email === body.email);

    if (usernameExists && emailExists) {
      dataResponse = ["Username", "Email"];
    } else if (usernameExists) {
      dataResponse = ["Username"];
    } else if (emailExists) {
      dataResponse = ["Email"];
    }

    res.status(400).json({
      error: "Data already exists",
      status: 400,
      data: dataResponse,
    });
    return;
  }

  try {
    const addUserDB = await prisma.user.create({
      data: {
        username: body.username,
        displayName: body.displayName,
        email: body.email,
        password: body.password,
      },
    });

    const userObjDB = {
      email: addUserDB.email,
      displayName: addUserDB.displayName,
    };

    const token = jwt.sign(userObjDB, "secretToken", { expiresIn: "30d" });
    let bufferToken: string = "";
    for (let x = 1; x <= 10; x++) {
      bufferToken = Buffer.from(token).toString("base64");
    }

    res.status(201).json({
      success: "User has been registered",
      status: 201,
      data: [bufferToken],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500,
      data: [],
    });
  }
});

export default router;
