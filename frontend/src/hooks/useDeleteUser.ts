import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { toast } from 'sonner'

export function useDeleteUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/users/${id}`)
            return response.data
        },
        onSuccess: () => {
            toast.success('User deleted successfully!')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error: unknown) => {
            toast.error(`Failed to delete user: ${(error as Error).message}`)
        },
    })
}
