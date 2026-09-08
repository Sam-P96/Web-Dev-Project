const express = require("express");
const Router = express.Router();

const {
    getAllUser,
    createNewUser,
    findUserById,
    updateUserById,
    deleteUserById
} = require("../controllers/userControllers")

//ROUTES

//GET /users
Router.get("/users", getAllUser)

//POST /users
Router.post("/users", createNewUser)

//GET /users/:userId
Router.get("/users/:userId", findUserById)

//PUT /users/:userId
Router.put("/users/:userId", updateUserById)

//DELETE /users/:userId
Router.delete("/users/:userId",deleteUserById)

module.exports = Router;
