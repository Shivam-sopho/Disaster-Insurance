import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

import styles from "../styles/PolicyPage.module.css";

const PolicyPage = () => {
  const Moralis = useMoralis();

  const DISASTERS = [
    "Flood",
    "Earthquake",
    "Fire",
    "Cyclone",
    "Tsunami",
    "Landslide",
    "Drought",
    "Storm",
    "Tornado",
    "Volcano",
    "Widlfire",
  ];

  const [premiumAmount, setPremiumAmount] = useState(50);
  const [policyType, setPolicyType] = useState("basic");
  const [maxSumInsured, setMaxSumInsured] = useState(1000);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [disasterType, setDisasterType] = useState("flood");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [name, setName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [country, setCountry] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const toggleDialog = () => {
    setShowDialog((prevState) => !prevState);
  };

  const onSelectPolicyType = (e) => {
    const policyType = e.target.value;
    if (policyType === "basic") {
      setPremiumAmount(50);
      setMaxSumInsured(1000);
    } else if (policyType === "premium") {
      setPremiumAmount(100);
      setMaxSumInsured(2000);
    }
    setPolicyType(policyType);
  };

  const onSelectDisasterType = (e) => {
    const disasterType = e.target.value;
    setDisasterType(disasterType);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getPayload = () => {
    const payload = {
      walletId: Moralis.account.toString(),
      locationDetails: {
        latitude,
        longitude,
      },
      premiumAmount,
      policyType,
      maxSumInsured,
      disasterType,
      bankDetails: {
        beneficiaryName,
        accountNumber,
        routingNumber,
        billingDetails: {
          name,
          city,
          country,
          line1: addressLine1,
          postalCode,
          district,
        },
        bankAddress: {
          country: "US",
        },
      },
    };

    return payload;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const payload = JSON.stringify(getPayload());
    const response = await fetch("/api/register-insurance", {
      method: "POST",
      body: payload,
      headers: {
        "Content-type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      setShowDialog(true);
      setDialogMessage(
        data?.message || "You have successfully registered for insurance."
      );
    } else {
      setShowDialog(true);
      setDialogMessage(
        "There was some error with the registration. Please try again later."
      );
    }
  };

  const preFillCardData = () => {
    setBeneficiaryName("John Smith");
    setAccountNumber("12340010");
    setRoutingNumber("121000248");
    setName("John Smith");
    setAddressLine1("1 Main Street");
    setPostalCode("02201");
    setCity("Boston");
    setDistrict("MA");
    setCountry("US");
  };

  const disasterOptions = DISASTERS.map((disaster) => (
    <option key={disaster} value={disaster.toLowerCase()}>
      {disaster}
    </option>
  ));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <Form onSubmit={submitHandler}>
            <h3>Insurance Details</h3>
            <FormGroup>
              <Input
                type="select"
                id="policyType"
                name="policyType"
                onChange={onSelectPolicyType}
                value={policyType}
              >
                <option value="basic">
                  Basic - Pay: 50$/month, Max Sum Insured: 1000$
                </option>
                <option value="premium">
                  Premium - Pay: 100$/month, Max Sum Insured: 2000$
                </option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="select"
                id="disasterType"
                name="disasterType"
                onChange={onSelectDisasterType}
                value={disasterType}
              >
                {disasterOptions}
              </Input>
            </FormGroup>
            <h3 className={`${styles.topMargin}`}>
              Claim Receipient Information
            </h3>
            <FormGroup>
              <Input
                type="text"
                id="beneficiaryName"
                placeholder="Beneficiary Name"
                onChange={(e) => {
                  setBeneficiaryName(e.target.value);
                }}
                value={beneficiaryName}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                id="accountNumber"
                placeholder="Account Number"
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                }}
                value={accountNumber}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                id="routingNumber"
                placeholder="Routing Number"
                onChange={(e) => {
                  setRoutingNumber(e.target.value);
                }}
                value={routingNumber}
              ></Input>
            </FormGroup>
            <h3 className="mt-8">Billing Details</h3>
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
            <Button type="submit" color="primary">
              Submit
            </Button>
          </Form>
        </div>
        <div className={styles.button}>
          <Button color="primary" onClick={preFillCardData}>
            Pre-Fill Data
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

export default PolicyPage;
