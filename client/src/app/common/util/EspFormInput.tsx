import React from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import Joi from "joi-browser";

interface IProps<T> {
  formObj: T;
  schema: T;
  errorState: any;
  handleSetFormObj: (obj: T) => void;
  handleSetError: (error: any) => void;
  name: keyof T;
  placeholder: string;
  type: string;
}

const EspFormInput = <T extends {}>(props: IProps<T>) => {

    const {
    schema,
    formObj,
    handleSetFormObj,
    handleSetError,
    errorState,
    name,
    placeholder,
    type,
  } = props;

  const validateProperty = (input: any) => {
    const obj = { [input.name]: input.value };
    const prop = input.name as keyof typeof schema;

    const schemaProp = { [input.name]: schema[prop] };
    const { error: errorJoi } = Joi.validate(obj, schemaProp);
    let error = "";
    if (errorJoi) {
      error = errorJoi.details[0].message;
    }
    return error;
  };

  const handleInputChange = (event: any) => {
    const input = event.currentTarget;
    const prop = input.name as keyof T;
    const newObj = { ...formObj, [prop]: input.value };
    handleSetFormObj(newObj);

    const errors = { ...errorState };
    const errorMessage = validateProperty(input);
    if (errorMessage !== "") {
      errors[input.name] = errorMessage;
    } else if (errors[input.name]) delete errors[input.name];
    console.log(errors);
    handleSetError(errors);
  };

  return (
    <Form.Input
      onChange={handleInputChange}
      name={name}
      placeholder={placeholder}
      value={formObj[name]}
      type={type}
      error={
        errorState &&
        errorState[name] && {
          content: errorState[name],
          pointing: "above",
        }
      }
    />
  );
};

export default EspFormInput;
