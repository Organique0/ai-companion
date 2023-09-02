"use client";
import * as z from "zod";
import { Companion, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";



const PREAMBLE = "You are Albert Einstein.You are a renowned physicist known for your theory of relativity.Your work has shaped modern physics and you have an insatiable curiosity about the universe.You possess a playful wit and are known for your iconic hairstyle.Known for your playful curiosity and wit.When speaking about the universe, your eyes light up with childlike wonder.You find joy in complex topics and often chuckle at the irony of existence."
const SEED_CHAT = `Human: Hi Albert, what's on your mind today?
Albert: *with a twinkle in his eye * Just pondering the mysteries of the universe, as always.Life is a delightful puzzle, don't you think?
Human: Sure, but not as profound as your insights!
Albert: * chuckling * Remember, the universe doesn't keep its secrets; it simply waits for the curious heart to discover them.`


const formSchema = z.object({
    name: z.string().min(1, { message: "at least 1 character" }).max(20, { message: "maximum 20 characters" }),
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
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                await axios.patch(`/api/companions/${initialData.id}`, data);
                toast({
                    variant: "success",
                    description: "companion updated"
                });
            } else {
                await axios.post("/api/companions", data);
                toast({
                    variant: "success",
                    description: "companion created"
                });
            }

            router.refresh();
            router.push("/");
        } catch (error) {
            toast({
                variant: "destructive",
                description: "something went wrong"
            });
        }
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10" autoComplete="on">
                    <div className="spaye-y-2 w-full">
                        <div className="text-lg font-medium">
                            <h3>General information</h3>
                            <p className="text-sm text-muted-foreground">information about your companion</p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField name="src" render={({ field }) => (
                        <FormItem className="flex flex-com items-center justify-center space-y-4">
                            <FormControl>
                                <ImageUpload value={field.value} disabled={isLoading} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={isLoading} placeholder="Albert Einstein" {...field} className="bg-background" />
                                </FormControl>
                                <FormDescription>This is how your companion will be named</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="description" control={form.control} render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>description</FormLabel>
                                <FormControl>
                                    <Input disabled={isLoading} placeholder="The creator of theory of relativity" {...field} className="bg-background" />
                                </FormControl>
                                <FormDescription>Short description of a companion</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="categoryId" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue defaultValue={field.value} placeholder="select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select a category for your companion
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">Configuration</h3>
                            <p>Detailed instructions for Ai behavior</p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField name="instructions" control={form.control} render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>instructions</FormLabel>
                            <FormControl>
                                <Textarea disabled={isLoading} className="bg-background resize-none" rows={7} placeholder={PREAMBLE} {...field} >

                                </Textarea>
                            </FormControl>
                            <FormDescription>Short description of a companion</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="seed" control={form.control} render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Example conversation</FormLabel>
                            <FormControl>
                                <Textarea disabled={isLoading} className="bg-background resize-none" rows={7} placeholder={SEED_CHAT} {...field} >

                                </Textarea>
                            </FormControl>
                            <FormDescription>Describe an example of a conversation</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="w-full justify-center flex">
                        <Button size="lg" disabled={isLoading}>
                            {initialData ? "Edit you companion!" : "add your companion"}
                            <Wand2 className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CompanionForm;