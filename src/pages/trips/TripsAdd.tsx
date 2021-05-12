import React from 'react';
import * as Validator from '../../helpers/validators';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonPage
} from '@ionic/react';
import {FormDescription, BuildForm} from '../../helpers/form-builder';
import {RouteComponentProps} from 'react-router';
import {login, register} from '../../services/security';
import {executeDelayed} from '../../helpers/async-helpers';
import {Trip, User} from '../../types/types';
import {fetchTripAction, fetchTripActions, loggedIn, TripsResult} from '../../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import {addTrip} from "../../services/trips";
import {AppState} from "../../index";
import {ThunkDispatch} from "redux-thunk";

type formData = Readonly<Trip>;

const formDescription: FormDescription<formData> = {
    name: 'Add Trip',
    fields: [
        {name: 'name', label: 'Name', type: 'text',
            position: 'floating', color: 'primary', validators: [Validator.required]},
        {name: 'description', label: 'Description', type: 'text',
            position: 'floating', color: 'primary'},
        {name: 'begin', label: 'Begin Date', type: 'date',
            position: 'floating', color: 'primary'},
        {name: 'end', label: 'End Date', type: 'date',
            position: 'floating', color: 'primary'}
    ],
    submitLabel: 'Add'
}

const {Form ,loading, error} = BuildForm(formDescription);

//export const TripsAdd: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

export default (mode: 'add' | 'edit'): React.FC<RouteComponentProps<{ id: string }>> =>
    ({ history, match }) => {

    const thunkDispatch: ThunkDispatch<AppState, null, TripsResult> = useDispatch();

    const dispatch = useDispatch();
    const token = useSelector<AppState, string | null>(state => state.tLogApp.user.token || null);

    const submit = (trip: Trip) => {
        dispatch(loading(true))
        addTrip(token, trip)
            .then(trip=> dispatch(fetchTripActions.success(trip)))
            .then(t=> thunkDispatch(fetchTripActions()))
            .then(t=> executeDelayed(200, () => history.goBack()))
            .catch((err:Error) => {
                dispatch(error('Error while Adding:' + err.message));
            })
           .finally(() => dispatch(loading(false)))
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    {(() => {
                        if (mode == "add") {
                            return (
                                <IonTitle>Add Trip</IonTitle>
                            );
                        } else {
                            return (
                                <IonTitle>Edit Trip</IonTitle>
                            );
                        }
                    })()}
                    <IonTitle>Add Trip</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <Form handleSubmit={submit}/>
                {/* <IonButton expand="block" color="medium" onClick={e => {
                    e.preventDefault();
                    props.history.push('/login/register')
                } }>Create an Account</IonButton>*/}
            </IonContent>
        </IonPage>
    );
}

//export default TripsAdd