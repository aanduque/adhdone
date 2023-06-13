import { db, firebaseApp } from './firebase';
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

export const requestPermission = (user) => {

  try {

    const messaging = getMessaging(firebaseApp);

    console.log("Requesting User Permission......");

    Notification.requestPermission().then((permission) => {

      if (permission === "granted") {

        console.log("Notification User Permission Granted.");
        return getToken(messaging, { vapidKey: `BGPv0xe6pxxAKHOM-Q9-TFDXFQttYjCtk9n1OCeGQu49jkewAYirpAddopuykR96-oQIzi9G3_o2ed0TZYIj0i4` })
          .then((currentToken) => {

            if (currentToken) {
              console.log('Client Token: ', currentToken, user);

              setDoc(doc(db, 'users', user.uid), { pushNotificationToken: currentToken }, { merge: true });
            } else {
              console.log('Failed to generate the app registration token.');
            }
          })
          .catch((err) => {
            console.log('An error occurred when requesting to receive the token.', err);
          });
      } else {
        console.log("User Permission Denied.");
      }
    });
  } catch (error) {

  }

}

export const login = () => {

  const provider = new GoogleAuthProvider();

  const auth = useFirebaseAuth();

  const user = useCurrentUser();

  signInWithPopup(auth!, provider)
    .then((result) => {
      console.log(result)

      user.value?.reload()

    }).catch((error) => {
      console.log(error)
    })

}