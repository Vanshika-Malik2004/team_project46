'use client'
 
 import { useEffect, useState, useContext } from "react";
 import Image from "next/image";
 import { AuthContext } from "@/context/authContext";
 
 const Avatar: React.FC = () => {
     const [isMounted, setisMounted] = useState(false)
 
     const {getUser} = useContext(AuthContext)
     const user = getUser();
 
     useEffect(() => {
         setisMounted(true)
     }, [])
 
     if(!isMounted || !user) return null
 
     return (
         <div className="flex items-center gap-3">
           <Image
             className="shrink-0 rounded-full"
             src={user?.photoURL}
             width={40}
             height={40}
             alt={user?.displayName || "User"}
           />
           <div className="space-y-0.5">
             <p className="text-sm font-medium hover:underline">
                 {user?.displayName || "User"} 
             </p>
             <p className="text-muted-foreground text-xs">{user?.email || "user@example.com"}</p>
           </div>
         </div>
     )
 };
 
 export default Avatar; 