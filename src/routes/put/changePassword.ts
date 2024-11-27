import { Router } from "express";
import { prisma } from "../../utility/db/prisma";
import { hashPassword, verifyPassword } from "../../utility/Function";
import { IChangePassword } from "../../utility/Types";

const router = Router();

router.put("/change-password/:id", async (req, res) => {
  const body = req.body as IChangePassword;
  const { id } = req.params;

  const [userDataDB] = await prisma.user.findMany({
    where: {
      id: Number(id),
    },
  });

  const passwordValid = await verifyPassword(body.currentPassword, userDataDB.password);

  if (!passwordValid) {
    res.status(401).json({
      status: 401,
      message: "Old password is incorrect",
      total: 1,
      data: ["Password"],
    });
    return;
  }

  if (body.newPassword !== body.confirmNewPassword) {
    res.status(400).json({
      status: 400,
      message: "New password and confirm password is not match",
      total: 1,
      data: ["Password Confirm"],
    });
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        password: await hashPassword(body.newPassword),
      },
    });

    res.status(200).json({
      status: 200,
      message: "Password updated",
      total: 0,
      data: [],
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Password update failed",
      total: 0,
      data: [],
    });
  }
});

export default router;
