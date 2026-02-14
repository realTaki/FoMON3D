import type { Address } from "viem";
import fomonTokenAbi from "./abi/FoMONToken.json";
import gameVaultAbi from "./abi/GameVault.json";

export const fomonTokenAbiJson = fomonTokenAbi as readonly unknown[];
export const gameVaultAbiJson = gameVaultAbi as readonly unknown[];

const ZERO = "0x0000000000000000000000000000000000000000" as Address;

// Deploy: cd contracts && forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key <ANVIL_DEFAULT_KEY>
// Then paste the logged addresses here.
const addresses: Record<number, { fomonToken: Address; gameVault: Address }> = {
  31337: {
    fomonToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as Address,
    gameVault: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" as Address,
  },
  10143: {
    fomonToken: "0xd08934afd2affffacc8ccfffde8a7ca5a61f2549" as Address,
    gameVault: "0x5f0dae5fc34b739f62e63bdc5dabfb830cade5a3" as Address,
  },
};

export function getContractAddresses(chainId: number) {
  return addresses[chainId] ?? addresses[31337];
}

export function isContractConfigured(chainId: number): boolean {
  const { gameVault } = getContractAddresses(chainId);
  return gameVault !== ZERO;
}
