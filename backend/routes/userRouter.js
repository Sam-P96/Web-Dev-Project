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
UserRouter.get("/users", getAllUser)

//POST /users
UserRouter.post("/users", createNewUser)

//GET /users/:userId
UserRouter.get("/users/:userId", findUserById)

//PUT /users/:userId
UserRouter.put("/users/:userId", updateUserById)

//DELETE /users/:userId
UserRouter.delete("/users/:userId",deleteUserById)

export default UserRouter;