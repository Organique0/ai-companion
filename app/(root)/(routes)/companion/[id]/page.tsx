import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/CompanionForm";
interface CompanionIdProps {
    params: {
        companionId: string
    }
}

const CompanionPage = async ({ params }: CompanionIdProps) => {
    const companion = await prismadb.companion.findUnique({
        where: {
            id: params.companionId,
        }
    });

    const categories = await prismadb.category.findMany();

    return (
        <CompanionForm initialData={companion} categories={categories} />
    );
}

export default CompanionPage;