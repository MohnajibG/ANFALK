import { timeToMinutes, minutesToTime, rangesOverlap } from "../time";

describe("timeToMinutes", () => {
  it("convertit une heure en minutes depuis minuit", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("09:30")).toBe(570);
    expect(timeToMinutes("23:59")).toBe(1439);
  });
});

describe("minutesToTime", () => {
  it("convertit des minutes en heure HH:mm", () => {
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(570)).toBe("09:30");
    expect(minutesToTime(1439)).toBe("23:59");
  });

  it("est l'inverse de timeToMinutes", () => {
    expect(minutesToTime(timeToMinutes("14:15"))).toBe("14:15");
  });
});

describe("rangesOverlap", () => {
  it("détecte un chevauchement partiel", () => {
    expect(rangesOverlap(60, 120, 90, 150)).toBe(true);
  });

  it("détecte l'absence de chevauchement quand les créneaux se touchent juste", () => {
    expect(rangesOverlap(60, 120, 120, 180)).toBe(false);
  });

  it("détecte l'absence de chevauchement quand les créneaux sont disjoints", () => {
    expect(rangesOverlap(60, 90, 120, 150)).toBe(false);
  });

  it("détecte un chevauchement quand un créneau contient l'autre", () => {
    expect(rangesOverlap(60, 180, 90, 120)).toBe(true);
  });
});
