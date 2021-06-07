import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
    IonHeader,
    IonToolbar,
    IonTitle,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  logIn,
  home,
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  personAddOutline, logOut, list
} from 'ionicons/icons';
import './Menu.css';
import {Component, ReactNode} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../index";
import {isNotExpired, login} from '../services/security';
import {loggedOut} from "../actions/actions";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    iosIcon: home,
    mdIcon: home
  },
  {
    title: 'Login',
    url: '/login',
    iosIcon: logIn,
    mdIcon: logIn
  },
  {
    title: 'Register',
    url: '/login/register',
    iosIcon: personAddOutline,
    mdIcon: personAddOutline
  }
];


const secureAppPage: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    iosIcon: home,
    mdIcon: home
  },
  {
    title: 'MyTrips',
    url: '/trips',
    iosIcon: list,
    mdIcon: list
  },
  {
    title: 'LogOut',
    url: '/logout',
    iosIcon: logOut,
    mdIcon: logOut
  }
];


const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userName = useSelector<AppState, string | null>(state => state.tLogApp.user.user?.username || null);

  return (
      <IonMenu contentId="main" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            <h5>Welcome</h5>
          {(() => {
            if (userName) {
              return (<h5>{userName}</h5>)
            } else {
              return (<h5>Not logged in</h5>)
            }
          })()}
          <IonList>
            {appPages.map((appPage, index) => {
              if (!userName) {
              return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem routerLink={appPage.url} routerDirection="none">
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
              );
            }
            })}
            {secureAppPage.map((appPage, index) => {
              if (userName) {
                return (
                    <IonMenuToggle key={index} autoHide={false}>
                      <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url}
                               routerDirection="back" lines="none" detail={false}>
                        <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon}/>
                        <IonLabel>{appPage.title}</IonLabel>
                      </IonItem>
                    </IonMenuToggle>
                );
              }
            })}
          </IonList>
        </IonContent>
      </IonMenu>
  );
};

export default Menu;
