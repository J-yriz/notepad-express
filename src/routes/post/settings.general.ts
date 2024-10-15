import { Router } from "express";
import { prisma } from "../../utility/db/prisma";

const router = Router();

router.post("/set-general/:id", async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const [userDataDB] = await prisma.user.findMany({
    where: {
      id: parseInt(id),
    },
  });

  let userPassword = userDataDB.password;
  for (let x = 1; x <= 3; x++) {
    userPassword = atob(userPassword);
  }
  userPassword = userPassword.replace("PSWU.", "");

  if (userPassword !== body.password) {
    res.status(401).json({
      status: 401,
      message: "Password is incorrect",
      total: 1,
      data: ["Password"],
    });
    return;
  }

  const dataInputUser = { displayName: userDataDB.displayName, email: userDataDB.email };

  if (userDataDB.displayName === body.displayName && userDataDB.email === body.email) {
    res.status(200).json({
      status: 200,
      message: "No changes detected",
      total: 1,
      data: [dataInputUser],
    });
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        displayName: body.displayName,
        email: body.email,
      },
    });

    res.status(200).json({
      status: 200,
      message: "General settings updated",
      total: 1,
      data: [dataInputUser],
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to update general settings",
      total: 1,
      data: [dataInputUser],
    });
    return;
  }
});

export default router;
