import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/CompanionForm";
interface CompanionIdProps {
    params: {
        id: string
    }
}



const CompanionPage = async ({ params }: CompanionIdProps) => {

    function isValidObjectId(id: string): boolean {
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        return objectIdPattern.test(id);
    }

    const companion = isValidObjectId(params.id) ? await prismadb.companion.findUnique({
        where: {
            id: params.id,
        }
    }) : null;


    const categories = await prismadb.category.findMany();

    return (
        <CompanionForm initialData={companion} categories={categories} />
    );
}

export default CompanionPage;