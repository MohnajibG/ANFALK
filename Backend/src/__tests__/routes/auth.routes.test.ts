import request from "supertest";

import app from "../../app";
import { startTestDB, stopTestDB, clearTestDB, createUser } from "../testUtils";

beforeAll(startTestDB);
afterAll(stopTestDB);
afterEach(clearTestDB);

describe("Auth routes", () => {
  it("POST /api/auth/login refuse un mauvais mot de passe", async () => {
    await createUser({ role: "admin", email: "admin@test.com" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/auth/login refuse un compte désactivé", async () => {
    await createUser({
      role: "admin",
      email: "inactive@test.com",
      isActive: false,
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "inactive@test.com", password: "Test1234!" });

    expect(res.status).toBe(403);
  });

  it("POST /api/auth/login réussit avec les bons identifiants et renvoie un token", async () => {
    await createUser({ role: "admin", email: "ok@test.com" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ok@test.com", password: "Test1234!" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("ok@test.com");
  });

  it("GET /api/auth/me refuse sans token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("GET /api/auth/me renvoie l'utilisateur courant avec un token valide", async () => {
    const { token, user } = await createUser({ role: "employee" });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user._id).toBe(user._id.toString());
  });

  it("PATCH /api/auth/change-password refuse un mauvais mot de passe actuel", async () => {
    const { token } = await createUser({ role: "cashier" });

    const res = await request(app)
      .patch("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "wrong", newPassword: "NewPass123!" });

    expect(res.status).toBe(400);
  });

  it("PATCH /api/auth/change-password réussit avec le bon mot de passe actuel", async () => {
    const { token } = await createUser({ role: "cashier" });

    const res = await request(app)
      .patch("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "Test1234!", newPassword: "NewPass123!" });

    expect(res.status).toBe(200);
  });
});
