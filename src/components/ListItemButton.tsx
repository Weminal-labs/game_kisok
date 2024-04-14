import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { KioskClient, KioskTransaction, Network } from "@mysten/kiosk";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { fromHEX } from "@mysten/sui.js/utils";
import { OWNER_ADDRESS, private_key } from "../controller/rpc-client";
import clsx from "clsx";
import { useEffect, useState } from "react";
type Props = {
    data: any,
    children: React.ReactNode
}

function ListITemButton({data, children}: Props) {
    const currentAccount = useCurrentAccount()
    const rpcUrl = getFullnodeUrl('testnet'); 
    const client = new SuiClient({ url: rpcUrl });
    const [enable, setEnable] = useState(false)
    const [digest, setDigest] = useState("")
    const [popup, setPopup] = useState(false)
    const [price, setPrice] = useState(0n)

    const kioskClient = new KioskClient({
        client,
        network: Network.TESTNET,
    });
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const txb = new TransactionBlock();
    let keypair = new Ed25519Keypair();


    keypair = Ed25519Keypair.fromSecretKey(fromHEX(private_key));
    //send to owner
    const send_item = async (itemId: string, itemType: string, price: bigint): Promise<any> => {
        txb.transferObjects([txb.object(itemId)], OWNER_ADDRESS);
        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                chain: 'sui:testnet',
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction block', result);
                    setEnable(true);
                },
                onError: (err) => {
                    setEnable(false);
                    console.log('err transaction block', err);
                }
            })
            setTimeout(()=>list_item(data.fields.id.id, data.type, price), 10000);
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
        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                chain: 'sui:testnet',
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction block', result);
                    setEnable(true);
                },
                onError: (err) => {
                    setEnable(false);
                    console.log('err transaction block', err);
                }
            })
    }
    return <span onClick={()=> setPopup(true)} >
        {children}
        {popup&&<div className={clsx()}>
            <input type="number" value={`${price}`} onChange={(e)=> {
                setPrice(BigInt(e.target.value));
            }} />
            <button onClick={() => {
                list_item(data.fields.id.id, data.type, price)
        }}>Ok</button>
        </div>}
    </span>
}

export default ListITemButton