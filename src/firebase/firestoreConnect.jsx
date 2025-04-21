import { db } from './firebase'; // your firebase config file
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'; // to generate unique id for each disease

/**
 * Adds a disease record to the logged-in user's Firestore document.
 * 
 * @param {string} userEmail - The email of the logged-in user.
 * @param {string} diseaseName - Name of the disease.
 * @param {string} severity - Severity level of the disease.
 * @param {string} imageUrl - URL of the uploaded disease image.
 */
export async function addDiseaseForUser(userEmail, diseaseName, severity, imageUrl) {
  try {
    const userDocRef = doc(db, 'users', userEmail);

    const diseaseData = {
      id: uuidv4(), // generate unique ID
      name: diseaseName,
      severity: severity,
      imageUrl: imageUrl
    };

    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // If user already exists → update diseases array
      await updateDoc(userDocRef, {
        diseases: arrayUnion(diseaseData)
      });
    } else {
      // If user doesn't exist → create document with diseases array
      await setDoc(userDocRef, {
        diseases: [diseaseData]
      });
    }

    console.log("Disease added successfully ✅");
  } catch (error) {
    console.error("Error adding disease ❌:", error);
  }
}

export async function getDiseasesForUser(userEmail) {
  if (!userEmail) {
    console.error("User email is required!");
    return [];
  }

  try {
    const userDocRef = doc(db, 'users', userEmail);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.diseases || []; // Return diseases array or empty array
    } else {
      console.log("No such user document found ❗");
      return [];
    }
  } catch (error) {
    console.error("Error fetching diseases ❌:", error);
    return [];
  }
}