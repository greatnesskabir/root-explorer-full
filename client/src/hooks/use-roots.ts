import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Error wrapper to handle specific backend status codes nicely
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Hook to search for a specific Arabic word or root.
 * Validates against the /api/roots/search endpoint.
 */
export function useSearchRoot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (query: string) => {
      // Input validation based on the schema
      const input = api.roots.search.input.parse({ query });

      const res = await fetch(api.roots.search.path, {
        method: api.roots.search.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });

      if (res.status === 404) {
        throw new ApiError(404, "No verified root data available for this spelling");
      }

      if (!res.ok) {
        throw new ApiError(res.status, "An error occurred while searching");
      }

      const data = await res.json();
      return api.roots.search.responses[200].parse(data);
    },
    onSuccess: () => {
      // Invalidate recent searches so the list updates after a successful search
      queryClient.invalidateQueries({ queryKey: [api.roots.recent.path] });
    },
  });
}

/**
 * Hook to retrieve the list of recent searches.
 */
export function useRecentRoots() {
  return useQuery({
    queryKey: [api.roots.recent.path],
    queryFn: async () => {
      const res = await fetch(api.roots.recent.path, { credentials: "include" });
      if (!res.ok) {
        throw new ApiError(res.status, "Failed to fetch recent searches");
      }
      const data = await res.json();
      return api.roots.recent.responses[200].parse(data);
    },
  });
}
