import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

export const CHAIN = 'sui:testnet'
export const OWNER_ADDRESS = '0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d'
export const PRIVATE_KEY = "e9dba25e2c1999461f8cf27cf137d4218c9bc1fb425ea7c36a19b92cec0efe3b"
export const OBJECT_TYPE = '0xd8921f5ef54dc17694f53183c2458ca416578ec0e264d9065423fc6addbf7d9e::game::Hero'
const rpcUrl = getFullnodeUrl('testnet'); 
export const client = new SuiClient({ url: rpcUrl });
export const KIOSK_INDEX = 2