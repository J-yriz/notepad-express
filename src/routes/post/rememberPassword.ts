import { Router } from "express";
import { prisma } from "../../utility/db/prisma";
import { encodeFunc } from "../../utility/encodeDecode";

const router = Router();

router.post("/remember-password/:id", async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const [userDataDB] = await prisma.user.findMany({
    where: {
      id: Number(id),
    },
  });

  if (!userDataDB) {
    res.status(404).json({
      status: 404,
      message: "Email or ID not found",
      total: 0,
      data: [],
    });
    return;
  }

  const userObjDB = {
    email: userDataDB.email,
    displayName: userDataDB.displayName,
  };

  const bufferToken = encodeFunc(userObjDB);

  if (userDataDB.password_remember === body.rememberToken) {
    res.status(200).json({
      status: 200,
      message: "Password remember success",
      total: 1,
      data: [
        {
          cookies: bufferToken,
        },
      ],
    });
    return;
  }
});

export default router;
