import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import Logout from "../../components/logout.component";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import { api } from "@/api/api";
import type { UserInfo } from "@/types/user-info.type";

// Mock the API module
vi.mock("@/api/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

// Mock location.href
Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

const mockUserInfo: UserInfo = {
  name: "Test User",
  email: "test@example.com",
  picture: "test-picture.jpg",
  resources: {
    role: "none-editor",
    policy: {
      article: {
        reaction: ["read"],
        comments: ["read"],
      },
    },
  },
};

const mockEditorUserInfo: UserInfo = {
  ...mockUserInfo,
  email: "editor@monopress.com",
  resources: {
    role: "editor",
    policy: {
      article: {
        reaction: ["read", "update"],
        comments: ["delete", "read", "write", "update"],
      },
    },
  },
};

const renderWithContext = (userInfo: UserInfo) => {
  const mockContextValue = {
    userInfo,
    setUserInfo: vi.fn(),
  };

  return render(
    <userInfoContext.Provider value={mockContextValue}>
      <Logout />
    </userInfoContext.Provider>
  );
};

describe("Logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.href = "";
  });

  it("renders logout button with correct text", () => {
    renderWithContext(mockUserInfo);

    const logoutButton = screen.getByRole("button", { name: "Logg ut" });
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveAttribute("type", "button");
  });

  it("calls regular logout API for non-editor users", async () => {
    const mockApiGet = vi.mocked(api.get);
    renderWithContext(mockUserInfo);

    const logoutButton = screen.getByRole("button", { name: "Logg ut" });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith("/auth/logout");
      expect(window.location.href).toBe("/");
    });
  });

  it("calls fake user logout API for editor@monopress.com", async () => {
    const mockApiGet = vi.mocked(api.get);
    renderWithContext(mockEditorUserInfo);

    const logoutButton = screen.getByRole("button", { name: "Logg ut" });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith("/auth/logout/fake-user");
      expect(window.location.href).toBe("/");
    });
  });

  it("passes through additional button props", () => {
    const mockContextValue = {
      userInfo: mockUserInfo,
      setUserInfo: vi.fn(),
    };

    render(
      <userInfoContext.Provider value={mockContextValue}>
        <Logout className="custom-class" disabled data-testid="logout-btn" />
      </userInfoContext.Provider>
    );

    const logoutButton = screen.getByTestId("logout-btn");
    expect(logoutButton).toHaveClass("custom-class");
    expect(logoutButton).toBeDisabled();
  });
});
