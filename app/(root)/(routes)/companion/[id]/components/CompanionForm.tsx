"use client";
import * as z from "zod";
import { Companion, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form";

const formSchema = z.object({
    username: z.string().min(1, { message: "at least 1 character" }).max(20, { message: "maximum 20 characters" }),
    description: z.string().min(1, { message: "at least 1 character" }),
    instructions: z.string().min(200, { message: "at least 200 character" }),
    seed: z.string().min(200, { message: "at least 200 character" }),
    src: z.string().min(1, { message: "Image is required" }),
    categoryId: z.string().min(1, { message: "Category is required" })
})

interface CompanionFormProps {
    initialData: Companion | null,
    categories: Category[],
}

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            username: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                </form>
            </Form>
        </div>
    );
}

export default CompanionForm;