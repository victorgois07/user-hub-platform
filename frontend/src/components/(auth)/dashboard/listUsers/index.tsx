"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { User } from "@/types/user";
import { Ellipsis, LoaderCircle, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DialogCreateUser } from "../DialogCreateUser";
import { DialogUser } from "../DialogUser";
import { ReloadButton } from "../ReloadButton";

const ITEMS_PER_PAGE = 10;

export function ListUsers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: users, isLoading } = useFetchUsers();

  const filteredUsers = useMemo(() => {
    return (
      users?.filter(
        (user: User) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      ) || []
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading)
    return (
      <>
        <LoaderCircle className="animate-spin size-8" />
        <h1 className="font-semibold text-lg">Loading...</h1>
      </>
    );

  return (
    <div className="flex flex-col items-center justify-start gap-4 h-2/3">
      <div className="flex items-center gap-2 rounded-2xl border px-4 py-0.5 shadow-sm w-full max-w-sm relative">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          title="Search user"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearch}
          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
        <div className="absolute -top-3 -right-14">
          <ReloadButton />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-6 w-6 p-0" variant="ghost" title="Add user">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogCreateUser />
        </Dialog>
      </div>

      <Table className="w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user: User) => (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell className="font-medium truncate max-w-4">
                {user.document}
              </TableCell>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="text-right">{user.email}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="h-6 w-6 p-0"
                      variant="ghost"
                      title="Actions"
                    >
                      <Ellipsis />
                    </Button>
                  </DialogTrigger>
                  <DialogUser user={user} />
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
          {paginatedUsers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-4 text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
