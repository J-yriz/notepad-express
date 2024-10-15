import { Router } from "express";
import { prisma } from "../../utility/db/prisma";

const router = Router();

router.put("/logout", async (req, res) => {
  const { body } = req;

  try {
    await prisma.user.update({
      where: {
        email: body.email,
      },
      data: {
        password_remember: "",
      },
    });

    res.status(200).json({
      status: 200,
      message: "Logout success",
      total: 0,
      data: [],
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Logout failed",
      total: 0,
      data: [],
    });
  }
});

export default router;
