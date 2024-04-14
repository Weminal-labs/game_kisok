import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { KioskClient, KioskItem, KioskTransaction, Network, TransferPolicyTransaction, percentageToBasisPoints } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useState } from 'react';
type TransferPolicyCap = {policyCapId: string, policyId: string}
function PlaceListButton() {
    const OWNER_ADDRESS = "0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d"
    const rpcUrl = getFullnodeUrl('testnet'); 
    const client = new SuiClient({ url: rpcUrl });
    const [itemType, setItemType] = useState("");
    const [itemId, setItemId] = useState("");
    const [price, setPrice] = useState(0n);
    const kioskClient = new KioskClient({
        client,
        network: Network.TESTNET,
    });
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const take_item = async (itemType: string, itemId: string): Promise<any> => {
    const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
    const heroPolicyCaps = await kioskClient.getOwnedTransferPoliciesByType({
        type: `0xd8921f5ef54dc17694f53183c2458ca416578ec0e264d9065423fc6addbf7d9e::game::Hero`,
        address: OWNER_ADDRESS,
    });
    console.log(heroPolicyCaps)
    const txb = new TransactionBlock();
    const tpTx = new TransferPolicyTransaction({ kioskClient, transactionBlock: txb });
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
    const publisher = '0xe9d969dd826aecff93f57714ef8973b9957a9fef109ce6d793684664e7ca90ea';
    // await tpTx.create({
    //     type: itemType,
    //     publisher,
    // })
    // tpTx.setCap({policyCapId: 'undefined', policyId: 'undefined'} : TransferPolicyCap)
    //     .addLockRule()
    //     .addFloorPriceRule(1000n)
    //     .addRoyaltyRule(percentageToBasisPoints(10), 100)
    //     .addPersonalKioskRule()
    //     .shareAndTransferCap('0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d');
        

    kioskTx
        .placeAndList({
            itemType: itemType,
            item: itemId,
            price: price
        });
        kioskTx.finalize();
        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                chain: 'sui:testnet',
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction block', result);
                },
            })
            return ""
    }
    return  <div>
        item type:
        <input type="text" value={itemType} onChange={(e)=> {
            setItemType(e.target.value);
        }} />
        item id:
         <input type="text" value={itemId} onChange={(e)=> {
            setItemId(e.target.value);
        }} />
        pricce:
         <input type="number" value={`${price}`} onChange={(e)=> {
            setPrice(BigInt(e.target.value));
        }} />
        <button onClick={() => {
            take_item(itemType, itemId)
            .then(res => {
                console.log('called')
            })
        }}>
            Place and List
        </button>
    </div>
}

export default PlaceListButton