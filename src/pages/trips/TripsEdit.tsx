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
import { loggedIn } from '../../actions/actions';
import { useDispatch } from 'react-redux';

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

export const Register: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();

    const submit = (trips: Trip) => {
        dispatch(loading(true));
        //.finally(() => dispatch(loading(false)))
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
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

export default Register