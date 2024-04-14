import clsx from "clsx"
import styles from "./NftCard.module.css"
import { useState, useRef } from 'react';
import Popover from 'react-bootstrap/Popover';


function NftCard() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const target = useRef(null);
    return <>
        

        <div className={clsx(styles.wrapper)} onMouseEnter={()=>setShow(true)} onMouseLeave={()=> setShow(false)}>
                    <img className={clsx(styles.image)}  src="https://yt3.googleusercontent.com/-gvwn8PayGixeE5lqoTTCzaUpF162UFCW2ihLPmuksC03LvN6iTzFYcskWROCykiB0u5D3Kd=s900-c-k-c0x00ffffff-no-rj" />
                    <div className={clsx(styles.contentWrapper)}>
                    <span className={clsx(styles.name)}>NAME</span>
                    <span className={clsx(styles.description)}>description</span>
                </div>
                {show&&<div className={clsx(styles.modalWrapper)}>
                    <span className={clsx(styles.optionButton)}>Send to store</span>
                    <span className={clsx(styles.optionButton)}>Post for sell</span>
                </div>}
        </div>
        

    </>
}


export default NftCard