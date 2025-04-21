"use client"
import {useEffect, useState, useContext} from "react"
import {getDiseasesForUser} from "../../../firebase/firestoreConnect"
import {AuthContext} from "../../../context/authContext"
import AccordionComponent from "../../../components/progress-tracker-accordion"
import StepperComponent from "@/components/comp-528"
import { Loader } from "lucide-react"
const ProgressTracker = () => {
const {getUser} = useContext(AuthContext);
const [diseases, setDiseases] = useState();

useEffect(() => {
   const getDiseases = async () => {
     const response = await getDiseasesForUser(getUser().email)
     console.log(response)
     setDiseases(response) 
   }
    getDiseases();
}, [])
return<div>
    {diseases ? <AccordionComponent items={diseases} content={<StepperComponent/>}/> :<div className='flex absolute inset-0 bg-white/20 z-10 justify-center items-center h-screen'>
        <Loader className='animate-spin' />
      </div>}
</div>

}
export default ProgressTracker