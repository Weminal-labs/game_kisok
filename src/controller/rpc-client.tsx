
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { KioskClient, KioskItem, KioskTransaction, Network } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { fromHEX } from '@mysten/sui.js/utils';


const OWNER_ADDRESS = "0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d"
const ITEM_TYPE = "0x4f8a43ebdbce05b2fb2afc3918fa1d5a096193f758fafaa275e71161ccafa587::game::Hero"
const Ticket_type = "0xe65c1061ebe6d0fe91619d5968d8a5d6fb192314de824cad5cd05becbd70403f::event::Ticket"
const private_key = "e9dba25e2c1999461f8cf27cf137d4218c9bc1fb425ea7c36a19b92cec0efe3b"
const rpcUrl = getFullnodeUrl('testnet'); 
const client = new SuiClient({ url: rpcUrl });

//sign 

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

export const place_item = async (): Promise<any> => {

    const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
    kioskTx
        .place({
            itemType: Ticket_type,
            item: '0x8ec94f051b5e288f3ae979782b51dbba7fc15b864fd7d5c96004a5837bd98b7a',
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
    return res.items;
}

export const get_object = async (id: string): Promise<any> => {
    const txn = await client.getObject({
        id,
        // fetch the object content field
        options: { showContent: true },
    });
    console.log(txn)
    return txn.data?.content

}

export const list_item = async (itemId: string, itemType: string): Promise<any> => {
    const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
    kioskTx
        .list({
            itemType: itemType,
            itemId: itemId,
            price: BigInt(1000000000)
        });
        kioskTx.finalize();
       let result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb});
        return result
}

export const delist_item = async (itemId: string, itemType: string): Promise<any> => {
    console.log(`item === ${itemType} ${itemId}`)

    const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
    kioskTx
        .delist({
            itemType: itemType,
            itemId: itemId,
        });
        kioskTx.finalize();
       let result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb});
        return result;
}

// export const take_item = async (itemType: string, itemId: string): Promise<any> => {
//     const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
//     const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
//     const txb = new TransactionBlock();
//     console.log(itemType, itemId)
//     const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
//     const item = kioskTx
//         .take({
//             itemType: itemType,
//             itemId: itemId,
//         });
//         txb.transferObjects([item], '0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d');
//         kioskTx.finalize();
//         signAndExecuteTransactionBlock(
//             {
//                 transactionBlock: txb,
//                 chain: 'sui:testnet',
//             },
//             {
//                 onSuccess: (result) => {
//                     console.log('executed transaction block', result);
//                 },
//             })
//     //    let result = await client.signAndExecuteTransactionBlock({
//     //     signer: keypair,
//     //     transactionBlock: txb});
//     //     return result;
// }

//kiosk -> list objectID -> backend -> object data