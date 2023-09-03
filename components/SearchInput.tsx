"use client"

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Companion } from "@prisma/client";

interface SearchInputProps {
    data: (Companion & {
        categoryId: string
    })[];
}

//2 different types of search inputs. new autocomplete select page refresh, old dynamic debounced automatic page content refresh
const SearchInput = ({ data }: SearchInputProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");
    const name = searchParams.get("name");

    const [open, setOpen] = useState(false); //new component
    const [value, setValue] = useState(name || '');

    //const debouncedValue = useDebounce<string>(value, 500); //old component

    //new component
    const handleSelect = (item: any) => {
        setValue(item.name);
        setOpen(false);
        console.log(value, item.name);

        const query = {
            name: item.name,
            categoryId: categoryId
        };
        const url = qs.stringifyUrl({
            url: window.location.href,
            query,
        }, { skipEmptyString: true, skipNull: true });
        router.push(url);

    };
    //new component
    useEffect(() => {
        if (value == '') {
            const query = {
                name: value,
                categoryId: categoryId
            };
            const url = qs.stringifyUrl({
                url: window.location.href,
                query,
            }, { skipEmptyString: true, skipNull: true });
            router.push(url);
        }

    }, [value, router, categoryId]);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value);
        setOpen(true);//new component
    }

    //old component
    /*     useEffect(() => {
            const query = {
                name: debouncedValue,
                categoryId: categoryId
            };
            const url = qs.stringifyUrl({
                url: window.location.href,
                query,
            }, { skipEmptyString: true, skipNull: true });
            router.push(url);
        }, [debouncedValue, router, categoryId]); */


    return (
        <div className="relative">
            {
                //old component   
                //<Search className="absolute h-5 w-5 top-[14px] left-4 text-muted-foreground bg-transparent" />
                //<Input className="bg-primary/10 pl-11 h-12 text-lg focus-visible:outline-none focus-visible:ring-0" placeholder="Search" onChange={onChange} value={value} />
            }
            {<Command onChange={onChange} className="bg-primary/10" >
                <CommandInput placeholder="Search..." className="h-12 text-lg focus-visible:outline-none focus-visible:ring-0" value={value} />
                <CommandList>
                    {value !== '' && open && (
                        <CommandGroup heading="Suggestions">
                            {data.map((item) => (
                                <CommandItem key={item.id + item.createdAt} onSelect={() => { handleSelect(item) }}>
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>}
        </div>
    );
}

export default SearchInput;