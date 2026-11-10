"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser
} from "@/lib/api/users";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserListResponse
} from "@/types/user";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (search: string, page: number, limit: number) =>
    [...userKeys.lists(), { search, page, limit }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const
};

export function useUsers(
  search: string,
  page: number,
  limit: number
) {
  return useQuery({
    queryKey: userKeys.list(search, page, limit),
    queryFn: () => getUsers(search, page, limit),
    placeholderData: keepPreviousData
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: Number.isFinite(id)
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: (createdUser) => {
      queryClient.setQueryData(
        userKeys.detail(createdUser.id),
        createdUser
      );

      queryClient.invalidateQueries({
        queryKey: userKeys.lists()
      });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) =>
      updateUser({
        id: input.id,
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          website: input.website,
          active: input.active
        }
      }),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        userKeys.detail(updatedUser.id),
        updatedUser
      );

      queryClient.invalidateQueries({
        queryKey: userKeys.lists()
      });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),

    onSuccess: (_deletedUser, id) => {
      queryClient.removeQueries({
        queryKey: userKeys.detail(id)
      });

      queryClient.invalidateQueries({
        queryKey: userKeys.lists()
      });
    }
  });
}

/**
 * Optimistic update example:
 * Toggle the user's active state immediately in the list/detail cache.
 * If the server fails, rollback to the previous cached values.
 */
export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: number; active: boolean }) =>
      updateUser({
        id: input.id,
        data: { active: input.active }
      }),

    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({
        queryKey: userKeys.all
      });

      const previousLists =
        queryClient.getQueriesData<UserListResponse>({
          queryKey: userKeys.lists()
        });

      const previousDetail =
        queryClient.getQueryData<User>(
          userKeys.detail(id)
        );

      queryClient.setQueriesData<UserListResponse>(
        { queryKey: userKeys.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((user) =>
              user.id === id
                ? { ...user, active }
                : user
            )
          };
        }
      );

      queryClient.setQueryData<User>(
        userKeys.detail(id),
        (old) => old ? { ...old, active } : old
      );

      return {
        previousLists,
        previousDetail
      };
    },

    onError: (_error, { id }, context) => {
      context?.previousLists.forEach(
        ([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        }
      );

      queryClient.setQueryData(
        userKeys.detail(id),
        context?.previousDetail
      );
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists()
      });

      queryClient.invalidateQueries({
        queryKey: userKeys.detail(id)
      });
    }
  });
}
