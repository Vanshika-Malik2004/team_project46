"use client";
import { useEffect, useState, useContext } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { getDiseasesForUser } from "../../../firebase/firestoreConnect";
import { AuthContext } from "../../../context/authContext";
import AccordionComponent from "../../../components/progress-tracker-accordion/index";
import { Elsie_Swash_Caps } from "next/font/google";

const ProgressTracker = () => {
  const router = useRouter();
  const { getUser } = useContext(AuthContext);
  const [diseases, setDiseases] = useState();

  useEffect(() => {
    const user = getUser();
    if (user == null) {
      router.push("/login");
      toast.error("Please Login First");
    } else {
      fetchDiseases();
    }
  }, [getUser, router]);

  const fetchDiseases = async () => {
    const response = await getDiseasesForUser(getUser().email);
    setDiseases(response);
  };
  const current_user = getUser();
  return (
    <div>
      {!current_user ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {" "}
          {diseases ? (
            <AccordionComponent
              items={diseases}
              fetchDiseases={fetchDiseases}
            />
          ) : (
            <div className="absolute inset-0 z-10 flex h-screen items-center justify-center bg-white/20">
              <Loader className="animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default ProgressTracker;
