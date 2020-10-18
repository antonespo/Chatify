import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "./../../../app/common/form/TextAreaInput";
import SelectInput from "./../../../app/common/form/SelectInput";
import { category } from "./../../../app/common/options/categoryOptions";
import DateInput from "./../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import { ActivityFormValues } from "../../../app/models/activity";
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan,
} from "revalidate";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface DetailParams {
  activityId: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const RootStore = useContext(RootStoreContext);
  const {
    buttonSubmit,
    createActivity,
    selectedActivity,
    editActivity,
    loadActivity,
  } = RootStore.ActivityStore;

  const validate = combineValidators({
    title: isRequired({ message: "The event title is required" }),
    description: composeValidators(
      isRequired("Description"),
      hasLengthGreaterThan(5)({
        message: "Description needs to be at least 5 characters. ",
      })
    )(),
    city: isRequired("City"),
    venue: isRequired("Venue"),
    date: isRequired("Date"),
    time: isRequired("Time"),
  });

  const { activityId: urlActivityId } = match.params;

  const [activity, setActivity] = useState(selectedActivity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nestedFunc = async () => {
      setLoading(true);
      let act = await loadActivity(urlActivityId);
      act = { ...act, time: act.date };
      setActivity(act);
      setLoading(false);
    };

    if (urlActivityId) nestedFunc();
    else setActivity(new ActivityFormValues());
  }, [urlActivityId, loadActivity]);

  const handleFinalFormSubmit = async (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      await createActivity(newActivity);
    } else {
      await editActivity(activity);
    }
  };

  function handleCancelActivity() {
    if (urlActivityId) history.push("/activities/" + urlActivityId);
    else history.push("/activities");
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={activity.description}
                  component={TextAreaInput}
                  rows={3}
                />

                <Field
                  name="category"
                  placeholder="Category"
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                <Form.Group widths="equal">
                  <Field
                    name="date"
                    placeholder="Date"
                    date={true}
                    value={activity.date}
                    component={DateInput}
                  />
                  <Field
                    name="time"
                    placeholder="Time"
                    time={true}
                    value={activity.date}
                    component={DateInput}
                  />
                </Form.Group>
                <Field
                  name="city"
                  placeholder="City"
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  name="venue"
                  placeholder="Venue"
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={buttonSubmit}
                  floated="right"
                  positive
                  disabled={loading || invalid || pristine}
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={() => handleCancelActivity()}
                  floated="right"
                  disabled={loading}
                  type="button"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
