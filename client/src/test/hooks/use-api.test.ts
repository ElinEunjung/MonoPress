import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useApi } from "../../hooks/use-api";
import { api } from "@/api/api";
import type { Mock } from "vitest";
import { AxiosError, type AxiosRequestHeaders } from "axios";

// Mock the api module
vi.mock("@/api/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useApi", () => {
  const testUri = "/test";
  const mockData = { message: "Test success" };
  const mockError = new AxiosError(
    "Request failed with status code 400",
    "ERR_BAD_REQUEST",
    { headers: {} as AxiosRequestHeaders, method: "get", url: "/test" },
    {},
    {
      status: 400,
      statusText: "Bad Request",
      headers: {} as AxiosRequestHeaders,
      data: { message: "Test error" },
      config: { headers: {} as AxiosRequestHeaders },
    }
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET requests", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(() => useApi(testUri, { method: "post" }));

      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should fetch data successfully on mount", async () => {
      (api.get as Mock).mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useApi(testUri));

      // Wait for the initial fetch to complete
      await vi.waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(api.get).toHaveBeenCalledWith(testUri);
    });

    it("should handle errors during GET request", async () => {
      (api.get as Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useApi(testUri));

      // Wait for the error state to be set
      await vi.waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.response?.status).toBe(400);
    });
  });

  describe("POST requests", () => {
    it("should not fetch on mount for POST methods", () => {
      renderHook(() => useApi(testUri, { method: "post" }));
      expect(api.post).not.toHaveBeenCalled();
    });

    it("should handle POST request successfully", async () => {
      (api.post as Mock).mockResolvedValueOnce({ data: mockData });
      const testBody = { testKey: "testValue" };

      const { result } = renderHook(() => useApi(testUri, { method: "post" }));

      let response;
      await act(async () => {
        response = await result.current.mutate(testBody);
      });

      // Wait for state updates to complete
      await vi.waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(response).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(api.post).toHaveBeenCalledWith(testUri, testBody);
    });

    it("should handle errors during POST request", async () => {
      (api.post as Mock).mockRejectedValueOnce(mockError);
      const testBody = { testKey: "testValue" };

      const { result } = renderHook(() => useApi(testUri, { method: "post" }));

      await act(async () => {
        try {
          await result.current.mutate(testBody);
        } catch (_error) {
          // Error is expected
        }
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.status).toBe(400);
      expect(result.current.data).toBeNull();
    });
  });

  describe("PUT requests", () => {
    it("should handle PUT request successfully", async () => {
      (api.put as Mock).mockResolvedValueOnce({ data: mockData });
      const testBody = { testKey: "testValue" };

      const { result } = renderHook(() => useApi(testUri, { method: "put" }));

      let response;
      await act(async () => {
        response = await result.current.mutate(testBody);
      });

      // Wait for state updates to complete
      await vi.waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(response).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(api.put).toHaveBeenCalledWith(testUri, testBody);
    });
  });

  describe("DELETE requests", () => {
    it("should handle DELETE request successfully", async () => {
      (api.delete as Mock).mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useApi(testUri, { method: "delete" })
      );

      let response;
      await act(async () => {
        response = await result.current.mutate();
      });

      // Wait for state updates to complete
      await vi.waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(response).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(api.delete).toHaveBeenCalledWith(testUri);
    });
  });

  describe("State management", () => {
    it("should handle loading state correctly", async () => {
      (api.post as Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: mockData }), 100);
          })
      );

      const { result } = renderHook(() => useApi(testUri, { method: "post" }));

      let promise: Promise<unknown>;
      act(() => {
        promise = result.current.mutate({ test: true });
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await promise;
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });

    it("should reset error states before new requests", async () => {
      // First request fails
      (api.post as Mock).mockRejectedValueOnce(mockError);
      // Second request succeeds
      (api.post as Mock).mockResolvedValueOnce({ data: mockData });

      const testBody = { testKey: "testValue" };
      const { result } = renderHook(() => useApi(testUri, { method: "post" }));

      // First request (fails)
      await act(async () => {
        await result.current.mutate(testBody);
      });

      // Wait for error state
      await vi.waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Second request (succeeds)
      await act(async () => {
        await result.current.mutate(testBody);
      });

      // Wait for success state
      await vi.waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
