"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import isEqual from "lodash.isequal";
import { Ban, Check, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DialogConfirm } from "../DialogConfirm";
import { formSchema, RegisterType } from "../form";

export function DialogUser({ user }: { user: User }) {
  const [showSaveCancel, setShowSaveCancel] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const form = useForm<RegisterType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      document: user.document,
      documentType: user.documentType,
      password: "",
    },
  });

  const { mutate: updateUser, isPending } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const onSubmit = (data: RegisterType) => {
    updateUser({ id: user.id, ...data });
    setShowSaveCancel(false);
  };

  const watched = form.watch();

  useEffect(() => {
    const hasChanges = !isEqual(watched, form.getValues());
    const isDirty = Object.keys(form.formState.dirtyFields).length > 0;
    setShowSaveCancel(isDirty || hasChanges);
  }, [watched, form]);

  return (
    <DialogContent>
      <DialogHeader className="mb-2">
        <DialogTitle>User info</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-2 py-2 transition-all duration-300"
        >
          {["firstName", "lastName", "email"].map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as keyof RegisterType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{field.name}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Document</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPF">CPF</SelectItem>
                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {showSaveCancel && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex gap-2 pt-2">
            {showSaveCancel && !isPending && (
              <>
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 text-white font-semibold"
                >
                  <Check /> Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 hover:bg-red-500 hover:text-white font-semibold"
                  onClick={() => {
                    form.reset();
                    setShowSaveCancel(false);
                  }}
                >
                  <Ban /> Cancel
                </Button>
              </>
            )}

            {!showSaveCancel && !isPending && (
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <Trash2 /> Delete
              </Button>
            )}

            {isPending && (
              <Button className="flex-1 font-semibold" disabled>
                <LoaderCircle className="animate-spin size-5" /> Saving...
              </Button>
            )}
          </div>
        </form>
      </Form>

      <DialogConfirm
        open={confirmDeleteOpen}
        setOpen={setConfirmDeleteOpen}
        title="Delete user"
        description="Are you sure you want to delete this user?"
        action={() => deleteUser(user.id)}
      />
    </DialogContent>
  );
}
