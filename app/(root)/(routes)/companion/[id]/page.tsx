import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/CompanionForm";
import { auth, redirectToSignIn } from "@clerk/nextjs";
interface CompanionIdProps {
    params: {
        id: string
    }
}



const CompanionPage = async ({ params }: CompanionIdProps) => {
    const { userId } = auth();
    if (!userId) {
        return redirectToSignIn();
    }
    function isValidObjectId(id: string): boolean {
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        return objectIdPattern.test(id);
    }

    const companion = isValidObjectId(params.id) ? await prismadb.companion.findUnique({
        where: {
            id: params.id,
            userId
        }
    }) : null;


    const categories = await prismadb.category.findMany();

    return (
        <CompanionForm initialData={companion} categories={categories} />
    );
}

export default CompanionPage;