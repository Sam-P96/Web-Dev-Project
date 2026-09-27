import mongoose from "mongoose";
import { api, clearDatabase, createUser, bearer } from "./helpers.js";

beforeEach(async () => {
  await clearDatabase();
});

describe("POST /api/users/signup", () => {
  const newUser = { name: "Jane Doe", email: "jane@test.com", password: "secret123" };

  it("creates a client and returns a token without the password", async () => {
    const res = await api.post("/api/users/signup").send(newUser).expect(201);

    expect(res.body).toMatchObject({ email: "jane@test.com", name: "Jane Doe", role: "client" });
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.password).toBeUndefined();
  });

  it("stores a bcrypt hash, never the plain password", async () => {
    await api.post("/api/users/signup").send(newUser).expect(201);

    const saved = await mongoose.connection.collection("users").findOne({ email: "jane@test.com" });
    expect(saved.password).not.toBe("secret123");
    expect(saved.password).toMatch(/^\$2[aby]\$10\$/);
  });

  it.each(["admin", "worker"])("ignores role '%s' from the body (always client)", async (role) => {
    const res = await api.post("/api/users/signup").send({ ...newUser, role }).expect(201);
    expect(res.body.role).toBe("client");
  });

  it("rejects a duplicate email, case-insensitively", async () => {
    await api.post("/api/users/signup").send(newUser).expect(201);

    const res = await api
      .post("/api/users/signup")
      .send({ ...newUser, email: "JANE@test.com" })
      .expect(400);
    expect(res.body.error).toBeDefined();
  });

  it("rejects missing required fields", async () => {
    const res = await api.post("/api/users/signup").send({ email: "x@test.com" }).expect(400);
    expect(res.body.error).toMatch(/Missing required fields/);
  });
});

describe("POST /api/users/login", () => {
  it("logs in with correct credentials", async () => {
    const { user, password } = await createUser();

    const res = await api
      .post("/api/users/login")
      .send({ email: user.email, password })
      .expect(200);
    expect(res.body).toMatchObject({ _id: user._id, email: user.email, role: "client" });
    expect(res.body.token).toEqual(expect.any(String));
  });

  it("returns the same error for wrong password and unknown email (no user enumeration)", async () => {
    const { user } = await createUser();

    const wrongPassword = await api
      .post("/api/users/login")
      .send({ email: user.email, password: "wrong-password" })
      .expect(400);
    const unknownEmail = await api
      .post("/api/users/login")
      .send({ email: "nobody@test.com", password: "whatever" })
      .expect(400);

    expect(wrongPassword.body.error).toBe("Invalid credentials");
    expect(unknownEmail.body.error).toBe(wrongPassword.body.error);
  });
});

describe("GET /api/users/me", () => {
  it("returns the logged-in user with a valid token", async () => {
    const { user, token } = await createUser();

    const res = await api.get("/api/users/me").set(bearer(token)).expect(200);
    expect(res.body).toMatchObject({ _id: user._id, email: user.email });
    expect(res.body.password).toBeUndefined();
  });

  it("returns 401 without a token", async () => {
    const res = await api.get("/api/users/me").expect(401);
    expect(res.body.error).toBe("Authorization token required");
  });

  it("returns 401 with an invalid token", async () => {
    const res = await api.get("/api/users/me").set(bearer("not-a-real-token")).expect(401);
    expect(res.body.error).toBe("Request is not authorized");
  });

  it("returns 401 when the user was deleted but the token is still valid", async () => {
    const { user, token } = await createUser();
    await mongoose.connection
      .collection("users")
      .deleteOne({ _id: new mongoose.Types.ObjectId(user._id) });

    await api.get("/api/users/me").set(bearer(token)).expect(401);
  });
});

describe("/api/users/:userId (self or admin)", () => {
  let alice;
  let bob;

  beforeEach(async () => {
    alice = await createUser();
    bob = await createUser();
  });

  it("lets a user update their own account", async () => {
    const res = await api
      .put(`/api/users/${alice.user._id}`)
      .set(bearer(alice.token))
      .send({ name: "Alice Updated" })
      .expect(200);
    expect(res.body.name).toBe("Alice Updated");
  });

  it("blocks a client from reading, updating or deleting another user (403)", async () => {
    const url = `/api/users/${bob.user._id}`;
    await api.get(url).set(bearer(alice.token)).expect(403);
    await api.put(url).set(bearer(alice.token)).send({ name: "hacked" }).expect(403);
    await api.delete(url).set(bearer(alice.token)).expect(403);
  });

  it("lets an admin update another user", async () => {
    const admin = await createUser({ role: "admin" });
    await api
      .put(`/api/users/${bob.user._id}`)
      .set(bearer(admin.token))
      .send({ name: "Renamed by admin" })
      .expect(200);
  });

  it("returns 400 when changing email to one already in use", async () => {
    const res = await api
      .put(`/api/users/${alice.user._id}`)
      .set(bearer(alice.token))
      .send({ email: bob.user.email })
      .expect(400);
    expect(res.body.error).toMatch(/already in use/);
  });

  it("only lets staff list all users", async () => {
    const worker = await createUser({ role: "worker" });
    await api.get("/api/users").set(bearer(alice.token)).expect(403);
    await api.get("/api/users").set(bearer(worker.token)).expect(200);
  });
});
