import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
export type MaterialItem = {
  material: unknown;
  id?: number;
  materialId: number;
  text?: string;
  url?: string;
  file?: File | string;
  name?: string;
  type?: string;
  size?: string;
  updatedAt?: string;
};

export type LinkKnowLedge = {
  url: string;
};
const useKnowledge = ({
  id,
  type,
  search,
  limit,
  page,
}: {
  id?: string;
  type?: string;
  search?: string;
  limit?: number;
  page?: number;
}) => {
  const { toast } = useToast();

  const {
    data: materialItems,
    isLoading: materialItemsLoading,
    refetch: refetchMaterialItems,
  } = useQuery({
    queryKey: ["knowledge", type, search, limit, page],
    queryFn: async () => {
      const data = await axiosInstance.get(`/api/knowledge/`, {
        params: {
          type,
          search,
          limit,
          page,
        },
      });
      return data ?? [];
    },
    enabled: !!type,
    refetchOnWindowFocus: false,
  });

  /*
   * upload file
   */

  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(
      "/api/knowledge/upload-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.path;
  };

  /*
   * fetch chunks of material item
   */

  const { data: chunks, isFetching: isFetchingChunk } = useQuery({
    queryKey: ["chunks"],
    queryFn: async () => {
      const data = await axiosInstance.get(`/api/knowledge/chunks/${id}`);
      return data ?? [];
    },
    enabled: !!id,
  });

  const { mutate: syncKnowLedgeToVector, isPending: isSyncKnowledge } =
    useMutation({
      mutationFn: async (knowledgeId: number) => {
        const data = await axiosInstance.get(
          `/api/knowledge/sync/${knowledgeId}`
        );
        return data || [];
      },
    });

  const { mutate: createLinkKnowLedge } = useMutation({
    mutationFn: async ({ url }: LinkKnowLedge) => {
      const data = await axiosInstance.post("/api/knowledge/link", {
        url,
      });
      return data || [];
    },
    onSuccess: () => {
      toast({
        title: "Created",
        description: `Created at ${new Date().toLocaleTimeString()}`,
      });
      refetchMaterialItems();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Error at ${new Date().toLocaleTimeString()}`,
      });
      refetchMaterialItems();
    },
  });

  const { mutate: syncDataFromUrlToVector, isPending: isSyncUrl } = useMutation(
    {
      mutationFn: async (knowledgeId: number) => {
        const data = await axiosInstance.get(
          `/api/knowledge/sync-web/${knowledgeId}`
        );
        return data || [];
      },
    }
  );

  const { mutate: deleteLink } = useMutation({
    mutationFn: async (knowledgeId: number) => {
      const data = await axiosInstance.delete(
        `/api/knowledge/link/${knowledgeId}`
      );
      return data || [];
    },
    onSuccess: () => {
      toast({
        title: "Deleted",
        description: `Deleted at ${new Date().toLocaleTimeString()}`,
      });
      refetchMaterialItems();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `
          Error at ${new Date().toLocaleTimeString()}
          `,
      });
      refetchMaterialItems();
    },
  });

  const { mutate: deleteFileKnowledge } = useMutation({
    mutationFn: async (knowledgeId: number) => {
      const data = await axiosInstance.delete(
        `/api/knowledge/file/${knowledgeId}`
      );
      return data || [];
    },
    onError: () => {
      toast({
        title: "Error",
        description: `
          Error at ${new Date().toLocaleTimeString()}
          `,
      });
      refetchMaterialItems();
    },

    onSuccess: () => {
      toast({
        title: "Deleted",
        description: `Deleted at ${new Date().toLocaleTimeString()}`,
      });
      refetchMaterialItems();
    },
  });

  return {
    createLinkKnowLedge,
    deleteLink,
    deleteFileKnowledge,
    materialItems,
    materialItemsLoading,
    chunks,
    handleUploadFile,
    refetchMaterialItems,
    syncDataFromUrlToVector,
    isSyncUrl,
    isFetchingChunk,
    syncKnowLedgeToVector,
    isSyncKnowledge,
  };
};

export default useKnowledge;
