import {loggedIn, loggedOut} from "../../actions/actions";
import React from "react";
import {RouteComponentProps} from "react-router";
import {useDispatch} from "react-redux";


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

export const Logout: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>You are about to log out!</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <h5>Are you sure you want to log out?</h5>
                <IonButton expand="block" color="medium" onClick={e => {
                    e.preventDefault();
                    dispatch(loggedOut());
                    props.history.push('home/list');
                } }>YES</IonButton>
                <IonButton expand="block" color="medium" onClick={e => {
                    e.preventDefault();
                    props.history.push('home/list')
                } }>NO</IonButton>
            </IonContent>
        </IonPage>
    );
}
export default Logout