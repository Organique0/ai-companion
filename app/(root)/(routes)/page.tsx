import Categories from "@/components/Categories";
import SearchInput from "@/components/SearchInput";
import prismadb from "@/lib/prismadb";
import Companions from "@/components/Companions";
import { Companion } from "@prisma/client";

interface HomePageProps {
  searchParams: {
    categoryId: string
    name: string
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  //omg this is the best database query ever.
  //it allows you to search the database and find all results containing the name of the character within the current category
  //if there is no name in searchParams then returns all results

  //TODO: load messages count
  //there should be messages linked to each character in the database
  var data: Companion[];
  if (searchParams.name) {
    data = await prismadb.companion.aggregateRaw({
      pipeline: [
        {
          $search: {
            index: "companionSearch",
            autocomplete: {
              path: "name",
              query: searchParams.name
            }
          },
        },
        {
          $addFields: {
            categoryId: searchParams.categoryId
          }
        },
        {
          $match: {
            categoryId: searchParams.categoryId
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $limit: 50
        }
      ],
    }) as unknown as Companion[];  //this is super important to get the correct data type

  } else {
    data = await prismadb.companion.findMany({
      where: {
        categoryId: searchParams.categoryId
      }
    })
  }


  const categories = await prismadb.category.findMany();
  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput data={data} />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  )
}
