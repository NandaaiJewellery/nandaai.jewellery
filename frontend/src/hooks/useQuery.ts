import { useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export function useUserQuery<TData>(
    keyFactory: (userId?: number) => readonly unknown[],
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
    const { user } = useAuth();

    return useQuery({
        queryKey: keyFactory(user?.id),
        queryFn,
        enabled: !!user && (options?.enabled ?? true),
        meta: { requiresAuth: true },
        ...options,
    });
}

export function useUserInvalidate() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return {
        invalidate: (keyFactory: (userId?: number) => readonly unknown[]) => {
            queryClient.invalidateQueries({
                queryKey: keyFactory(user?.id),
            });
        },
    };
}