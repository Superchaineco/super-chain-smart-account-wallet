import type { SuperChainAccount } from '@/types/super-chain'
import type { AsyncResult } from '../useAsync'
import useSuperChainAccount from '../super-chain/useSuperChainAccount'
import useSafeInfo from '../useSafeInfo'
import { useQuery } from '@tanstack/react-query'

export const useLoadSuperChainAccount = (): AsyncResult<SuperChainAccount> => {
  const { safe } = useSafeInfo()
  const { address } = safe
  const { getReadOnlySuperChainSmartAccount } = useSuperChainAccount()
  const SuperChainAccountContractReadOnly = getReadOnlySuperChainSmartAccount()
  const { data, isLoading, error } = useQuery<SuperChainAccount>({
    queryKey: ['superChainAccount', address.value],
    queryFn: async () => {
      console.debug(address.value)
      const response = await SuperChainAccountContractReadOnly.getSuperChainAccount(address.value)
      let pointsToNextLevel = null
      try {
        const pointsToNextLevelResponse = await SuperChainAccountContractReadOnly.getNextLevelPoints(address.value)
        console.debug('pointsToNextLevelResponse', pointsToNextLevelResponse)
        pointsToNextLevel = pointsToNextLevelResponse
      } catch (e) {
        console.error(e)
      }
      return {
        smartAccount: response[0],
        superChainID: response[1],
        points: response[2],
        level: response[3],
        noun: response[4],
        pointsToNextLevel,
      }
    },
  })
  return [data, error!, isLoading]
}
