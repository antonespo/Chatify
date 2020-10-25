import React, { useContext, useState } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import { Form, Button, Header } from "semantic-ui-react";
import { RootStoreContext } from "./../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";
import { combineValidators, isRequired, composeValidators } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import withModal from "./../../app/common/modals/withModal";
import { isValidEmail } from "../../app/common/form/ValidatorMethod";

const LoginForm = () => {
  const RootStore = useContext(RootStoreContext);
  const { login } = RootStore.UserStore;

  const [error, setError] = useState<any>(null);

  const validate = combineValidators({
    email: composeValidators(isRequired("Email"), isValidEmail())(),
    password: isRequired("Password"),
  });

  const handleSubmit = async (values: IUserFormValues) => {
    await login(values).catch((e) => {
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
            content="Login to Chatify"
            color="teal"
            textAlign="center"
          />
          <Field name="email" placeholder="Email" component={TextInput} />
          <Field
            name="password"
            placeholder="Password"
            type="password"
            component={TextInput}
          />

          {error && (
            <ErrorMessage error={error} text="Invalid Email or Password" />
          )}
          <Button
            disabled={invalid || pristine}
            color="teal"
            content="Login"
            loading={submitting}
            fluid
          />
        </Form>
      )}
    />
  );
};

export default withModal(LoginForm);
