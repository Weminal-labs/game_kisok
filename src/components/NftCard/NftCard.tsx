import clsx from "clsx"
import styles from "./NftCard.module.css"
import { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { get_object, get_objects } from "../../controller/rpc-client";
import ListITemButton from "../ListItemButton";
import Purchase from "../Purchase";
import { useCurrentAccount } from "@mysten/dapp-kit";
import PlaceListButton from "../PlaceListButton";
import PlaceButton from "../placeButton/PlaceButton";
import { OWNER_ADDRESS } from "../../controller/rpc-client";
import TakeButton from "../TakeButton";

type Props = {
    isListing: boolean,
    isPlace: boolean,
    data: any
}

function NftCard({isListing, isPlace, data}: Props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [visible, setVisible] = useState(true)
    const invisible = () => setVisible(false)

    const currentAccount = useCurrentAccount()
    return <>
        

                {visible&&<div className={clsx(styles.wrapper)} onMouseEnter={()=>setShow(true)} onMouseLeave={()=> setShow(false)}>
                    <img className={clsx(styles.image)}  src={data?.fields?.url} />
                    <div className={clsx(styles.contentWrapper)}>
                        <span className={clsx(styles.name)}>{data?.fields?.name}</span>
                        <span className={clsx(styles.description)}>{data?.fields?.description}</span>
                        {isListing&&<span className={clsx(styles.price)}>
                            {data?.price / 1000000000} SUI
                            </span>}
                    </div>
                    {!isPlace&&!isListing&&show&&<div className={clsx(styles.modalWrapper)}>
                        <PlaceButton data={data}>
                            <span className={clsx(styles.optionButton)}>Send to store</span>
                        </PlaceButton>
                        <ListITemButton data={data}>
                            <span className={clsx(styles.optionButton)}>Post for sell</span>
                            
                        </ListITemButton>
                    </div>}

                    {
                    isListing&&show&&currentAccount&&
                    <div className={clsx(styles.btnBuyWrapper)}>
                        <Purchase callback={invisible} itemId={data?.fields.id.id} itemType={data?.type} price={data.price}><button className={clsx(styles.btnBuy)} >Buy</button></Purchase>
                    </div>}

                    {
                    (currentAccount?.address == OWNER_ADDRESS)&&show&&isPlace&&
                    <div className={clsx(styles.btnBuyWrapper)}>
                        <TakeButton itemId={data?.fields.id.id} itemType={data?.type} ><button className={clsx(styles.btnBuy)} >Take</button></TakeButton>
                    </div>}
                </div>}
        

    </>
}

export default NftCard