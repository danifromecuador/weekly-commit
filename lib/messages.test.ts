import { describe, expect, it } from "vitest";

import { getMessages } from "./messages";

describe("getMessages grid copy", () => {
  it("exposes empty-state strings in English", () => {
    const m = getMessages("en");
    expect(m.grid.noActivities).toBe("No activities yet.");
    expect(m.grid.addGoal).toBe("Add");
    expect(m.grid.addActivity).toBe("Add activity");
  });

  it("exposes empty-state strings in Spanish", () => {
    const m = getMessages("es");
    expect(m.grid.noActivities).toBe("Aún no hay actividades.");
    expect(m.grid.addGoal).toBe("Agregar");
    expect(m.grid.addActivity).toBe("Agregar actividad");
  });
});
