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
AppointmentRouter.get("/appointments", getAllAppointment)

//POST /appointments
AppointmentRouter.post("/appointments", createNewAppointment)

//GET /appointments/:appointmentId
AppointmentRouter.get("/appointments/:appointmentId", findAppointmentById)

//PUT /appointments/:appointmentId
AppointmentRouter.put("/appointments/:appointmentId", updateAppointmentById)

//DELETE /appointments/:appointmentId
AppointmentRouter.delete("/appointments/:appointmentId",deleteAppointmentById)

export default AppointmentRouter;