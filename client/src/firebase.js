import firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseConfigContent } from './firebaseConfig';

let firebaseConfig = {
  ...firebaseConfigContent,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;