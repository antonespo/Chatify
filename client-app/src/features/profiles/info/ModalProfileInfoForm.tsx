import React, { useContext } from "react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { Modal, Button, Form } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { gender } from "../../../app/common/options/categoryOptions";
import { combineValidators, isRequired } from "revalidate";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";

const ModalProfileInfoForm = () => {
  const RootStore = useContext(RootStoreContext);
  const { profile, updateProfile, updatingProfile } = RootStore.ProfileStore;

  const handleFinalFormSubmit = async (values: any) => {
    await updateProfile(values);
  };

  const validate = combineValidators({
    displayName: isRequired({ message: "The displayName is required" }),
  });

  return (
    <Modal
      closeIcon
      trigger={<Button content="Edit profile info" floated="right" />}
      centered={false}
    >
      <Modal.Header>{profile!.displayName + "'s info"}</Modal.Header>
      <Modal.Content>
        {profile && (
          <FinalForm
            validate={validate}
            initialValues={profile}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={updatingProfile}>
                <Field
                  name="displayName"
                  placeholder="DisplayName"
                  value={profile.displayName}
                  component={TextInput}
                />
                <Field
                  name="bio"
                  placeholder="Bio"
                  value={profile.bio}
                  component={TextAreaInput}
                  rows={2}
                />
                <Field
                  name="gender"
                  placeholder="Gender"
                  value={profile.gender}
                  component={SelectInput}
                  options={gender}
                />
                <Field
                  name="dateOfBirth"
                  placeholder="DateOfBirth"
                  date={true}
                  value={profile.dateOfBirth}
                  initialView="decade"
                  component={DateInput}
                />
                <Field
                  name="phone"
                  placeholder="Phone"
                  value={profile.phone}
                  type="number"
                  component={TextInput}
                />
                <Button
                  loading={updatingProfile}
                  floated="right"
                  positive
                  disabled={updatingProfile || invalid || pristine}
                  type="submit"
                  content="Submit"
                />
                <br />
                <br />
              </Form>
            )}
          />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default observer(ModalProfileInfoForm);
