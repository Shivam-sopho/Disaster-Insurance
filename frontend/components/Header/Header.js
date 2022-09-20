import { ConnectButton } from "@web3uikit/web3";
import styles from "./Header.module.css";
import { useRouter } from "next/router";

const Header = (props) => {
  const router = useRouter();

  const onHeaderClick = () => {
    router.push("/");
  };

  return (
    <div className={styles["header-container"]}>
      <h1 className={styles["header-title"]} onClick={onHeaderClick}>
        {props.title}
      </h1>
      <div className={styles["header-connect-button"]}>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
