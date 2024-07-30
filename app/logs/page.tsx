import { useSession } from "@/lib/auth/use-session";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { getLogs } from "@/lib/data/logs";
import { getEndpoints } from "@/lib/data/endpoints";
import { DataTable } from "@/components/groups/logs/data-table";
import { columns } from "@/components/groups/logs/columns";
import { PageWrapper } from "@/components/parts/page-wrapper";

const pageData = {
  name: "Logs",
  title: "Logs",
  description: "Logs of all your events",
};

export default async function Page() {
  const session = await useSession();
  if (!session) redirect("/login");

  const logs = await getLogs(session?.user?.id);
  const endpoints = await getEndpoints(session?.user?.id);

  return (
    <>
      <Breadcrumbs pageName={pageData?.name} />
      <PageWrapper>
        <Header title={pageData?.title}>{pageData?.description}</Header>
        <DataTable columns={columns} data={logs} endpoints={endpoints} />
      </PageWrapper>
    </>
  );
}
