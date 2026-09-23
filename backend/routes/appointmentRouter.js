import express from "express";
import {
  getAllAppointment,
  createNewAppointment,
  findAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
} from "../controllers/appointmentControllers.js";

const AppointmentRouter = express.Router();
//ROUTES

//GET /appointments or /appointments?worker=<id>
AppointmentRouter.get("/", getAllAppointment)

//POST /appointments
AppointmentRouter.post("/", createNewAppointment)

//GET /appointments/:appointmentId
AppointmentRouter.get("/:appointmentId", findAppointmentById)

//PUT /appointments/:appointmentId
AppointmentRouter.put("/:appointmentId", updateAppointmentById)

//DELETE /appointments/:appointmentId
AppointmentRouter.delete("/:appointmentId",deleteAppointmentById)

export default AppointmentRouter;