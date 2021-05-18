import {
    IonToast,
    IonRefresher,
    IonRefresherContent,
    IonAlert,
    IonSpinner,
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
    IonImg
} from '@ionic/react';
import {addCircleOutline, beer, boat, create, train, trash} from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../index";
import {TripState} from "../../reducers/reducers";
import {ThunkDispatch} from 'redux-thunk';
import {fetchTripsAction, fetchTripsActions, TripsResult} from "../../actions/actions";
import {RefresherEventDetail} from '@ionic/core';
import {deleteTrip, fetchMyTrips} from "../../services/trips";
import {executeDelayed} from "../../helpers/async-helpers";

const TripsList: React.FC<RouteComponentProps> = ({history}) => {

    const { trips, isLoading, errorMessage, hasSeenSwipeHint } = useSelector<AppState, TripState>(s => s.tLogApp.trips);

    const thunkDispatch: ThunkDispatch<AppState, null, TripsResult> = useDispatch();
    const dispatch = useDispatch();

    const [currentTrip, setCurrentTrip] = useState('');

    useEffect(() => { if (trips.length === 0) dispatch(fetchTripsAction()) }, []);

    const token = useSelector<AppState, string>(state => state.tLogApp.user.token || '');
    const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        console.log('Begin async operation');
        fetchMyTrips(token)
            .then(trips => dispatch(fetchTripsActions.success(trips)))
            .then(() => event.detail.complete())
            .catch(err => dispatch(fetchTripsActions.failure(err)))
    }

    const loadTrip = (id: string) => executeDelayed(200, () => history.push(`/trips/edit/${id}`))

    const [showAlertDelete, setShowAlertDelete] = useState(false);

    const deleteThisTrip = (id: string) => {
        setCurrentTrip(id);
        setShowAlertDelete(true)


    }

    const ListTrips = () => {
        const items = trips.map(trip => {
            return (
                <IonItemSliding key={trip._id}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => { loadTrip(trip._id) }}><IonIcon icon={create} /> edit</IonItemOption>
                        <IonItemOption color="danger" onClick={() => { deleteThisTrip(trip._id) }}><IonIcon icon={trash} /> delete</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={trip._id} onClick={() => history.push('/trips/show/' + trip._id)}>
                        <IonIcon icon={train} />
                        {trip.name}
                        <div className="item-note" slot="end">
                            {trip.description ? trip.description.substr(0, 10) + '...' : ''}
                        </div>
                    </IonItem>
                </IonItemSliding>
            );
        });

        if(trips.length === 0)
        {
            return <img src='assets/img/noList.jpg'></img>;
        }else{
            return <IonList>{items}</IonList>;
        }

    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="end">
                        <IonButton onClick={e => {
                            e.preventDefault();
                            history.push('/trips/add');}}>
                            <IonIcon slot="icon-only" icon={addCircleOutline}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>My Trips</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {isLoading ? <IonItem><IonSpinner />Loading trips...</IonItem> : <ListTrips />}
                <IonToast
                    isOpen={errorMessage ? errorMessage.length > 0 : false}
                    onDidDismiss={() => false}
                    message={errorMessage}
                    duration={5000}
                    color='danger'
                />
                <IonToast
                    isOpen={!hasSeenSwipeHint && trips.length > 0}
                    message={'You can edit/delete trips by swiping them to the left!'}
                    duration={5000}
                    color=''
                />
                <IonAlert
                    isOpen={showAlertDelete}
                    onDidDismiss={() => setShowAlertDelete(false)}
                    cssClass='my-custom-class'
                    header={'Confirm!'}
                    message={'Message <strong>Are you sure?</strong>!!!'}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: blah => {
                                console.log('Confirm Cancel: blah');
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                deleteTrip(token,currentTrip)
                                    .then(t => thunkDispatch(fetchTripsAction()))
                                console.log('Confirm Okay');
                            }
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

// const ListItems = () => {
//
//
//     return <IonList></IonList>;
// };

export default TripsList;