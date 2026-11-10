# Next.js + TanStack Query CRUD

A learning project for understanding TanStack Query with Next.js App Router.

## Features

- GET users with `useQuery`
- Dynamic detail query
- POST with `useMutation`
- PATCH with `useMutation`
- DELETE with `useMutation`
- Query keys
- Query cache
- `invalidateQueries`
- `setQueryData`
- `removeQueries`
- Optimistic update with rollback
- Search with debounce
- Pagination
- `keepPreviousData` / `placeholderData`
- Loading and error states
- Next.js Route Handlers
- Local JSON persistence for learning

## Run

```bash
npm install
npm run dev
```

Open:

http://localhost:3000/users

## Important

This project uses `data/users.json` as a simple local persistence layer.

That is intentionally done so the project works without a database.

For production, replace `lib/server/users-store.ts` with a real database/repository layer such as PostgreSQL + Prisma, MySQL, Oracle, etc.

## TanStack Query flow

### Read

```text
useQuery
  -> queryKey
  -> queryFn
  -> API
  -> cache
  -> UI
```

### Create / Update / Delete

```text
useMutation
  -> API
  -> onSuccess
  -> invalidateQueries
  -> refetch
  -> UI
```

### Optimistic Update

```text
onMutate
  -> cancelQueries
  -> snapshot
  -> setQueryData
  -> API
      -> success
      -> error -> rollback
  -> onSettled
  -> invalidateQueries
```

## Suggested learning order

1. `components/providers/query-provider.tsx`
2. `lib/api/users.ts`
3. `lib/queries/users.ts`
4. `components/users/user-list.tsx`
5. `components/users/user-form.tsx`
6. `components/users/user-item.tsx`
7. `app/api/users/route.ts`
8. `app/api/users/[id]/route.ts`
9. Optimistic update in `useToggleUserActive`
