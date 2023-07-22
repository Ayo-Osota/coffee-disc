import Image from "next/image";
import Link from "next/link";
import styles from "./card.module.css";

const Card = ({ name, imgUrl, href }) => {
    return (
        <Link  href={href}>
            <div className={`${styles.card} p-5 w-fit`}>
                <h2>{name}</h2>
                <Image className="rounded-xl" src={imgUrl} width={260} height={260} alt={name} />
            </div>
        </Link>
    )
}

export default Card;