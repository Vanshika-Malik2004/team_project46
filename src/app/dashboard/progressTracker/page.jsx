"use client";
import { useEffect, useState, useContext } from "react";
import { Loader } from "lucide-react";

import { getDiseasesForUser } from "../../../firebase/firestoreConnect";
import { AuthContext } from "../../../context/authContext";
import AccordionComponent from "../../../components/progress-tracker-accordion/index";

const ProgressTracker = () => {
  const { getUser } = useContext(AuthContext);
  const [diseases, setDiseases] = useState();

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    const response = await getDiseasesForUser(getUser().email);
    setDiseases(response);
  };

  return (
    <div>
      {diseases ? (
        <AccordionComponent items={diseases} fetchDiseases={fetchDiseases} />
      ) : (
        <div className="absolute inset-0 z-10 flex h-screen items-center justify-center bg-white/20">
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
};
export default ProgressTracker;
