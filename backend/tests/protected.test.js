import { api, clearDatabase, createUser, bearer } from "./helpers.js";

let client;
let worker;

// Log in once per role and reuse the tokens (course pattern: token in beforeAll)
beforeAll(async () => {
  await clearDatabase();
  client = await createUser();
  worker = await createUser({ role: "worker" });
});

describe("/api/cars", () => {
  const car = { make: "Toyota", model: "Corolla", year: 2018, mileage: 90000 };

  it("GET is public", async () => {
    await api.get("/api/cars").expect(200);
  });

  it("POST without a token returns 401", async () => {
    await api.post("/api/cars").send(car).expect(401);
  });

  it("POST sets the owner from the token, ignoring `client` in the body", async () => {
    const res = await api
      .post("/api/cars")
      .set(bearer(client.token))
      .send({ ...car, client: worker.user._id })
      .expect(201);
    expect(res.body.client).toBe(client.user._id);
  });
});

describe("error response format", () => {
  it("uses { error } for not-found responses", async () => {
    const missingId = "0123456789abcdef01234567";
    const res = await api.get(`/api/cars/${missingId}`).expect(404);
    expect(res.body).toEqual({ error: "Car not found" });
  });
});

describe("/api/appointments", () => {
  it("returns 401 without a token", async () => {
    await api.get("/api/appointments").expect(401);
  });

  it("returns 200 for a logged-in user", async () => {
    await api.get("/api/appointments").set(bearer(client.token)).expect(200);
  });
});

describe("/api/offers (staff only)", () => {
  it("returns 401 without a token", async () => {
    await api.get("/api/offers").expect(401);
  });

  it("returns 403 for a client", async () => {
    const res = await api.get("/api/offers").set(bearer(client.token)).expect(403);
    expect(res.body.error).toMatch(/Forbidden/);
  });

  it("returns 200 for a worker", async () => {
    await api.get("/api/offers").set(bearer(worker.token)).expect(200);
  });
});
