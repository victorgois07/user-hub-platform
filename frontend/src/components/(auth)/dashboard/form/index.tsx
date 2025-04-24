"use client"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "../../../ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegisterUser } from "@/hooks/useRegisterUser"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    document: z.string().min(1, { message: "Document is required." }),
    documentType: z.enum(["CPF", "CNPJ"], { message: "Document type is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
})


export type RegisterType = z.infer<typeof formSchema>

export function RegisterForm() {
    const form = useForm<RegisterType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            document: "",
            documentType: undefined,
            email: "",
            password: "",
        },
    })

    const { mutate, isPending, isSuccess, isError, error } = useRegisterUser()

    const onSubmit = (data: RegisterType) => {
        try {
            mutate(data)
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full flex flex-col text-center">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="document"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Document</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345678900" {...field} />
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
                                    <Select>
                                        <SelectTrigger className="w-full" {...field}>
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

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="password123" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!isSuccess && (
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating user..." : "Create user"}
                    </Button>
                )}

                {isSuccess && (
                    <p className="text-green-500 text-sm">User registered successfully!</p>
                )}

                {isError && (
                    <p className="text-red-500 text-sm">Error: {(error)?.message}</p>
                )}
            </form>
        </Form>
    )
}
