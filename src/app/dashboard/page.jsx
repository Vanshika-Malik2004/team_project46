"use client";

import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/authContext";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";
import {
  uploadImage,
  fetchDiseaseInfo,
} from "../../BackendConnect/imageupload";
import DisplayInfo from "../../components/info-format/index";
import FileUpload from "@/components/ui/file-upload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { addDiseaseForUser } from "../../firebase/firestoreConnect";

const Dashboard = () => {
  const { getUser } = useContext(AuthContext);
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [isUploadingImageAndFetchingName, setisUploadingImageAndFetchingName] =
    useState(false);
  const [isDiseaseInfoLoading, setIsDiseaseInfoLoading] = useState(false);
  const [diseaseName, setDiseaseName] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [diseaseInfo, setDiseaseInfo] = useState(null);

  const handleFileChange = (filewithpreview) => {
    setImage(filewithpreview.file);
  };

  const handleUpload = async () => {
    if (!image) {
      console.error("No image selected");
      toast.error("Please select an image");
      return;
    }

    setisUploadingImageAndFetchingName(true);
    const result = await uploadImage(image);

    if (!result?.result) {
      console.error("Invalid result from uploadImage");
      toast.error("Failed to upload image");
      setisUploadingImageAndFetchingName(false);
      return;
    }

    const [d1, d2] = result.result.split(",");

    setDiseaseName(d1);
    setSeverity(d2);

    if (!d1 || !d2) {
      console.error("Disease name or severity is missing");
      toast.error("Failed to extract disease details");
      setisUploadingImageAndFetchingName(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const { url } = await response.json();

    if (!url) {
      console.error("Failed to upload image to server");
      toast.error("Image upload failed");
      setisUploadingImageAndFetchingName(false);
      return;
    }

    const user = getUser();
    await addDiseaseForUser(user.email, d1, d2, url);

    setisUploadingImageAndFetchingName(false);
  };

  const handleDiseaseData = async () => {
    if (diseaseName == null || diseaseName == undefined) {
      toast.error("no disease choosen");
    }
    setIsDiseaseInfoLoading(true);
    const data = await fetchDiseaseInfo(diseaseName, severity);
    setDiseaseInfo(data.disease_info);
    setIsDiseaseInfoLoading(false);
  };

  const handleRemove = () => {
    setImage(null);
    setDiseaseName(null);
    setSeverity(null);
    setDiseaseInfo(null);
  };

  useEffect(() => {
    const user = getUser();
    if (user == null) {
      router.push("/login");
      toast.error("Please Login First");
    }
  }, [getUser, router]);
  const current_user = getUser();
  return (
    <div className="relative min-h-screen w-full">
      {!current_user ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {isDiseaseInfoLoading && (
            <div className="absolute inset-0 z-10 flex h-screen items-center justify-center bg-white/20">
              <Loader className="animate-spin" />
            </div>
          )}
          <div
            className={cn(
              "flex flex-col items-start justify-center gap-4 overflow-hidden xl:flex-row",
              {
                "min-h-[calc(100vh-200px)] items-center": !diseaseInfo,
              }
            )}
          >
            <motion.div
              className={cn(
                "flex w-full flex-col items-center justify-center gap-4",
                {
                  "sticky top-[0px] h-fit flex-[0.35]": diseaseInfo,
                }
              )}
              layout
              layoutId="mainContent"
              transition={{
                layout: {
                  type: "spring",
                  duration: 0.5,
                  bounce: 0.1,
                },
              }}
            >
              <FileUpload
                disabled={
                  isUploadingImageAndFetchingName || isDiseaseInfoLoading
                }
                onRemove={handleRemove}
                onFileChange={handleFileChange}
              />

              {/* Upload button */}
              <Button
                onClick={handleUpload}
                disabled={
                  !image || isUploadingImageAndFetchingName || diseaseName
                }
                className="rounded-full"
              >
                {isUploadingImageAndFetchingName && (
                  <Loader className="animate-spin" />
                )}
                {isUploadingImageAndFetchingName ? "Uploading..." : "Upload"}
              </Button>
              <div className="flex flex-col">
                {diseaseName && !isUploadingImageAndFetchingName && (
                  <h1 className="text-center text-4xl font-bold">
                    {diseaseName} and the level of severity is {severity}
                  </h1>
                )}
                {diseaseName &&
                  !diseaseInfo &&
                  !isUploadingImageAndFetchingName && (
                    <Button
                      variant="link"
                      className="text-blue-500"
                      onClick={handleDiseaseData}
                    >
                      Get more info...
                    </Button>
                  )}
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {diseaseInfo && (
                <motion.div
                  className={cn(
                    "border-l-0 border-t pl-0 pt-4 xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0",
                    {
                      "flex-[0.75]": diseaseInfo,
                    }
                  )}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.4,
                    opacity: { duration: 0.3 },
                  }}
                >
                  <DisplayInfo content={diseaseInfo} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
