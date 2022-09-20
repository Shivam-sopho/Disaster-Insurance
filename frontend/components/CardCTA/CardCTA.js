import { Card, Illustration } from "@web3uikit/core";

const CardCTA = (props) => {
  return (
    <Card
      description={props.description}
      onClick={props.onClick}
      title={props.title}
    >
      <div>
        <Illustration logo={props.logo} width="100%" />
      </div>
    </Card>
  );
};

export default CardCTA;
