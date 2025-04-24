import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

const fetchUsers = async () => {
    const { data } = await api.get('/users')
    return data.data
}

export function useFetchUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
    })
}
