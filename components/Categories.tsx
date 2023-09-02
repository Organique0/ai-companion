"use client";

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoriesProps {
    data: Category[];
};

export default function Categories({ data }: CategoriesProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");

    const onClick = (id: string | undefined) => {
        const query = { categoryId: id };

        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, { skipNull: true });

        router.push(url);
    }

    return (
        <div className="w-full overflow-x-auto space-x-2 flex p-1">
            <button onClick={() => onClick(undefined)} className={cn(`
                flex
                items-center
                text-xs
                lg:text-base
                md:text-sm
                sm:text-sm
                px-2
                md:px-4
                py-2
                md:py-2
                rounded-md
                bg-primary/10
                hover:opacity-75
                transition
                ${!categoryId && "ring ring-sky-500/60"}
            `)}>
                newest
            </button>
            {data.map((i) => (
                <button onClick={() => onClick(i.id)} key={i.id} className={cn(`
                flex
                items-center
                text-xs
                lg:text-base
                md:text-sm
                sm:text-sm
                px-2
                md:px-4
                py-2
                md:py-2
                rounded-md
                bg-primary/10
                hover:opacity-75
                transition
                ${i.id == categoryId && "bg-sky-500 text-white"}
            `)}>
                    {i.name}
                </button>
            ))}
        </div>
    )
}

