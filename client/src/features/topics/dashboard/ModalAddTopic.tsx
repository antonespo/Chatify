import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { Modal, Button, Form } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { combineValidators, isRequired } from "revalidate";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";

const ModalAddTopic = () => {
  const RootStore = useContext(RootStoreContext);
  const { addTopic, addTopicLoading } = RootStore.TopicStore;
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFinalFormSubmit = async (values: any) => {
    await addTopic(values);
    closeModal();
  };

  const validate = combineValidators({
    name: isRequired({ message: "The topic name is required" }),
  });

  return (
    <Modal
      closeIcon
      open={modalOpen}
      onClose={closeModal}
      trigger={
        <Button
          primary
          content="Add topic"
          floated="right"
          onClick={() => setModalOpen(true)}
        />
      }
      centered={false}
    >
      <Modal.Header>bla bla</Modal.Header>
      <Modal.Content>
        <FinalForm
          validate={validate}
          onSubmit={handleFinalFormSubmit}
          render={({ handleSubmit, invalid, pristine }) => (
            <Form onSubmit={handleSubmit} loading={addTopicLoading}>
              <Field name="name" placeholder="Name" component={TextInput} />
              <Field
                name="description"
                placeholder="Description"
                component={TextAreaInput}
                rows={2}
              />
              <Button
                loading={addTopicLoading}
                floated="right"
                positive
                disabled={addTopicLoading || invalid || pristine}
                type="submit"
                content="Submit"
              />
              <br />
              <br />
            </Form>
          )}
        />
      </Modal.Content>
    </Modal>
  );
};

export default observer(ModalAddTopic);
