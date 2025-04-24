import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { User } from '@/types/user'

export function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (user: User) => {
            const { id, ...payload } = user
            const response = await api.put(`/users/${id}`, payload)
            return response.data
        },
        onSuccess: () => {
            toast.success('User updated successfully!')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error: unknown) => {
            toast.error(`Failed to update user: ${(error as Error).message}`)
        },
    })
}
