import { db } from "./firebase"; // your firebase config file
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // to generate unique id for each disease

/**
 * Adds a disease record to the logged-in user's Firestore document.
 *
 * @param {string} userEmail - The email of the logged-in user.
 * @param {string} diseaseName - Name of the disease.
 * @param {string} severity - Severity level of the disease.
 * @param {string} imageUrl - URL of the uploaded disease image.
 */
export async function addDiseaseForUser(
  userEmail,
  diseaseName,
  severity,
  imageUrl
) {
  try {
    const userDocRef = doc(db, "users", userEmail);

    const diseaseData = {
      id: uuidv4(),
      name: diseaseName,
      severity: severity,
      imageUrl: imageUrl,
      progress: [
        {
          id: uuidv4(),
          severity,
          imgUrl: imageUrl,
          createdAt: Date.now(),
        },
      ],
    };

    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // If user already exists → update diseases array
      await updateDoc(userDocRef, {
        diseases: arrayUnion(diseaseData),
      });
    } else {
      // If user doesn't exist → create document with diseases array
      await setDoc(userDocRef, {
        diseases: [diseaseData],
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
    const userDocRef = doc(db, "users", userEmail);
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

/**
 * Adds a progress entry to a specific disease for a user.
 *
 * @param {string} imageUrl - The URL of the new progress image.
 * @param {string} severity - The severity level for this progress update.
 * @param {string} userEmail - The email of the user (used as document ID).
 * @param {string} diseaseId - The ID of the disease to update.
 */
export async function addProgressToDisease(
  imageUrl,
  severity,
  userEmail,
  diseaseId
) {
  try {
    const userDocRef = doc(db, "users", userEmail);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error("User document does not exist ❌");
      return;
    }

    const userData = userDocSnap.data();
    const diseases = userData.diseases || [];

    // Find the disease by ID
    const updatedDiseases = diseases.map((disease) => {
      if (disease.id === diseaseId) {
        // Add the new progress entry to the existing progress array
        const updatedProgress = [
          ...(disease.progress || []),
          { severity, imgUrl: imageUrl, createdAt: Date.now(), id: uuidv4() },
        ];
        return {
          ...disease,
          progress: updatedProgress,
        };
      }
      return disease; // Other diseases remain unchanged
    });

    // Update the diseases array in Firestore
    await updateDoc(userDocRef, {
      diseases: updatedDiseases,
    });

    console.log("Progress added successfully ✅");
  } catch (error) {
    console.error("Error adding progress ❌:", error);
  }
}

/**
 * Deletes a progress entry from a disease, and deletes disease if no progress remains.
 *
 * @param {string} userEmail - The user's email (used as document ID).
 * @param {string} diseaseId - The ID of the disease.
 * @param {string} progressId - The ID of the progress item to delete.
 */
export async function deleteProgressAndPossiblyDisease(
  userEmail,
  diseaseId,
  progressId
) {
  try {
    const userDocRef = doc(db, "users", userEmail);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error("User document does not exist ❌");
      return;
    }

    const userData = userDocSnap.data();
    const diseases = userData.diseases || [];

    const updatedDiseases = diseases.reduce((acc, disease) => {
      if (disease.id === diseaseId) {
        // Remove the specified progress item
        const updatedProgress = (disease.progress || []).filter(
          (p) => p.id !== progressId
        );

        if (updatedProgress.length > 0) {
          // If progress still exists, update the disease
          acc.push({
            ...disease,
            progress: updatedProgress,
          });
        } else {
          // If no progress remains, skip adding this disease (effectively deleting it)
          console.log(
            `Disease with ID ${diseaseId} deleted because no progress left.`
          );
        }
      } else {
        acc.push(disease); // Other diseases remain unchanged
      }
      return acc;
    }, []);

    await updateDoc(userDocRef, { diseases: updatedDiseases });

    console.log("Progress deleted successfully ✅");
  } catch (error) {
    console.error("Error deleting progress or disease ❌:", error);
  }
}
