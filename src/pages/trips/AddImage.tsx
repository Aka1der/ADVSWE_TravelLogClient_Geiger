import React, { useState, ChangeEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import {
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton, IonImg, IonItem,
    IonInput, IonCard, IonIcon, IonToast, IonSpinner, IonPage, IonLabel
} from '@ionic/react';
import { Plugins, CameraSource, CameraOptions, CameraResultType, Capacitor } from '@capacitor/core';
import {useSelector, useStore} from 'react-redux';
import { AppState } from '../..';
import {camera, cloudUpload, reload} from 'ionicons/icons';
import { executeDelayed } from '../../helpers/async-helpers';
import {fetchTripActions, fetchTripsAction, updatePOIAction} from '../../actions/actions';
import {Image, Trip} from "../../types/types";
import {BuildForm, FormDescription} from "../../helpers/form-builder";
import * as Validator from "../../helpers/validators";
import {addTrip, updateTrip, uploadImage} from "../../services/trips";


interface RouteParams {
    poiId: string,
    tripId: string
}

const { Camera } = Plugins;


const cameraOptions: CameraOptions = {
    source: CameraSource.Prompt,
    resultType: CameraResultType.Uri
}



export const AddImage: React.FunctionComponent<RouteComponentProps<RouteParams>> = ({ match, history }) => {


    const [imageUri, setImageUri] = useState('');
    const [error, setError] = useState<string>('');
    const token = useSelector<AppState, any>(state => state.tLogApp.user.token);
    const [description, setDescription] = useState<string>();


    const getImage = () => Camera.getPhoto(cameraOptions)
        .then(uri => { if (uri.webPath) { setImageUri(uri.webPath) }; return uri })
        .catch(err => setError(err))

    const showImage = () => imageUri ? (
        <IonCard>
            <IonItem>
                <IonImg src={Capacitor.convertFileSrc(imageUri)} />
            </IonItem>
        </IonCard>
    ) : '';


    const saveImage = () => {
        uploadImage(token, match.params.poiId, imageUri, description);
        window.location.replace('/trips');
    };



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={`/trips/show/${match.params.tripId}`} />
                    </IonButtons>
                    <IonTitle>Add Image</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonInput value={description} placeholder="Enter Description" onIonChange={e => setDescription(e.detail.value!)}></IonInput>
                    <IonButton onClick={getImage} expand='block'><IonIcon icon={camera} />Add Image</IonButton>
                    <IonButton onClick={saveImage} disabled={imageUri ? false:true}>Save</IonButton>
                </IonItem>
                {showImage()}
            </IonContent>
        </IonPage>
    )
}