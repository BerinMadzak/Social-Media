import NewPost from "../components/NewPost";
import Posts from "../components/Posts";
import Search from "../components/Search";

export default function HomePage() {

  const onSearch = (query: string) => {
    console.log(query);
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col mt-10 w-[50%] gap-10">
        <Search onSearch={onSearch}/>
        <NewPost />
        <Posts />
      </div>
    </div>
  )
}

