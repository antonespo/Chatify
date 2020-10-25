import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";
import { DateTimePicker } from "react-widgets";
// import Globalize from 'globalize';
// import globalizeLocalizer from 'react-widgets-globalize';

interface IProps
  extends FieldRenderProps<Date, HTMLInputElement>,
    FormFieldProps {}

const DateInput: React.FunctionComponent<FieldRenderProps<
  Date,
  HTMLElement
>> = ({
  input,
  width,
  placeholder,
  date = false,
  time = false,
  meta: { touched, error },
  ...rest
}) => {
  // let formatter = Globalize.dateFormatter({ raw: 'dd MMM yyyy' })
  // Globalize.locale('it')
  // globalizeLocalizer()

  const format = () => {
    if (date) return "dd/MM/yyyy";
    if (time) return "HH:mm";
  };
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DateTimePicker
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={(e: any) => e.preventDefault()}
        format={format()}
        date={date}
        time={time}
        {...rest}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
