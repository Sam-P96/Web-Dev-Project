import express from "express";
import {
  getAllUser,
  createNewUser,
  findUserById,
  updateUserById,
  deleteUserById
} from "../controllers/userControllers.js";

const UserRouter = express.Router();
//ROUTES

//GET /users
UserRouter.get("/", getAllUser)

//POST /users
UserRouter.post("/", createNewUser)

//GET /users/:userId
UserRouter.get("/:userId", findUserById)

//PUT /users/:userId
UserRouter.put("/:userId", updateUserById)

//DELETE /users/:userId
UserRouter.delete("/:userId",deleteUserById)

export default UserRouter;