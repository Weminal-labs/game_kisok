import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { KioskClient, KioskItem, KioskTransaction, Network, TransferPolicyTransaction, percentageToBasisPoints } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { fromHEX } from '@mysten/sui.js/utils';
import { OWNER_ADDRESS, PRIVATE_KEY, CHAIN, client , KIOSK_INDEX} from '../data/initData';
type ItemProps = {
    itemType: string,
    itemId: string,
    price: bigint,
    children: React.ReactNode,
    callback: ()=> void
}

function Purchase({itemType,itemId,price, children, callback}: ItemProps) {
    const currentAccount = useCurrentAccount()
    console.log(itemType,itemId,price)
    let keypair = new Ed25519Keypair();
    keypair = Ed25519Keypair.fromSecretKey(fromHEX(PRIVATE_KEY));
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const txb = new TransactionBlock();
    const purchase_item = async (itemType: string, itemId: string, price: bigint): Promise<any> => {
        const [coin] = txb.splitCoins(txb.gas, [price]);
        txb.transferObjects([coin], OWNER_ADDRESS) 
        signAndExecuteTransactionBlock(
        {
            transactionBlock: txb,
            chain: CHAIN,
        },
        {
            onSuccess: (result) => {
                console.log('executed transaction block', result);
            },
        })
    }
    const send_item = async () => {

        const kioskClient = new KioskClient({
            client,
            network: Network.TESTNET,
        });
        const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
        const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[KIOSK_INDEX] });
        kioskTx
        .transfer({
            itemId: itemId,
            itemType,
            address: currentAccount?.address||'',
        })
        .finalize();
        let result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: txb});
            console.log(result);
    }
        const innerDivStyle = {
            width: '64px',
            height: '32px'
        };
    return  <div style={innerDivStyle}  onClick={() => {
                purchase_item(itemType, itemId, price)
                .then(res => {
                    console.log(res)
                    send_item().then(res => {
                        console.log(res)
                        callback()
                    })
                })
            }}>
            {children}
        </div>
}

export default Purchase
