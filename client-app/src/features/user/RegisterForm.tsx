import React, { useContext, useState } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import { Form, Button, Header } from "semantic-ui-react";
import { RootStoreContext } from "./../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";
import { combineValidators, isRequired, composeValidators } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { isValidEmail } from "../../app/common/form/ValidatorMethod";
import withModal from "../../app/common/modals/withModal";

const RegisterForm = () => {
  const RootStore = useContext(RootStoreContext);
  const { register } = RootStore.UserStore;

  const [error, setError] = useState<any>(null);

  const validate = combineValidators({
    userName: isRequired("Username"),
    displayName: isRequired("Display name"),
    email: composeValidators(isRequired("Email"), isValidEmail())(),
    password: isRequired("Password"),
  });

  const handleSubmit = async (values: IUserFormValues) => {
    await register(values).catch((e) => {
      setError(e);
    });
  };

  return (
    <FinalForm
      onSubmit={handleSubmit}
      validate={validate}
      render={({ handleSubmit, submitting, form, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h3"
            content="Sign up to Appen"
            color="teal"
            textAlign="center"
          />
          <Field name="userName" placeholder="Username" component={TextInput} />
          <Field
            name="displayName"
            placeholder="DisplayName"
            component={TextInput}
          />
          <Field name="email" placeholder="Email" component={TextInput} />
          <Field
            name="password"
            placeholder="Password"
            type="password"
            component={TextInput}
          />
          {error && <ErrorMessage error={error} />}
          <Button
            disabled={invalid || pristine}
            color="teal"
            content="Register"
            loading={submitting}
            fluid
          />
        </Form>
      )}
    />
  );
};

export default withModal(RegisterForm);
