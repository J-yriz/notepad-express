import jwt from "jsonwebtoken";
import { Router } from "express";
import { prisma } from "../../utility/db/prisma";

const router = Router();

router.get("/userData/:id", async (req, res) => {
  const { id } = req.params;
  let bufferToken: string = id.replace("SECSEC.", "");
  bufferToken = bufferToken.replace("==", "");

  try {
    for (let x = 1; x <= 5; x++) {
      bufferToken = atob(bufferToken);
    }
    const userToken = jwt.verify(bufferToken, "secretToken") as { email: string; displayName: string };
    const [userDataDB] = await prisma.user.findMany({
      where: {
        email: userToken.email,
      },
    });

    res.status(200).json({
      status: 200,
      message: "User data",
      total: 1,
      data: [
        {
          id: Number(userDataDB.id),
          displayName: userDataDB.displayName,
          email: userDataDB.email,
        },
      ],
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Token is invalid",
      total: 0,
      data: [],
    });
  }
});

export default router;
