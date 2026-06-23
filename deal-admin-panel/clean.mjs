import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAphpYNHNemEC-gKefc2YhSu_AxBaPd7sA",
  authDomain: "dealapp-dfbb3.firebaseapp.com",
  projectId: "dealapp-dfbb3",
  storageBucket: "dealapp-dfbb3.firebasestorage.app",
  messagingSenderId: "845567250283",
  appId: "1:845567250283:web:181a63e102d482ea42862e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clean() {
  await deleteDoc(doc(db, "users", "demo-merchant-1"));
  await deleteDoc(doc(db, "users", "demo-customer-1"));
  console.log("Successfully deleted dummy data!");
  process.exit(0);
}

clean();
