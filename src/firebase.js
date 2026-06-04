import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDGpYEX5coZTSUb4zji7bbs4MDfhyj_E0E",
  authDomain: "duality-a95f0.firebaseapp.com",
  databaseURL: "https://duality-a95f0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "duality-a95f0",
  storageBucket: "duality-a95f0.firebasestorage.app",
  messagingSenderId: "84189513403",
  appId: "1:84189513403:web:8dcc11d0574ce5708e0b9e"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export function saveData(data) {
  const dbRef = ref(db, "duality/couple");
  set(dbRef, data);
}

export function listenData(callback) {
  const dbRef = ref(db, "duality/couple");
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
}