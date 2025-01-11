// import prismadb from "@/lib/prismadb"
// import { BillboardForm } from "./components/billboard-form"


// interface BillboardPageProps  {
//   params: { billboardId: string };
// };


// const BillboardPage = async ({ params }: BillboardPageProps) => {

//     const Billboard = await prismadb.billboard.findUnique({
//         where:{
//             id:params.billboardId
//         }
//     })

//   return (
//     <div className="flex-col">
//         <div className="flex-1 space-y-4 p-8 pt-6">
//                 <BillboardForm initialData={Billboard}/>
//         </div>
//     </div>
//   )
// }

// export default BillboardPage


import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

// interface BillboardPageProps {
//   params: Promise<{ billboardId: string }>;
// }

const BillboardPage = async ({ params }: { params: { billboardId: string } } ) => {
   const {billboardId} = await params;
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  if (!billboard) {
    return <div>Billboard not found</div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;

