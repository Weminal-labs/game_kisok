import {
	ConnectButton,
	useCurrentAccount,
	useCurrentWallet,
	useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useState } from 'react';
import './../App.css'
import { KioskClient, KioskTransaction, Network } from '@mysten/kiosk';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { get_kiosk_items, get_object, list_item } from '../controller/rpc-client';
 
function Footer() {
	const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
	const [digest, setDigest] = useState('');
	const currentAccount = useCurrentAccount();

    const [placeItems, setPlaceItems] = useState<any[]>([])
  const [listItems, setListItems] = useState<any[]>([])
  //sign

  const rpcUrl = getFullnodeUrl('testnet'); 
  const client = new SuiClient({ url: rpcUrl });
  const kioskClient = new KioskClient({
      client,
      network: Network.TESTNET,
  });

  const OWNER_ADDRESS = "0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d"
  const ITEM_TYPE = "0x4f8a43ebdbce05b2fb2afc3918fa1d5a096193f758fafaa275e71161ccafa587::game::Hero"
  const { currentWallet, connectionStatus } = useCurrentWallet();
  console.log(currentWallet)
  console.log(currentAccount)
  const delist_item = async (itemId: string) => {
      const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address: OWNER_ADDRESS});
      const txb = new TransactionBlock();
      const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskOwnerCaps[0] });
      kioskTx
          .delist({
              itemType: ITEM_TYPE,
              itemId: itemId,
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
                setDigest(result.digest);
            },
        })
  }


  //sign
 
	return (
		<div className='dv' style={{ padding: 20}}>
			{currentAccount && (
				<>
					<div>
						<span>Version: 1.0</span>
					</div>
				</>
			)}
		</div>
	);
}
export default Footer