import clsx from "clsx"
import styles from './SideBar.module.css'
import NftCard from "../NftCard/NftCard"
import { useEffect } from "react"
import { get_object, get_objects } from "../../controller/rpc-client"
import ListITemButton from "../ListItemButton"
function SideBar(data: any) {
    console.log(data)
    return <div className={clsx(styles.wrapper)}>
        <div className={clsx()}>
            <span className={clsx(styles.heading)}>MY ASSETS</span>
            <span className={clsx(styles.heading_2)}>Manage your Assets</span>
        </div>
        <div className={clsx(styles.container)}>
            {data.data.map((item: any) => {
                return  <NftCard isListing={false} isPlace={false}  data={item}/>
            })}
        </div>
    </div>
}

export default SideBar