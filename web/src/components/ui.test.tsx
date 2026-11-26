import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Toggle } from "./ui";
import { ThemeToggle } from "./ThemeToggle";

describe("UI components", () => {
  it("Toggle exposes switch semantics and reports changes", () => {
    const onChange = vi.fn();
    render(<Toggle label="Pause all automation" checked={false} onChange={onChange} />);
    const sw = screen.getByRole("switch", { name: "Pause all automation" });
    expect(sw.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("ThemeToggle switches and persists the theme", () => {
    document.documentElement.dataset.theme = "light";
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("jobflow-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeTruthy();
  });
});
