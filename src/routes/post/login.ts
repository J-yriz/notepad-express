import { Router } from "express";
import { prisma } from "../../utility/db/prisma";
import { IAuthBody } from "../../utility/Types";

const router = Router();

router.post("/login", async (req, res) => {
  const body = req.body as IAuthBody;

  if (!body.email || !body.password) {
    res.status(400).json({
      error: "Email and Password is required",
      status: 400,
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
    res.status(400).json({
      error: "Email not found",
      status: 400,
      data: [],
    });
    return;
  }

  if (userDataDB[0].password !== body.password) {
    res.status(400).json({
      error: "Password is incorrect",
      status: 400,
      data: [],
    });
    return;
  }

  if (body.rememberCheck) {
    await prisma.user.update({
      where: {
        email: body.email,
      },
      data: {
        password_remember: body.rememberCheck,
      },
    });
  }

  res.status(200).json({
    success: "Login Success",
    status: 200,
    data: [
      {
        email: userDataDB[0].email,
        displayName: userDataDB[0].displayName,
      },
    ],
  });
});

export default router;
