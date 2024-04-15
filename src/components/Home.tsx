import { useEffect, useState } from 'react'
import { 
    ConnectButton, 
    useAutoConnectWallet,
    useCurrentAccount, 

} from '@mysten/dapp-kit';
import { 
  create_kisok, 
  get_kiosk_items, 
  get_object, 
  list_item, 
  delist_item,
  get_objects,
} from './../controller/rpc-client'
import './../App.css'
import SideBar from './sidebar/SideBar';
import NftCard from './NftCard/NftCard';
import reloadIcon from './../assets/reload.png'
function Home() {
  const [placeItems, setPlaceItems] = useState<any[]>([])
  const [listItems, setListItems] = useState<any[]>([])
  const [itemTypes, setItemTypes] = useState("")
  const [itemId, setItemId] = useState("")  
  const [show, setShow] = useState (false)
  const [userItems, setUserItems] = useState<any>([])
  
  //sign
  const currentAccount = useCurrentAccount();
  const [reload, setReload]  = useState(false)
  useEffect(() => { 
    handle_data()
    load_user_assets()
  return () => {
    setUserItems([])
  }
    }, [currentAccount, reload])
   
  //sign


  const load_user_assets = () => {
    if(currentAccount) {
      get_objects(currentAccount?.address||"")
      .then((res: {
        array: any; data: any[] 
      }) => {
        res.data.forEach((element: any) => {
          get_object(element.data.objectId)
          .then((obj_data) => {
            let typeStr = obj_data?.type+""
            if(typeStr.split("::")[2] == 'Hero'){
              setUserItems((prev: any) => [...prev, obj_data])
            }
          })
        });
        res.array.forEach((element: any) => {
          get_object(element.data.objectId).then(obj => console.log(obj))
        });
      })
    }
  }
  const handle_data = () =>{
    setPlaceItems([])
    setListItems([])
    get_kiosk_items()
        .then(res => {
        let list_data = res.map(item => {
            get_object(`${item?.objectId}`)
            .then(obj => {
              let typeStr = obj?.type+""
            if(typeStr.split("::")[2] == 'Hero') {
              if(item.listing) {
                  let new_obj = obj
                  obj.price = item.listing.price
                  setListItems(prev => [...prev, new_obj])
                }else {
                  setPlaceItems(prev => [...prev, obj])
              }
            }
            })
        })
        }
    )
  }
  const handle_delist = () => {
    delist_item(itemId, itemTypes)
    .then(res => {
      handle_data()
    })
  }
  const handle_list = () => {
    list_item(itemId, itemTypes)
    .then(res => {
      handle_data()
    })
  }
  const autoConnectionStatus = useAutoConnectWallet();
  return (
        <div className='wrapper'>
          <span className='heading' >
            <span className='headingTitle'>WECASTLE</span>
            <ConnectButton /></span>
          <div className='f_1'> 
          <div className='titleField'>
            <span className='label'>Place</span>
            <div className='btnReload' onClick={() => setReload(!reload)}><img className='imgReload' src={reloadIcon} alt="" /></div>
          </div>
          <div className='place_wrapper'>
            {placeItems.map(item =>{return <NftCard data={item} isListing={false} isPlace={true} />
            })}
          </div>
                
          <span className='label'>List for sell</span>
          <div className='place_wrapper'>
            {listItems.map(item =>{
              return <NftCard data={item} isListing={true} isPlace={false} />
            })}
          </div>


          {/* <div>auto connect status: {autoConnectionStatus}</div> */}
       </div>
         {<div className='sidebar_wrapper' onMouseEnter={()=>setShow(true)} onMouseLeave={()=> setShow(false)}>
            {!show&&<span className='sidebar_switch'></span>}
              { show&&<SideBar data={userItems}/>}
          </div>}
       </div>

  )
}

export default Home
