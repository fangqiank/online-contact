import { getContacts, getDepartments } from "@/lib/queries";
import { ContactsPageClient } from "@/components/contacts-page-client";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    department?: string;
    status?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  try {
    const [contactsResult, departments] = await Promise.all([
      getContacts({
        page,
        pageSize,
        search: params.search,
        department: params.department,
        status: params.status,
      }),
      getDepartments(),
    ]);

    return (
      <ContactsPageClient
        contacts={contactsResult.data}
        totalPages={contactsResult.totalPages}
        total={contactsResult.total}
        currentPage={page}
        pageSize={pageSize}
        departments={departments}
      />
    );
  } catch (error) {
    console.error("Failed to load contacts:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">人员管理</h1>
        <p className="text-muted-foreground">
          加载失败，请检查数据库连接
        </p>
      </div>
    );
  }
}
