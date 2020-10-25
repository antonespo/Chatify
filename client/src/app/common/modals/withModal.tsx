import React from "react";
import { Modal, Button } from "semantic-ui-react";

interface IProps {
  buttonName: string;
}

const withModal = (Component: any) => {
  const WithModal: React.FC<IProps> = (props) => {
    const { buttonName } = props;

    return (
      <Modal
        trigger={
          <Button size="huge" inverted>
            {buttonName}
          </Button>
        }
        size="mini"
      >
        <Modal.Content>
          <Component {...props} />
        </Modal.Content>
      </Modal>
    );
  };
  return WithModal;
};

export default withModal;
