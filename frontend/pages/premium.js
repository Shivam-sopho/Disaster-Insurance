import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  FormGroup,
  Input,
  Spinner,
} from "reactstrap";
import { useMoralis } from "react-moralis";
import styles from "../styles/PremiumPaymentPage.module.css";
import { erc20ABI } from "../constants";

const USDC_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

const PremiumPaymentPage = () => {
  const Moralis = useMoralis();

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [name, setName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [isCryptoTransactionPending, setIsCryptoTransactionPending] =
    useState(false);
  const [isCardTransactionPending, setIsCardTransactionPending] =
    useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const toggleDialog = () => {
    setShowDialog((prevState) => !prevState);
  };
  const toggleCardDialog = () => {
    setShowCardDialog((prevState) => !prevState);
  };

  const getCryptoPayload = () => {
    return {
      walletId: Moralis.account,
    };
  };

  const getAmount = () => {
    const amount = 50;
    return amount;
  };

  const getCardPayload = async () => {
    let [expMonth, expYear] = expiry.split("/");

    const amountPayload = JSON.stringify({
      walletId: Moralis.account,
    });
    const amountResponse = await fetch("/api/getpremium", {
      method: "POST",
      body: amountPayload,
      headers: {
        "Content-type": "application/json",
      },
    });

    const premiumAmount = (await amountResponse.json()).amount;

    const payload = {
      walletId: Moralis.account.toString(),
      cardNumber,
      CVV: +cvv,
      billingDetails: {
        name,
        city,
        country,
        line1: addressLine1,
        postalCode,
        district,
      },
      metadata: {
        email,
        sessionId: "DE6FA86F60BB47B379307F851E238617",
        ipAddress: "244.28.239.130",
      },
      expMonth: +expMonth,
      expYear: +expYear,
      amount: {
        amount: +premiumAmount,
        currency: "USD",
      },
    };

    return payload;
  };

  const preFillCardData = () => {
    setCardNumber("4007400000000007");
    setCvv("123");
    setExpiry("01/2025");
    setName("Test Customer");
    setAddressLine1("Test Street");
    setPostalCode("123456");
    setCity("Test City");
    setDistrict("MA");
    setCountry("US");
    setEmail("customer-0001@circle.com");
  };

  const onCryptoPayClick = async () => {
    setIsCryptoTransactionPending(true);
    const payload = JSON.stringify(getCryptoPayload());
    const response = await fetch("/api/pay-premium-by-wallet", {
      method: "POST",
      body: payload,
      headers: {
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      const data = (await response.json()).data;
      const paymentAddress = data.address;
      const premiumAmount = data.premiumAmount;
      console.log(paymentAddress, premiumAmount);

      const options = {
        type: "erc20",
        amount: Moralis.Moralis.Units.Token(premiumAmount, "6"),
        receiver: paymentAddress,
        contractAddress: USDC_ADDRESS,
      };

      const transaction = await Moralis.Moralis.transfer(options);
      const result = await transaction.wait();
      setIsCryptoTransactionPending(false);

      console.log(result);
      if (result) {
        setDialogMessage(
          `Premium amount of ${premiumAmount} USDC paid to ${paymentAddress}.`
        );
        setShowDialog(true);
      } else {
        setDialogMessage("Failed to pay premium using USDC. Please try again.");
        setShowDialog(true);
      }
    }
  };

  const onCardPayClick = () => {
    toggleCardDialog();
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setShowCardDialog(false);
    setIsCardTransactionPending(true);
    const payload = JSON.stringify(getCardPayload());
    
    const response = await fetch("/api/pay-premium-emi", {
      method: "POST",
      body: payload,
      headers: {
        "Content-type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      setIsCardTransactionPending(false);
      setShowDialog(true);
      setDialogMessage(
        data.message ||
          "Your payment is successful. The amount will be deducted as per the schedule."
      );
    } else {
      setIsCardTransactionPending(false);
      setShowDialog(true);
      setDialogMessage(
        "There was some error with the payment. Please try again later."
      );
    }
  };

  const cardPaymentBody = (
    <>
      <div className={styles.modalContainer}>
        <div className={styles.formContainer}>
          <Form onSubmit={submitHandler}>
            <h3>Card Details</h3>
            <FormGroup>
              <Input
                type="tel"
                autoComplete="cc-number"
                id="cardNumber"
                pattern="[0-9]{4}\s*[0-9]{4}\s*[0-9]{4}\s*[0-9]{4}"
                title="Must be a valid 16-digit credit card number."
                placeholder="Card Number"
                onChange={(e) => {
                  setCardNumber(e.target.value);
                }}
                value={cardNumber}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                autoComplete="cc-csc"
                id="cvv"
                pattern="[0-9]{3}"
                placeholder="CVV"
                title="Must be a 3-digit CVV number"
                onChange={(e) => {
                  setCvv(e.target.value);
                }}
                value={cvv}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="tel"
                autoComplete="cc-exp"
                id="expiry"
                title="MM/YYYY"
                placeholder="MM/YYYY"
                onChange={(e) => {
                  setExpiry(e.target.value);
                }}
                value={expiry}
              ></Input>
            </FormGroup>
            <h3>Billing Details</h3>
            <FormGroup>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                id="addressLine1"
                placeholder="Address Line 1"
                onChange={(e) => {
                  setAddressLine1(e.target.value);
                }}
                value={addressLine1}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                id="postalCode"
                placeholder="Postal Code"
                onChange={(e) => {
                  setPostalCode(e.target.value);
                }}
                value={postalCode}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                id="city"
                placeholder="City"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                value={city}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                id="district"
                placeholder="District"
                onChange={(e) => {
                  setDistrict(e.target.value);
                }}
                value={district}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="select"
                id="country"
                name="country"
                onChange={(e) => setCountry(e.target.value)}
                value={country}
              >
                <option>Country</option>
                <option value="AF">Afghanistan</option>
                <option value="AX">Aland Islands</option>
                <option value="AL">Albania</option>
                <option value="DZ">Algeria</option>
                <option value="AS">American Samoa</option>
                <option value="AD">Andorra</option>
                <option value="AO">Angola</option>
                <option value="AI">Anguilla</option>
                <option value="AQ">Antarctica</option>
                <option value="AG">Antigua and Barbuda</option>
                <option value="AR">Argentina</option>
                <option value="AM">Armenia</option>
                <option value="AW">Aruba</option>
                <option value="AU">Australia</option>
                <option value="AT">Austria</option>
                <option value="AZ">Azerbaijan</option>
                <option value="BS">Bahamas</option>
                <option value="BH">Bahrain</option>
                <option value="BD">Bangladesh</option>
                <option value="BB">Barbados</option>
                <option value="BY">Belarus</option>
                <option value="BE">Belgium</option>
                <option value="BZ">Belize</option>
                <option value="BJ">Benin</option>
                <option value="BM">Bermuda</option>
                <option value="BT">Bhutan</option>
                <option value="BO">Bolivia</option>
                <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                <option value="BA">Bosnia and Herzegovina</option>
                <option value="BW">Botswana</option>
                <option value="BV">Bouvet Island</option>
                <option value="BR">Brazil</option>
                <option value="IO">British Indian Ocean Territory</option>
                <option value="BN">Brunei Darussalam</option>
                <option value="BG">Bulgaria</option>
                <option value="BF">Burkina Faso</option>
                <option value="BI">Burundi</option>
                <option value="KH">Cambodia</option>
                <option value="CM">Cameroon</option>
                <option value="CA">Canada</option>
                <option value="CV">Cape Verde</option>
                <option value="KY">Cayman Islands</option>
                <option value="CF">Central African Republic</option>
                <option value="TD">Chad</option>
                <option value="CL">Chile</option>
                <option value="CN">China</option>
                <option value="CX">Christmas Island</option>
                <option value="CC">Cocos (Keeling) Islands</option>
                <option value="CO">Colombia</option>
                <option value="KM">Comoros</option>
                <option value="CG">Congo</option>
                <option value="CD">
                  Congo, Democratic Republic of the Congo
                </option>
                <option value="CK">Cook Islands</option>
                <option value="CR">Costa Rica</option>
                <option value="CI">Cote DIvoire</option>
                <option value="HR">Croatia</option>
                <option value="CU">Cuba</option>
                <option value="CW">Curacao</option>
                <option value="CY">Cyprus</option>
                <option value="CZ">Czech Republic</option>
                <option value="DK">Denmark</option>
                <option value="DJ">Djibouti</option>
                <option value="DM">Dominica</option>
                <option value="DO">Dominican Republic</option>
                <option value="EC">Ecuador</option>
                <option value="EG">Egypt</option>
                <option value="SV">El Salvador</option>
                <option value="GQ">Equatorial Guinea</option>
                <option value="ER">Eritrea</option>
                <option value="EE">Estonia</option>
                <option value="ET">Ethiopia</option>
                <option value="FK">Falkland Islands (Malvinas)</option>
                <option value="FO">Faroe Islands</option>
                <option value="FJ">Fiji</option>
                <option value="FI">Finland</option>
                <option value="FR">France</option>
                <option value="GF">French Guiana</option>
                <option value="PF">French Polynesia</option>
                <option value="TF">French Southern Territories</option>
                <option value="GA">Gabon</option>
                <option value="GM">Gambia</option>
                <option value="GE">Georgia</option>
                <option value="DE">Germany</option>
                <option value="GH">Ghana</option>
                <option value="GI">Gibraltar</option>
                <option value="GR">Greece</option>
                <option value="GL">Greenland</option>
                <option value="GD">Grenada</option>
                <option value="GP">Guadeloupe</option>
                <option value="GU">Guam</option>
                <option value="GT">Guatemala</option>
                <option value="GG">Guernsey</option>
                <option value="GN">Guinea</option>
                <option value="GW">Guinea-Bissau</option>
                <option value="GY">Guyana</option>
                <option value="HT">Haiti</option>
                <option value="HM">Heard Island and Mcdonald Islands</option>
                <option value="VA">Holy See (Vatican City State)</option>
                <option value="HN">Honduras</option>
                <option value="HK">Hong Kong</option>
                <option value="HU">Hungary</option>
                <option value="IS">Iceland</option>
                <option value="IN">India</option>
                <option value="ID">Indonesia</option>
                <option value="IR">Iran, Islamic Republic of</option>
                <option value="IQ">Iraq</option>
                <option value="IE">Ireland</option>
                <option value="IM">Isle of Man</option>
                <option value="IL">Israel</option>
                <option value="IT">Italy</option>
                <option value="JM">Jamaica</option>
                <option value="JP">Japan</option>
                <option value="JE">Jersey</option>
                <option value="JO">Jordan</option>
                <option value="KZ">Kazakhstan</option>
                <option value="KE">Kenya</option>
                <option value="KI">Kiribati</option>
                <option value="KP">
                  Korea, Democratic Peoples Republic of
                </option>
                <option value="KR">Korea, Republic of</option>
                <option value="XK">Kosovo</option>
                <option value="KW">Kuwait</option>
                <option value="KG">Kyrgyzstan</option>
                <option value="LA">Lao Peoples Democratic Republic</option>
                <option value="LV">Latvia</option>
                <option value="LB">Lebanon</option>
                <option value="LS">Lesotho</option>
                <option value="LR">Liberia</option>
                <option value="LY">Libyan Arab Jamahiriya</option>
                <option value="LI">Liechtenstein</option>
                <option value="LT">Lithuania</option>
                <option value="LU">Luxembourg</option>
                <option value="MO">Macao</option>
                <option value="MK">
                  Macedonia, the Former Yugoslav Republic of
                </option>
                <option value="MG">Madagascar</option>
                <option value="MW">Malawi</option>
                <option value="MY">Malaysia</option>
                <option value="MV">Maldives</option>
                <option value="ML">Mali</option>
                <option value="MT">Malta</option>
                <option value="MH">Marshall Islands</option>
                <option value="MQ">Martinique</option>
                <option value="MR">Mauritania</option>
                <option value="MU">Mauritius</option>
                <option value="YT">Mayotte</option>
                <option value="MX">Mexico</option>
                <option value="FM">Micronesia, Federated States of</option>
                <option value="MD">Moldova, Republic of</option>
                <option value="MC">Monaco</option>
                <option value="MN">Mongolia</option>
                <option value="ME">Montenegro</option>
                <option value="MS">Montserrat</option>
                <option value="MA">Morocco</option>
                <option value="MZ">Mozambique</option>
                <option value="MM">Myanmar</option>
                <option value="NA">Namibia</option>
                <option value="NR">Nauru</option>
                <option value="NP">Nepal</option>
                <option value="NL">Netherlands</option>
                <option value="AN">Netherlands Antilles</option>
                <option value="NC">New Caledonia</option>
                <option value="NZ">New Zealand</option>
                <option value="NI">Nicaragua</option>
                <option value="NE">Niger</option>
                <option value="NG">Nigeria</option>
                <option value="NU">Niue</option>
                <option value="NF">Norfolk Island</option>
                <option value="MP">Northern Mariana Islands</option>
                <option value="NO">Norway</option>
                <option value="OM">Oman</option>
                <option value="PK">Pakistan</option>
                <option value="PW">Palau</option>
                <option value="PS">Palestinian Territory, Occupied</option>
                <option value="PA">Panama</option>
                <option value="PG">Papua New Guinea</option>
                <option value="PY">Paraguay</option>
                <option value="PE">Peru</option>
                <option value="PH">Philippines</option>
                <option value="PN">Pitcairn</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="PR">Puerto Rico</option>
                <option value="QA">Qatar</option>
                <option value="RE">Reunion</option>
                <option value="RO">Romania</option>
                <option value="RU">Russian Federation</option>
                <option value="RW">Rwanda</option>
                <option value="BL">Saint Barthelemy</option>
                <option value="SH">Saint Helena</option>
                <option value="KN">Saint Kitts and Nevis</option>
                <option value="LC">Saint Lucia</option>
                <option value="MF">Saint Martin</option>
                <option value="PM">Saint Pierre and Miquelon</option>
                <option value="VC">Saint Vincent and the Grenadines</option>
                <option value="WS">Samoa</option>
                <option value="SM">San Marino</option>
                <option value="ST">Sao Tome and Principe</option>
                <option value="SA">Saudi Arabia</option>
                <option value="SN">Senegal</option>
                <option value="RS">Serbia</option>
                <option value="CS">Serbia and Montenegro</option>
                <option value="SC">Seychelles</option>
                <option value="SL">Sierra Leone</option>
                <option value="SG">Singapore</option>
                <option value="SX">Sint Maarten</option>
                <option value="SK">Slovakia</option>
                <option value="SI">Slovenia</option>
                <option value="SB">Solomon Islands</option>
                <option value="SO">Somalia</option>
                <option value="ZA">South Africa</option>
                <option value="GS">
                  South Georgia and the South Sandwich Islands
                </option>
                <option value="SS">South Sudan</option>
                <option value="ES">Spain</option>
                <option value="LK">Sri Lanka</option>
                <option value="SD">Sudan</option>
                <option value="SR">Suriname</option>
                <option value="SJ">Svalbard and Jan Mayen</option>
                <option value="SZ">Swaziland</option>
                <option value="SE">Sweden</option>
                <option value="CH">Switzerland</option>
                <option value="SY">Syrian Arab Republic</option>
                <option value="TW">Taiwan, Province of China</option>
                <option value="TJ">Tajikistan</option>
                <option value="TZ">Tanzania, United Republic of</option>
                <option value="TH">Thailand</option>
                <option value="TL">Timor-Leste</option>
                <option value="TG">Togo</option>
                <option value="TK">Tokelau</option>
                <option value="TO">Tonga</option>
                <option value="TT">Trinidad and Tobago</option>
                <option value="TN">Tunisia</option>
                <option value="TR">Turkey</option>
                <option value="TM">Turkmenistan</option>
                <option value="TC">Turks and Caicos Islands</option>
                <option value="TV">Tuvalu</option>
                <option value="UG">Uganda</option>
                <option value="UA">Ukraine</option>
                <option value="AE">United Arab Emirates</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="UM">United States Minor Outlying Islands</option>
                <option value="UY">Uruguay</option>
                <option value="UZ">Uzbekistan</option>
                <option value="VU">Vanuatu</option>
                <option value="VE">Venezuela</option>
                <option value="VN">Viet Nam</option>
                <option value="VG">Virgin Islands, British</option>
                <option value="VI">Virgin Islands, U.s.</option>
                <option value="WF">Wallis and Futuna</option>
                <option value="EH">Western Sahara</option>
                <option value="YE">Yemen</option>
                <option value="ZM">Zambia</option>
                <option value="ZW">Zimbabwe</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email"
              ></Input>
            </FormGroup>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </Form>
        </div>
        <div className="mt-12 ml-20">
          <Button color="primary" onClick={preFillCardData}>
            Pre-Fill Data
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {" "}
      <div className={styles.pageContainer}>
        <h1>Pay Premium for your policy</h1>
        <div className={styles.buttonContainer}>
          <Button
            className={styles.button}
            color="primary"
            onClick={onCryptoPayClick}
          >
            {!isCryptoTransactionPending && "Pay with USDC using crypto wallet"}
            {isCryptoTransactionPending && (
              <Spinner className={styles.spinner}>Processing...</Spinner>
            )}
          </Button>
          <Button
            className={styles.button}
            color="primary"
            onClick={onCardPayClick}
          >
            {!isCardTransactionPending && "Pay with Credit Card on EMI"}
            {isCardTransactionPending && (
              <Spinner className={styles.spinner}>Processing...</Spinner>
            )}
          </Button>
        </div>
      </div>
      <Modal centered isOpen={showCardDialog} toggle={toggleCardDialog}>
        <ModalHeader toggle={toggleCardDialog}>Enter Card Details</ModalHeader>
        <ModalBody>{cardPaymentBody}</ModalBody>
      </Modal>
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

export default PremiumPaymentPage;
