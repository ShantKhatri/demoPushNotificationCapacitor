import { Redirect, Route } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFooter, IonList, IonCard, IonCardContent, IonItem, IonLabel, IonListHeader, IonText, IonButtons, IonMenuButton, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ViewMessage from './pages/ViewMessage';
import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { Toast } from "@capacitor/toast";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect, useState } from 'react';

setupIonicReact();

const App: React.FC = () => 
  {

    const nullEntry: any[] = []
    const [notifications, setnotifications] = useState(nullEntry);



    useEffect
    (() => {
      register();
    }, [])

    const register = () => {
      console.log('Initializing HomePage');
    
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
          (token: Token) => {
              showToast('Push registration success');
              console.log('Push registration success, token: ' + token.value);
          }
      );
    
      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
          (error: any) => {
              alert('Error on registration: ' + JSON.stringify(error));
          }
      );
    
      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotificationSchema) => {
              setnotifications(notifications => [...notifications, { id: notification.id, title: notification.title, body: notification.body, type: 'foreground' }])
          }
      );
    
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: ActionPerformed) => {
              setnotifications(notifications => [...notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action' }])
          }
      );
    }
    
    const showToast = async (msg: string) => {
      await Toast.show({
          text: msg
      })
    }
    
    return (
      <IonPage id='main'>
          <IonHeader>
              <IonToolbar color="primary">
                  <IonTitle slot="start"> Push Notifications</IonTitle>
              </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
              <IonListHeader mode="ios" lines="full">
                  <IonLabel>Notifications</IonLabel>
              </IonListHeader>
              {notifications.length !== 0 &&
                  <IonList>

                      {notifications.map((notif: any) =>
                          <IonItem key={notif.id}>
                              <IonLabel>
                                  <IonText>
                                      <h3 className="notif-title">{notif.title}</h3>
                                  </IonText>
                                  <p>{notif.body}</p>
                                  {notif.type==='foreground' && <p>This data was received in foreground</p>}
                                  {notif.type==='action' && <p>This data was received on tap</p>}
                              </IonLabel>
                          </IonItem>
                      )}
                  </IonList>}
          </IonContent>
          <IonFooter>
              <IonToolbar>
                  <IonButton color="success" expand="full" onClick={register}>Register for Push</IonButton>
              </IonToolbar>
          </IonFooter>
      </IonPage >
  )
}

export default App;
