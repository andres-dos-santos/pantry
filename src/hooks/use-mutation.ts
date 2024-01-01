/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  type MutationFunction,
  type MutateOptions,
  useQueryClient,
} from '@tanstack/react-query'

export function useMutate<V, D = void>(
  mutationFn: MutationFunction<D, V>,
  invalidationsThisQueries?: string[],
  options?: Omit<MutateOptions<D, any, V, unknown>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()

  const mutate = useMutation<D, any, V, unknown>({
    mutationFn,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: invalidationsThisQueries })
    },
    ...options,
  })

  return mutate
}
