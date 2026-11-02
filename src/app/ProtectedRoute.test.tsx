import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { api, ElWarshaApiError } from "@core/api";
import { clearSessionCache } from "@core/session";
import { AppRoutes } from "./App.js";
import { ProtectedRoute } from "./ProtectedRoute.js";

vi.mock("@core/api", () => ({
  api: {
    me: vi.fn(),
    loginUrl: vi.fn(
      (params?: { locale?: string }) =>
        `http://localhost:3001/api/v1/auth/login${params?.locale ? `?locale=${params.locale}` : ""}`,
    ),
    logout: vi.fn(),
  },
  ElWarshaApiError: class extends Error {
    constructor(
      readonly status: number,
      readonly body: unknown = null,
    ) {
      super();
    }
  },
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    clearSessionCache();
    vi.mocked(api.me).mockReset();
    vi.mocked(api.logout).mockReset();
  });

  it("renders the signed-out screen when an unauthenticated user visits a protected portal route", async () => {
    vi.mocked(api.me).mockRejectedValue(new ElWarshaApiError(401, null));

    render(
      <MemoryRouter initialEntries={["/en/portal/weeks"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    const signedOutScreen = await screen.findByTestId("signed-out-screen");
    expect(signedOutScreen).toBeInTheDocument();
    expect(signedOutScreen).toHaveAttribute("role", "alert");
    expect(
      screen.getByRole("heading", { name: /Sign in to see this week/i }),
    ).toBeInTheDocument();

    const loginLink = within(signedOutScreen).getByRole("link", {
      name: "Log in",
    });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute(
      "href",
      "http://localhost:3001/api/v1/auth/login?locale=en",
    );
  });

  it("renders the protected content when authenticated with valid permissions", async () => {
    vi.mocked(api.me).mockResolvedValue({
      user: {
        id: "usr-1",
        displayName: "Ada Lovelace",
        email: "ada@example.com",
        locale: "en",
      },
      roles: ["participant"],
      capabilities: ["portal.view", "weeks.read"],
      memberships: [],
    });

    render(
      <MemoryRouter initialEntries={["/en/portal/test-content"]}>
        <Routes>
          <Route path="/:locale" element={<ProtectedRoute />}>
            <Route
              path="portal/test-content"
              element={<div data-testid="protected-content">Secret Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const content = await screen.findByTestId("protected-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("Secret Content");
    expect(screen.queryByTestId("signed-out-screen")).not.toBeInTheDocument();
  });

  it("renders the access-denied screen (403) when user lacks required capability", async () => {
    vi.mocked(api.me).mockResolvedValue({
      user: {
        id: "usr-2",
        displayName: "Guest User",
        email: "guest@example.com",
        locale: "en",
      },
      roles: [],
      capabilities: [], // Missing "portal.view"
      memberships: [],
    });

    render(
      <MemoryRouter initialEntries={["/en/portal/weeks"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    const deniedScreen = await screen.findByTestId("access-denied-screen");
    expect(deniedScreen).toBeInTheDocument();
    expect(deniedScreen).toHaveAttribute("role", "alert");
    expect(screen.getByRole("heading", { name: /Access denied/i })).toBeInTheDocument();
  });

  it("shows user name and sign-out button in header when authenticated and triggers logout", async () => {
    const user = userEvent.setup();
    vi.mocked(api.me).mockResolvedValue({
      user: {
        id: "usr-3",
        displayName: "Omar Sharif",
        email: "omar@example.com",
        locale: "en",
      },
      roles: ["participant"],
      capabilities: ["portal.view"],
      memberships: [],
    });
    vi.mocked(api.logout).mockResolvedValue({ ok: true });

    render(
      <MemoryRouter initialEntries={["/en"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("header-user-name")).toHaveTextContent(
      "Omar Sharif",
    );
    const signOutBtn = screen.getByRole("button", { name: "Sign out" });
    expect(signOutBtn).toBeInTheDocument();

    await user.click(signOutBtn);
    expect(api.logout).toHaveBeenCalledTimes(1);
  });
});
