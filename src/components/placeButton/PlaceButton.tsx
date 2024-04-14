import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { KioskClient, KioskTransaction, Network } from "@mysten/kiosk";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { fromHEX } from "@mysten/sui.js/utils";
import { private_key, OWNER_ADDRESS } from "../../controller/rpc-client";
import clsx from "clsx";
type Props = {
    data: any,
    children: React.ReactNode
}

function PlaceButton({data, children}: Props) {
    const rpcUrl = getFullnodeUrl('testnet'); 
    const client = new SuiClient({ url: rpcUrl });
    const currentAccount = useCurrentAccount()
    const kioskClient = new KioskClient({
        client,
        network: Network.TESTNET,
    });

    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const txb = new TransactionBlock();
    let keypair = new Ed25519Keypair();
    keypair = Ed25519Keypair.fromSecretKey(fromHEX(private_key));

    const place_item = async (itemId: string, itemType: string) => {
        const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: currentAccount?.address||""});
        const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
        kioskTx
        .place({
            itemType: itemType,
            item: itemId
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
                onError: (err) => {
                    console.log('err transaction block', err);
                }
            })
    }
    return <span onClick={()=> place_item(data.fields.id.id, data.type)} >
        {children}
    </span>
}

export default PlaceButton