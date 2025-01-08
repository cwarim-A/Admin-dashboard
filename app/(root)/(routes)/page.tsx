// "use client"


// import { useStoreModal } from "@/hooks/use-store-modal";
// import { useEffect } from "react";



// const SetupPage = ()=> {
//   const onOpen = useStoreModal((state)=>state.onOpen);
//   const isOpen = useStoreModal((state)=>state.isOpen);

//   useEffect(()=>{
//     if(!isOpen){
//       onOpen()
//     }
//   },[isOpen,onOpen])

//     return null
//   }


// export default SetupPage;

"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  // Placeholder content to avoid a blank page
  return (
    <div>
      {isOpen ? "Modal is opening..." : "Initializing..."}
    </div>
  );
};

export default SetupPage;
