import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { KioskClient, KioskTransaction, Network } from "@mysten/kiosk";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { fromHEX } from "@mysten/sui.js/utils";
type Props = {
    itemId: string,
    itemType: string,
    price: bigint
}
const OWNER_ADDRESS = "0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d"

function ListITemButton({itemId, itemType, price}: Props) {
    const rpcUrl = getFullnodeUrl('testnet'); 
    const client = new SuiClient({ url: rpcUrl });
    const kioskClient = new KioskClient({
        client,
        network: Network.TESTNET,
    });
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const txb = new TransactionBlock();
    
    const private_key = "e9dba25e2c1999461f8cf27cf137d4218c9bc1fb425ea7c36a19b92cec0efe3b"
    let keypair = new Ed25519Keypair();
    const currentAccount = useCurrentAccount();
    keypair = Ed25519Keypair.fromSecretKey(fromHEX(private_key));
    //send to owner
    const send_item = async (itemId: string): Promise<any> => {
        console.log(itemId);
        txb.transferObjects([txb.object(itemId)], OWNER_ADDRESS);
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

    const list_item = async (itemId: string, itemType: string, price: bigint) => {
        const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
        const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
        kioskTx
        .placeAndList({
            itemType: itemType,
            item: itemId,
            price: price
        });
        kioskTx.finalize();
       let result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb});
        return result
    }
    return <button 
    onClick={() => {
        send_item(itemId)
        .then(res => {
            list_item(itemId, itemType, price)
        })
    }}>
        List item for sell
    </button>
}

export default ListITemButton