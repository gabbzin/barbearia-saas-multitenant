import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchInput = () => {
  return (
    <div className="flex">
      <Input
        placeholder="Pesquise serviços ou barbearias"
        type="text"
        className="border-border rounded-full"
      />
      <Button variant={"default"} size={"icon"} className="rounded-full">
        <SearchIcon />
      </Button>
    </div>
  );
};

export default SearchInput;
