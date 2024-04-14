import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { KioskClient, KioskItem, KioskTransaction, Network, TransferPolicyTransaction, percentageToBasisPoints } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { fromHEX } from '@mysten/sui.js/utils';
import { useState } from 'react';
type ItemProps = {
    itemType: string,
    itemId: string,
    price: bigint
}

type TransferPolicyCap = {policyCapId: string, policyId: string, type: string}
function Purchase({itemType,itemId,price}: ItemProps) {
    console.log(itemType,itemId,price)
    const OWNER_ADDRESS = "0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d"
    const private_key = "e9dba25e2c1999461f8cf27cf137d4218c9bc1fb425ea7c36a19b92cec0efe3b"
    const rpcUrl = getFullnodeUrl('testnet'); 
    const client = new SuiClient({ url: rpcUrl });
    let keypair = new Ed25519Keypair();
    keypair = Ed25519Keypair.fromSecretKey(fromHEX(private_key));
    const kioskClient = new KioskClient({
        client,
        network: Network.TESTNET,
    });
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const purchase_item = async (itemType: string, itemId: string, price: bigint): Promise<any> => {
        const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
        const txb = new TransactionBlock();
        const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
        console.log(kioskTx)
        const tpTx = new TransferPolicyTransaction({ kioskClient, transactionBlock: txb });
        // await tpTx.create({
        //     type: itemType,
        //     publisher: "0x3a448363d99786e4b5e57dcbd36fd25ec498d307f8a89b05daa0242ea499fdd0",
        // })
        // tpTx
        //     .setCap
        
        // await kioskTx.purchaseAndResolve({
        //     itemType: itemType,
        //     itemId: itemId,
        //     price: price,
        //     sellerKiosk: '0xd1534f9e5d31032db749e839990c304035aa7a11ef267e7bd8d6bbdc1569ae45',
        // })
        // .then(res => {
        //     console.log(res)
        // })

    kioskTx
	.transfer({
		itemId: itemId,
		itemType,
		address: '0x06fa95fe9e9a3c2f7e396e8363f5574a4585097fb48b623e9f9507f8d7f43deb',
	})
	.finalize();
          
        // kioskTx.finalize();
        // signAndExecuteTransactionBlock(
        // {
        //     transactionBlock: txb,
        //     chain: 'sui:testnet',
        // },
        // {
        //     onSuccess: (result) => {
        //         console.log('executed transaction block', result);
        //     },
        // })

        
        // let result = await client.signAndExecuteTransactionBlock({
        //     signer: keypair,
        //     transactionBlock: txb});
        //     return result
    }
    return  <div>
            <button onClick={() => {
                purchase_item(itemType, itemId, price)
                .then(res => {
                    console.log('called')
                })
            }}>
                Purchase
            </button>
        </div>
}

export default Purchase
