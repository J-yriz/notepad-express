import { Router } from "express";
import { prisma } from "../../utility/db/prisma";
import { verifyPassword } from "../../utility/Function";

const router = Router();

interface IDeleteAccount {
  passwordConfirmDelete: string;
}

router.delete("/del-account/:id", async (req, res) => {
  const body = req.body as IDeleteAccount;
  const { id } = req.params;

  const [userDataDB] = await prisma.user.findMany({
    where: {
      id: Number(id),
    },
  });

  const passwordValid = await verifyPassword(body.passwordConfirmDelete, userDataDB.password);

  if (!passwordValid) {
    res.status(401).json({
      status: 401,
      message: "Password is incorrect",
      total: 1,
      data: ["Password confirm Delete"],
    });
    return;
  }

  try {
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      status: 200,
      message: "Account deleted",
      total: 0,
      data: [],
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Account delete failed",
      total: 0,
      data: [],
    });
  }
});

export default router;
