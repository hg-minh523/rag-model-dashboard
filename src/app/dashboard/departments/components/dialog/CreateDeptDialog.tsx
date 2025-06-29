"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Department } from "@/hooks/data/useDepartments";
import { useState } from "react";
import CreateOrUpdateForm from "../form/CreateOrUpdateDepartmentForm";
import { useTranslations } from "@/hooks/useTranslations";

interface CreateDeptModalProps {
  department?: Department;
  onChange: (data: {
    id?: string;
    name: string;
    description: string;
    prompt: string;
    isPublic?: boolean;
  }) => void;
}

export default function CreateDeptDialog({
  department,
  onChange,
}: CreateDeptModalProps) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button>+ {t("dashboard.departments.modal.createButton")}</Button>
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {department
              ? t("dashboard.departments.modal.editTitle")
              : t("dashboard.departments.modal.createTitle")}
          </DialogTitle>
        </DialogHeader>
        <div>
          <CreateOrUpdateForm
            department={department}
            onSubmit={({ data }) => onChange(data)}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
