import * as Appointment from "../models/appointmentModel.js";
// imports all as Appointment

const getAllAppointment = async (req, res) => {
    const getAllResponse = await Appointment.getAll()
    res.json(getAllResponse);
};

const createNewAppointment = async (req, res) => {
    const data = req.body
    
    const newAppointment = await Appointment.addOne(data)

    if (newAppointment.error) {
        res.status(400).json({message: newAppointment.error });
    } else {
        res.status(201).json(newAppointment);
    }
};

const findAppointmentById = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) res.status(404).json({message: "Appointment not found"});
    else res.json(appointment); 
};

const updateAppointmentById = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId);
    const updatedData = req.body;

    if(!appointment) res.status(404).json({message: "Appointment not found"});
    
    else {
        const  updatedAppointment = await Appointment.updateById(appointmentId, updatedData);
        res.json(updatedAppointment);
    }
}

const deleteAppointmentById = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) res.status(404).json({message: "Appointment not found "})
    
    else {
        const isDeleted = await Appointment.deleteById(appointmentId);
        if (isDeleted) res.status(200).json({message: "Delete appointment successfully"})
        else res.status(500).json({message: "Delete failed"}); 
    }
}

export {
  getAllAppointment,
  createNewAppointment,
  findAppointmentById,
  updateAppointmentById,
  deleteAppointmentById
};