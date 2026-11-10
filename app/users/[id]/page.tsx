import UserDetail from "@/components/users/user-detail";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <UserDetail id={Number(id)} />
    </main>
  );
}
