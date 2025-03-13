import { EventBrite } from "@/app/components/EventBrite";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {

  return (
    <div className={styles.page}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <EventBrite eventId={'1284912922139'} />
    </div>
  );
}
