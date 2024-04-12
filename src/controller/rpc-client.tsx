
import { KioskClient, KioskItem, KioskTransaction, Network } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { fromHEX } from '@mysten/sui.js/utils';


const OWNER_ADDRESS = "0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d"
const ITEM_TYPE = "0x4f8a43ebdbce05b2fb2afc3918fa1d5a096193f758fafaa275e71161ccafa587::game::Hero"
const private_key = "e9dba25e2c1999461f8cf27cf137d4218c9bc1fb425ea7c36a19b92cec0efe3b"
const rpcUrl = getFullnodeUrl('testnet');
const client = new SuiClient({ url: rpcUrl });

let keypair = new Ed25519Keypair();
keypair = Ed25519Keypair.fromSecretKey(fromHEX(private_key));

const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
});
export const create_kisok = async () => {



    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient });
    kioskTx.create();
    // kioskTx.place({
    //     itemType: "",
    //     item: ""
    // })
    kioskTx.shareAndTransferCap(OWNER_ADDRESS);
    // Always called as our last kioskTx interaction.
    kioskTx.finalize();
    
    // Sign and execute transaction block.
    let result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb});
        console.log(result);
}

export const get_owner_key_cap = async () => {

    const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
    kioskTx
        .place({
            itemType: ITEM_TYPE,
            item: '0x427b2b591d1bfaed99d50981de248bb6819391d7b399177700e8ed7cc09786dd',
        });
        kioskTx.finalize();
       let result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb});
        // console.log(kioskTx);
}

export const get_kiosk_items = async (): Promise<KioskItem[]> => {
    const kiosk = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
    const kiosk_id = kiosk.kioskIds[0]
    const res = await kioskClient.getKiosk({
        id: kiosk_id,
        options: {
            withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
            withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
        }
    });
    console.log(res.items);
    return res.items;
}

export const get_object = async (id: string): Promise<any> => {
    const txn = await client.getObject({
        id,
        // fetch the object content field
        options: { showContent: true },
    });
    return txn.data?.content

}

export const list_item = async (itemId: string): Promise<any> => {
    const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
    kioskTx
        .list({
            itemType: ITEM_TYPE,
            itemId: itemId,
            price: BigInt(1000000000)
        });
        kioskTx.finalize();
       let result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb});
        return result
}

export const delist_item = async (itemId: string): Promise<any> => {
    const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
    kioskTx
        .delist({
            itemType: ITEM_TYPE,
            itemId: itemId,
        });
        kioskTx.finalize();
       let result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb});
        return result;
}
//kiosk -> list objectID -> backend -> object data