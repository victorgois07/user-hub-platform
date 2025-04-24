export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    document: string
    documentType: "CPF" | "CNPJ" | undefined
    password?: string
}