import { api } from "./helpers.js";

// Express' default error pages are HTML -> app.js turns them into { error } like every other response

describe("error responses", () => {
  it("returns 400 { error } for malformed JSON", async () => {
    const res = await api
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send("{not json")
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual(expect.any(String));
  });

  it("returns 413 { error } for a body larger than the JSON limit", async () => {
    const res = await api
      .post("/api/users/login")
      .send({ email: "a".repeat(200_000) })
      .expect(413)
      .expect("Content-Type", /json/);
    expect(res.body.error).toEqual(expect.any(String));
  });

  it("returns 404 { error } for an unknown route", async () => {
    const res = await api.get("/api/does-not-exist").expect(404).expect("Content-Type", /json/);
    expect(res.body.error).toEqual(expect.any(String));
  });
});
