'use client'

import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/authContext'
import { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { useRouter } from 'next/navigation'
import {uploadImage, fetchDiseaseInfo} from "../../BackendConnect/imageupload"
import DisplayInfo from "../../components/info-format/index"
import FileUpload from "@/components/ui/file-upload"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

const Dashboard = () => {
  const { getUser } = useContext(AuthContext)
  const router = useRouter()
  const [image, setImage] = useState(null);  
  const [isUploadingImageAndFetchingName, setisUploadingImageAndFetchingName] = useState(false)
  const [isDiseaseInfoLoading, setIsDiseaseInfoLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null); 
  const [diseaseName, setDiseaseName] = useState();
  const [severity, setSeverity] = useState()
  const [diseaseInfo, setDiseaseInfo] = useState();

  const handleFileChange = (filewithpreview) => {
    console.log(filewithpreview)
    setImage(filewithpreview.file)
    setImagePreview(filewithpreview.preview)
  };
  

const handleUpload = async () => {
    if (!image) {
      console.error('No image selected');
      toast.error("Please select an image")
      return;
    }
    
    setisUploadingImageAndFetchingName(true);
    const result = await uploadImage(image);
    const [d1, d2] = result.result.split(',');
    setDiseaseName(d1)
    setSeverity(d2)

    const formData = new FormData();
    formData.append("file", image);
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    setisUploadingImageAndFetchingName(false)
  };
  
  const handleDiseaseData = async () =>{
    if(diseaseName == null || diseaseName == undefined){
      toast.error("no disease choosen")
    }
    setIsDiseaseInfoLoading(true)
    const data = await fetchDiseaseInfo(diseaseName, severity);
    setDiseaseInfo(data.disease_info);
    setIsDiseaseInfoLoading(false)
  }

  const handleRemove = () => {
    setImage(null);
    setImagePreview(null);
    setDiseaseName(null);
    setSeverity(null);
    setDiseaseInfo(null);
  }

  useEffect(() => {
    const user = getUser()
    if (user == null) {
      router.push('/login')  
    }
  }, [getUser, router])  

  return (
    <div className="min-h-screen w-full relative">
      {isDiseaseInfoLoading && <div className='flex absolute inset-0 bg-white/20 z-10 justify-center items-center h-screen'>
        <Loader className='animate-spin' />
      </div>}
      <div className={cn("flex items-start justify-center gap-4 overflow-hidden xl:flex-row flex-col", {
        "min-h-[calc(100vh-200px)] items-center": !diseaseInfo,
      })}>
      <motion.div 
        className={cn("flex flex-col justify-center items-center w-full gap-4", {
          "flex-[0.35] sticky top-[0px] h-fit": diseaseInfo,
        })}
        layout
        layoutId="mainContent"
        transition={{ 
          layout: {
            type: "spring",
            duration: 0.5,
            bounce: 0.1
          }
        }}
      >
        <FileUpload disabled={isUploadingImageAndFetchingName || isDiseaseInfoLoading} onRemove={handleRemove} onFileChange={handleFileChange} />

        {/* Upload button */}
        <Button 
          onClick={handleUpload} 
          disabled={!image || isUploadingImageAndFetchingName || diseaseName}
          className='rounded-full'
        >
          {
            isUploadingImageAndFetchingName && <Loader className='animate-spin' />
          }
          {isUploadingImageAndFetchingName ? "Uploading..." : "Upload"}
        </Button>
       <div className="flex flex-col">
       {diseaseName && !isUploadingImageAndFetchingName && <h1 className='text-4xl font-bold text-center'>{diseaseName} and the level of severity is {severity}</h1>}
       {diseaseName && !diseaseInfo && !isUploadingImageAndFetchingName && <Button variant="link" className='text-blue-500' onClick={handleDiseaseData}>Get more info...</Button>}
       </div>
      </motion.div>
      
      <AnimatePresence mode="popLayout">
        {diseaseInfo && (
          <motion.div 
            className={cn("xl:border-l border-l-0 xl:border-t-0 border-t xl:pl-4 xl:pt-0 pl-0 pt-4", {
              "flex-[0.75]": diseaseInfo,
            })}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ 
              type: "tween", 
              ease: "easeInOut",
              duration: 0.4,
              opacity: { duration: 0.3 }
            }}
          >
            <DisplayInfo content={diseaseInfo}/>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard