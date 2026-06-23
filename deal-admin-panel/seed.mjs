import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

async function seed() {
  await setDoc(doc(db, "users", "demo-merchant-1"), {
    name: "Pizza Hut (Local)",
    email: "merchant@pizzahut.com",
    role: "merchant",
    createdAt: new Date().toISOString()
  });
  await setDoc(doc(db, "users", "demo-customer-1"), {
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    createdAt: new Date().toISOString()
  });
  console.log("Successfully seeded users into live Firebase!");
  process.exit(0);
}

seed();
