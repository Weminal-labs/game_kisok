import clsx from "clsx"
import styles from './SideBar.module.css'
import NftCard from "../NftCard/NftCard"
function SideBar() {
    return <div className={clsx(styles.wrapper)}>
        <div className={clsx()}>
            <span className={clsx(styles.heading)}>MY ASSETS</span>
            <span className={clsx(styles.heading_2)}>Manage your Assets</span>
        </div>
        <div className={clsx(styles.container)}>
            <NftCard />
            <NftCard />
        </div>
    </div>
}

export default SideBar