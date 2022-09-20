import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { useMoralis } from "react-moralis";
import styles from "../styles/ClaimsPage.module.css";

const ClaimsPage = () => {
  const Moralis = useMoralis();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isCryptoTransactionPending, setIsCryptoTransactionPending] =
    useState(false);
  const [isBankTransactionPending, setIsBankTransactionPending] =
    useState(false);

  const toggleDialog = () => {
    setShowDialog((prevState) => !prevState);
  };

  const getClaimPayload = () => {
    return {
      walletId: Moralis.account,
    };
  };

  const onCryptoClaimClick = async () => {
    setIsCryptoTransactionPending(true);
    const payload = JSON.stringify(getClaimPayload());
    const response = await fetch("/api/claim-premium-wallet", {
      method: "POST",
      body: payload,
      headers: {
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setIsCryptoTransactionPending(false);
      console.log(data);
      setShowDialog(true);
      const message =
        `Transfer of ${data.amount} ` +
        `has been initiated to your crypto wallet: ${Moralis.account}.`;
      setDialogMessage(message);
    } else {
      setIsCryptoTransactionPending(false);
      setShowDialog(true);
      const message =
        "Some problem occurred while transferring money to your wallet. Please try again.";
      setDialogMessage(message);
    }
  };

  const onBankClaimClick = async () => {
    setIsBankTransactionPending(true);
    const payload = JSON.stringify(getClaimPayload());
    const response = await fetch("/api/claim-premium-bank-account", {
      method: "POST",
      body: payload,
      headers: {
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      const data = (await response.json()).data;
      console.log(data);
      setIsBankTransactionPending(false);
      setShowDialog(true);
      const message =
        `Transfer of ${data.amount.amount} ${data.amount.currency} ` +
        `has been initiated to your bank account: ${data.destination.name}. ` +
        `The bank account id is ${data.destination.id}`;
      setDialogMessage(message);
    } else {
      setIsBankTransactionPending(false);
      setShowDialog(true);
      const message =
        "Some problem occurred while transferring money to your bank account. Please try again.";
      setDialogMessage(message);
    }
  };

  return (
    <>
      {" "}
      <div className={styles.pageContainer}>
        <h1>Claim your insurance.</h1>
        <div className={styles.buttonContainer}>
          <Button
            className={styles.button}
            color="primary"
            onClick={onCryptoClaimClick}
          >
            {!isCryptoTransactionPending && "Get money in your crypto wallet."}
            {isCryptoTransactionPending && (
              <Spinner className={styles.spinner}>Processing...</Spinner>
            )}
          </Button>
          <Button
            className={styles.button}
            color="primary"
            onClick={onBankClaimClick}
          >
            {!isBankTransactionPending && "Get money in your bank account."}
            {isBankTransactionPending && (
              <Spinner className={styles.spinner}>Processing...</Spinner>
            )}
          </Button>
        </div>
      </div>
      <Modal centered isOpen={showDialog} toggle={toggleDialog}>
        <ModalHeader toggle={toggleDialog}>Info</ModalHeader>
        <ModalBody>{dialogMessage}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleDialog}>
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ClaimsPage;
