"use client";
import { useState } from "react";
import Tables from "@/components/dashboard/tables";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useKnowledge, { MaterialItem } from "@/hooks/data/useKnowledge";
import { ColumnDef } from "@tanstack/react-table";
import { LinkModal } from "./create-link-modal";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";
import { AlertDialogComponent } from "../../../components/dashboard/alert-modal";

const LinkComponents = () => {
  const [search, setSearch] = useState("");
  const [limit] = useState(10);
  const [page, setPage] = useState(1);

  const {
    materialItems,
    createLinkKnowLedge,
    syncDataFromUrlToVector,
    isSyncUrl,
    deleteLink,
  } = useKnowledge({
    type: "link",
    search,
    limit,
    page,
  });

  const router = useRouter();

  const columns: ColumnDef<MaterialItem>[] = [
    {
      accessorKey: "link",
      header: "Link",
      cell: () => (
        <div className="break-all line-clamp-2 w-1/2">
          {/* {row.row.original?.material?.url} */}
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
          <AlertDialogComponent
            description="Bạn có chắc chắn muốn xóa tài liệu này không?"
            title="Xác nhận xóa"
            onConfirm={() =>
              row.row.original.id && deleteLink(row.row.original.id)
            }
            onCancel={() => {}}
          />
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <LinkModal onChange={createLinkKnowLedge} />
      </div>
      <Tables
        columns={columns}
        data={materialItems ?? []}
        onChange={(page) => {
          setPage(page);
        }}
        page={page}
      />
    </div>
  );
};

export default LinkComponents;
