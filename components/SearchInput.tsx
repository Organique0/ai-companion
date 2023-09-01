"use client"

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";

const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");
    const name = searchParams.get("name");

    const [value, setValue] = useState(name || '');

    const debouncedValue = useDebounce<string>(value, 500);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value);
    }

    useEffect(() => {
        const query = {
            name: debouncedValue,
            categoryId: categoryId
        };
        const url = qs.stringifyUrl({
            url: window.location.href,
            query,
        }, { skipEmptyString: true, skipNull: true });
        router.push(url);
    }, [debouncedValue, router, categoryId]);


    return (
        <div className="relative">
            <Search className="absolute h-5 w-5 top-[14px] left-4 text-muted-foreground bg-transparent" />
            <Input className="bg-primary/10 pl-11 h-12 text-lg focus-visible:outline-none focus-visible:ring-0" placeholder="Search" onChange={onChange} value={value} />
        </div>
    );
}

export default SearchInput;