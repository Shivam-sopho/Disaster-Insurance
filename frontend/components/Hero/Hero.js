import { useRouter } from "next/router";

import CardCTA from "../CardCTA/CardCTA";
import styles from "./Hero.module.css";

const Hero = (props) => {
  const router = useRouter();

  const onBuyPolicyClick = () => {
    router.push("/policy");
  };
  const onClaimsClick = () => {
    router.push("/claims");
  };
  const onPayPremiumClick = () => {
    router.push("/premium");
  };

  return (
    <div className={styles["hero-container"]}>
      <div className={styles["hero-card"]}>
        {" "}
        <CardCTA
          title="Register for Insurance"
          description="Get insurance for damages caused by adverse weather calamities."
          logo="marketplace"
          onClick={onBuyPolicyClick}
        />
      </div>
      <div className={styles["hero-card"]}>
        {" "}
        <CardCTA
          title="Claims"
          description="Claim for damages caused by your registered weather conditions."
          logo="servers"
          onClick={onClaimsClick}
        />
      </div>
      <div className={styles["hero-card"]}>
        {" "}
        <CardCTA
          title="Pay Premium"
          description="Pay the premium for your existing policies."
          logo="chest"
          onClick={onPayPremiumClick}
        />
      </div>
    </div>
  );
};

export default Hero;
