import SearchCont from "../searchCont";

export default async function UsersSearch() {
  return (<div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
    <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs p-4 sm:p-6">
      <SearchCont />
    </div>
  </div>)
}
