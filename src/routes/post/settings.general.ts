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
    res.status(400).json({
      error: "Password is incorrect",
      status: 400,
      data: ["Password"],
    });
    return;
  }

  if (userDataDB.displayName === body.displayName && userDataDB.email === body.email) {
    res.status(200).json({
      error: "No changes detected",
      status: 200,
      data: [{ displayName: userDataDB.displayName, email: userDataDB.email }],
    });
    return;
  }

  try {
    const post = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        displayName: body.displayName,
        email: body.email,
      },
    });

    res.status(200).json({
      success: "General settings updated",
      status: 200,
      data: [{ displayName: post.displayName, email: post.email }],
    });
    return;
  } catch (error) {
    res.status(400).json({
      error: "Failed to update general settings",
      status: 400,
      data: [],
    });
    return;
  }
});

export default router;
