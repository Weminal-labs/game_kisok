import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { KioskClient, KioskItem, KioskTransaction, Network } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
type Props = {
    itemId: string,
    itemType: string,
}
function TakeButton({itemId, itemType}: Props) {
    const OWNER_ADDRESS = "0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d"
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
            txb.transferObjects([item], '0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d');
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
    return  <div>
        <button onClick={() => {
            take_item(itemType, itemId)
            .then(res => {
                console.log('called')
            })
        }}>
            Take Item
        </button>
    </div>
}

export default TakeButton