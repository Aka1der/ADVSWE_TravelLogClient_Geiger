import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonCardContent,
    IonCard, IonImg
} from '@ionic/react';
import { match } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../index';
import { TripState } from '../../reducers/reducers';
import {Capacitor} from "@capacitor/core";
import {getImageURL} from "../../services/trips";
import {Image} from "../../types/types";

export const ShowPOI: FunctionComponent = () => {

    const {selectedPOI} = useSelector<AppState, TripState>(state => state.tLogApp.trips)
    const token = useSelector<AppState, any>(state => state.tLogApp.user.token);

    const [imageURLs, setImageUrls] = useState({} as { [key: string]: string });

    useEffect(() => { if (selectedPOI && selectedPOI.images) fetchImages(selectedPOI.images) }, [])

    const fetchImages = (images: Image[]) =>
        Promise.all(images.map(i => getImageURL(token || '', i.id)))
            .then(
                urls => {
                    setImageUrls(images.reduce((acc, img, idx) => ({ ...acc, [img.id]: urls[idx] }), {}))
                }
            )

    const showImage = (image: Image) => (
        <IonCard key={image.id}>
            <img src={imageURLs[image.id]} />
            <IonCardContent>
                <p>{image.description ? image.description : 'no description available'}</p>
                <p className='credits'>Added by {image.user} at {new Date(image.uploaded).toLocaleString()}</p>
            </IonCardContent>
        </IonCard>)


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>{selectedPOI ? selectedPOI.name : 'No Name POI'}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonItem>{selectedPOI && selectedPOI.description ? selectedPOI.description : 'No description available.'}</IonItem>
                {selectedPOI && selectedPOI.images ? selectedPOI.images.map(showImage) : 'There are no images yet.'}
            </IonContent>
        </IonPage>)
}