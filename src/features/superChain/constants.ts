import SuperChainSetupABI from './abi/SuperChainSetup.json'
import SuperChainModuleABI from './abi/SuperChainModule.json'
import type { Address } from 'viem'

enum ENVIRONMENTS {
  development = 'development',
  production = 'production',
}

const ENV = (process.env.NEXT_PUBLIC_APP_ENV as ENVIRONMENTS) || ENVIRONMENTS.development
const environmentConfig = {
  development: {
    SUPER_CHAIN_SETUP_ADDRESS: '0x3b134026f14A697eEEE4623397E9c9DdC1223577',
    SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS: '0x5b46F961E4d9282486Da3B77f3EF63553A5e0380',
    SUPER_CHAIN_ACCOUNT_GUARD_ADDRESS: '0x3f304e0813a8Bc3e66fE6104a3C1174E27eC4f4D',
    ERC4337_MODULE_ADDRESS: '0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226',
    JSON_RPC_PROVIDER: process.env.NEXT_PUBLIC_JSON_RPC_PROVIDER_TESTNET,
    CHAIN_ID: '11155111',
  },
  production: {
    SUPER_CHAIN_SETUP_ADDRESS: '0xd2B51c08de198651653523ED14A137Df3aE86Ee0',
    SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS: '0xFe6a2C0847C0cC326eCF762A428D436e4bEc6B99',
    SUPER_CHAIN_ACCOUNT_GUARD_ADDRESS: '0x3f304e0813a8Bc3e66fE6104a3C1174E27eC4f4D',
    ERC4337_MODULE_ADDRESS: '0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226',
    JSON_RPC_PROVIDER: process.env.NEXT_PUBLIC_JSON_RPC_PROVIDER,
    CHAIN_ID: '10',
  },
}[ENV]

export const SUPER_CHAIN_SETUP_ABI = SuperChainSetupABI
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI
export const SUPER_CHAIN_SETUP_ADDRESS = environmentConfig.SUPER_CHAIN_SETUP_ADDRESS as Address
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS = environmentConfig.SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS as Address
export const SUPER_CHAIN_ACCOUNT_GUARD_ADDRESS = environmentConfig.SUPER_CHAIN_ACCOUNT_GUARD_ADDRESS as Address
export const ERC4337_MODULE_ADDRESS = environmentConfig.ERC4337_MODULE_ADDRESS as Address
export const JSON_RPC_PROVIDER = environmentConfig.JSON_RPC_PROVIDER
export const CHAIN_ID = environmentConfig.CHAIN_ID
