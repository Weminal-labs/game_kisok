import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { KioskClient, KioskItem, KioskTransaction, Network } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { OWNER_ADDRESS } from '../controller/rpc-client';
type Props = {
    itemId: string,
    itemType: string,
    children: React.ReactNode
}
function TakeButton({itemId, itemType, children}: Props) {
    const currentAccount = useCurrentAccount()
    const rpcUrl = getFullnodeUrl('testnet'); 
    const client = new SuiClient({ url: rpcUrl });
    const kioskClient = new KioskClient({
        client,
        network: Network.TESTNET,
    });
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const take_item = async (itemType: string, itemId: string): Promise<any> => {
        const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
        const txb = new TransactionBlock();
        const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
        const item = kioskTx
            .take({
                itemType: itemType,
                itemId: itemId,
            });
            txb.transferObjects([item], currentAccount?.address||'0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d');
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
    }
    return <>
    <div onClick={() => {
            take_item(itemType, itemId)
            .then(res => {
                console.log('called')
            })
        }}>
            {children}
        </div>
        </>
        
}

export default TakeButton