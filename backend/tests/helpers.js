import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

export const api = request(app);

// Only ever called on the test database (db.js refuses to connect otherwise)
export const clearDatabase = async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
};

let counter = 0;

// Sign up a fresh user through the API and return { user, token }.
// role "worker"/"admin" is set directly in the DB — the same way we create staff in Compass,
// because /signup always creates a client.
export const createUser = async ({ role = "client", ...overrides } = {}) => {
  counter += 1;
  const body = {
    name: `Test User ${counter}`,
    email: `user${counter}@test.com`,
    password: "secret123",
    ...overrides,
  };

  const res = await api.post("/api/users/signup").send(body).expect(201);

  if (role !== "client") {
    await mongoose.connection
      .collection("users")
      .updateOne({ _id: new mongoose.Types.ObjectId(res.body._id) }, { $set: { role } });
  }

  return { user: { ...res.body, role }, token: res.body.token, password: body.password };
};

export const bearer = (token) => ({ Authorization: `Bearer ${token}` });
