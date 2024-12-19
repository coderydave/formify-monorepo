import { Router } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../database";
import { ObjectId } from "mongodb";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// GET ALL
router.get("/", async (req, res) => {
  const users = await userRepository.find();
  res.json(users);
});
// GET
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  try {
    const objectId = new ObjectId(id);
    console.log("objectId", objectId);

    const user = await userRepository.findOneBy({ _id: objectId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid ID format", error });
  }
});
// POST
router.post("/", async (req, res) => {
  const user = userRepository.create(req.body);
  const result = await userRepository.save(user);
  res.json(result);
});
// PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  try {
    const objectId = new ObjectId(id);
    console.log("objectId", objectId);

    // Lekérdezés az _id mező alapján
    const user = await userRepository.findOneBy({ _id: objectId });
    console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Adatok frissítése
    userRepository.merge(user, req.body);
    const result = await userRepository.save(user);
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid ID format", error });
  }
});
// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  try {
    const objectId = new ObjectId(id);
    console.log("objectId", objectId);

    const result = await userRepository.delete({ _id: objectId });
    if (result.affected === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid ID format", error });
  }
});

export default router;
