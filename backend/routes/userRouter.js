import express from "express";
import {
  signupUser,
  loginUser,
  getMe,
  getAllUser,
  findUserById,
  updateUserById,
  deleteUserById
} from "../controllers/userControllers.js";
import { requireAuth, requireRole } from "../middleware/requireAuth.js";

const UserRouter = express.Router();
//ROUTES

// ---- Public ----

//POST /users/signup
UserRouter.post("/signup", signupUser)

//POST /users/login
UserRouter.post("/login", loginUser)

// ---- Everything below needs a valid token ----
UserRouter.use(requireAuth)

//GET /users/me  (must stay above /:userId, or "me" is treated as an id)
UserRouter.get("/me", getMe)

//GET /users  (staff only: clients must not list other users)
UserRouter.get("/", requireRole("worker", "admin"), getAllUser)

//GET /users/:userId  (self or admin, checked in controller)
UserRouter.get("/:userId", findUserById)

//PUT /users/:userId  (self or admin, checked in controller)
UserRouter.put("/:userId", updateUserById)

//DELETE /users/:userId  (self or admin, checked in controller)
UserRouter.delete("/:userId",deleteUserById)

export default UserRouter;
