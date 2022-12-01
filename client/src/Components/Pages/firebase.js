import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'

const firebaseConfig = {
      apiKey: "AIzaSyApNuwFN0LeclFeb6eubKjDnTyHEf0FwcQ",
      authDomain: "qsign-1cf48.firebaseapp.com",
      projectId: "qsign-1cf48",
      storageBucket: "qsign-1cf48.appspot.com",
      messagingSenderId: "541068237151",
      appId: "1:541068237151:web:b785ae05430d3e9230feea"
  };
  const app = firebase.initializeApp(firebaseConfig); 
  
 const db = app.firestore();
  export default db;
