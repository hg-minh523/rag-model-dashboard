"use client";
import TableDemo from "@/components/dashboard/tables";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useKnowledge, { MaterialItem } from "@/hooks/data/useKnowledge";
import { ColumnDef } from "@tanstack/react-table";
import { LinkModal } from "./create-link-modal";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

const LinkComponents = () => {
  const {
    materialItems,
    deleteMaterialItem,
    createLinkKnowLedge,
    syncDataFromUrlToVector,
    isSyncUrl,
  } = useKnowledge({
    type: "link",
  });
  const router = useRouter();

  const columns: ColumnDef<MaterialItem>[] = [
    {
      accessorKey: "link",
      header: "Link",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {row.row.original?.material?.name}
        </div>
      ),
    },
    {
      accessorKey: "metaTitle",
      header: "Meta title",
      cell: (row) => (
        <p className="break-all line-clamp-2 w-1/2">{row.row.original.url}</p>
      ),
    },
    {
      accessorKey: "metaDescription",
      header: "Meta description",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {row.row.original.url}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Badge
            onClick={() => {
              router.push(`/dashboard/chunks/${row.row.original.id}?type=link`);
            }}
          >
            Update
          </Badge>
          <Badge
            onClick={() =>
              row.row.original.id &&
              syncDataFromUrlToVector(row.row.original.id)
            }
          >
            {isSyncUrl ? <LoadingSpinner /> : "Sync"}
          </Badge>
          <Badge
            className="border bg-white text-red-700 border-red-700"
            onClick={() =>
              row.row.original.id && deleteMaterialItem(row.row.original.id)
            }
          >
            Delete
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm tài tên tài liệu"
          className="mr-4 w-full flex-1"
        />
        <LinkModal onChange={createLinkKnowLedge} />
      </div>
      <TableDemo columns={columns} data={materialItems ?? []} />
    </div>
  );
};

export default LinkComponents;
