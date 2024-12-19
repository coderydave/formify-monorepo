import { Router } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../database";
import { ObjectId } from "mongodb";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *       required:
 *         - name
 *         - email
 *       example:
 *         _id: 676458375548fdad73e5b2da
 *         name: John Doe
 *         email: john.doe@example.com
 *
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     InputUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *       required:
 *         - name
 *         - email
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 */

// GET ALL
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", async (req, res) => {
  const users = await userRepository.find();
  res.json(users);
});
// GET
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
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
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InputUser'
 *     responses:
 *       201:
 *         description: The user was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", async (req, res) => {
  const user = userRepository.create(req.body);
  const result = await userRepository.save(user);
  res.json(result);
});
// PUT
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
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
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user was deleted successfully
 *       404:
 *         description: User not found
 */
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
