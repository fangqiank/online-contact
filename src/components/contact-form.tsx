"use client";

import { useEffect, useRef, useState } from "react";
import type { Contact, NewContact } from "@/lib/types";
import {
  createContact,
  updateContact,
} from "@/app/actions/contacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  contact?: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  hireDate: string;
  employeeId: string;
  avatarUrl: string;
  notes: string;
  emergencyContact: string;
  address: string;
  salaryLevel: string;
}

function toFormState(contact?: Contact | null): FormState {
  return {
    name: contact?.name ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    department: contact?.department ?? "",
    position: contact?.position ?? "",
    status: contact?.status ?? "active",
    hireDate: contact?.hireDate ?? "",
    employeeId: contact?.employeeId ?? "",
    avatarUrl: contact?.avatarUrl ?? "",
    notes: contact?.notes ?? "",
    emergencyContact: contact?.emergencyContact ?? "",
    address: contact?.address ?? "",
    salaryLevel: contact?.salaryLevel ?? "",
  };
}

export function ContactForm({
  contact,
  open,
  onOpenChange,
}: ContactFormProps) {
  const isEdit = !!contact;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(toFormState(null));
  const prevOpen = useRef(open);

  // 当 dialog 打开或 contact 变化时，同步表单数据
  useEffect(() => {
    if (open) {
      setForm(toFormState(contact));
    }
    // 关闭时清理表单
    if (!open && prevOpen.current) {
      setLoading(false);
    }
    prevOpen.current = open;
  }, [open, contact]);

  function handleOpenChange(value: boolean) {
    onOpenChange(value);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("姓名为必填项");
      return;
    }

    setLoading(true);

    const data: NewContact = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      department: form.department.trim() || null,
      position: form.position.trim() || null,
      status: form.status,
      hireDate: form.hireDate || null,
      employeeId: form.employeeId.trim() || null,
      avatarUrl: form.avatarUrl.trim() || null,
      notes: form.notes.trim() || null,
      emergencyContact: form.emergencyContact.trim() || null,
      address: form.address.trim() || null,
      salaryLevel: form.salaryLevel.trim() || null,
    };

    const result = isEdit
      ? await updateContact(contact.id, data)
      : await createContact(data);

    setLoading(false);

    if (result.success) {
      toast.success(
        isEdit ? "人员信息已更新" : "人员已添加"
      );
      onOpenChange(false);
    } else {
      toast.error(result.error ?? "操作失败，请重试");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑人员" : "添加人员"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "修改下方的人员信息"
              : "填写下方的人员信息"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              基本信息
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  姓名 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="请输入姓名"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">工号</Label>
                <Input
                  id="employeeId"
                  value={form.employeeId}
                  onChange={(e) => updateField("employeeId", e.target.value)}
                  placeholder="例如 EMP001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">电话</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="请输入电话号码"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">部门</Label>
                <Input
                  id="department"
                  value={form.department}
                  onChange={(e) => updateField("department", e.target.value)}
                  placeholder="请输入部门名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">职位</Label>
                <Input
                  id="position"
                  value={form.position}
                  onChange={(e) => updateField("position", e.target.value)}
                  placeholder="请输入职位"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => updateField("status", v as string)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">在职</SelectItem>
                    <SelectItem value="resigned">离职</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">入职日期</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={form.hireDate}
                  onChange={(e) => updateField("hireDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 补充信息 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              补充信息
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salaryLevel">薪资等级</Label>
                <Input
                  id="salaryLevel"
                  value={form.salaryLevel}
                  onChange={(e) => updateField("salaryLevel", e.target.value)}
                  placeholder="例如 P5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">紧急联系人</Label>
                <Input
                  id="emergencyContact"
                  value={form.emergencyContact}
                  onChange={(e) =>
                    updateField("emergencyContact", e.target.value)
                  }
                  placeholder="姓名及电话"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">头像链接</Label>
              <Input
                id="avatarUrl"
                value={form.avatarUrl}
                onChange={(e) => updateField("avatarUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">地址</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="请输入详细地址"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">备注</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="其他备注信息"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "保存修改" : "添加人员"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
