import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RegisterType } from '@/components/(auth)/dashboard/form'
import api from '@/lib/axios'
import { toast } from 'sonner'

export function useRegisterUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: RegisterType) => {
            const response = await api.post('/users', data)
            return response.data
        },
        onSuccess: () => {
            toast.success("Event has been created.")
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) => {
            console.error("Failed to create user", error)
            toast.error(`Failed to create user!`)
        },
    })
}
