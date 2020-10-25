import React from "react";
import { Message } from "semantic-ui-react";

interface IProps {
  error: any;
  text?: string;
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  const CheckError = () => {
    // Per errore con text passato al component 
    // if (text) {
    //   return <Message content={text} />;
    // }

    if (error.data) {
      // Se è un errore del server proveniente da validazione lato server
      if (error.data.errors) {
        return Object.values(error.data.errors)
          .flat()
          .map((err, i) => <Message.Item key={i}>{err} </Message.Item>);
      } else {
        // Se è un errore del server proveniente da presenza da username o email esistenti
        return <Message>{error.data} </Message>;
      }
    }
  };

  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {CheckError()}
    </Message>
  );
};

export default ErrorMessage;
