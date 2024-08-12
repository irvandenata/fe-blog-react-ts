import React, { useState, useEffect, Ref } from "react";
import axios from "axios";

const SearchableSelect: React.FC<{
    getData: (params: any) => Promise<any>;
    placeholder: string;
    field: any;
}> = ({ getData, placeholder, field }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState<any>([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const optionList = React.createRef<HTMLDivElement>();
    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData({
                    all_data: 1,
                });
                console.log(response);
                if (field.current.getAttribute("data-id") != "0") {
                    field.previous = field.current;
                    const selected = response.data.find(
                        (option: any) => option.id === field.current.value
                    );
                    setSearchTerm(selected.name);
                }
                setOptions(response.data); // Assuming the data is in the 'data' property of the response
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [getData]);

    // initial value

    // Filter options based on search term
    useEffect(() => {
        const filtered = options.filter((option: any) =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [searchTerm, options]);

    return (
        <div className="relative w-full">
            <input
                type="text"
                className="w-full px-4 py-2 dark:bg-slate-200 text-dark border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                data-id={0}
                ref={field}
                onFocus={() => optionList.current?.classList.remove("hidden")}
                onBlur={() => {
                    setTimeout(() => {
                        if (field.current.getAttribute("data-id") === "0") {
                            field.current.value = "";
                            setSearchTerm("");
                        }
                        optionList.current?.classList.add("hidden");
                    }, 500);
                }}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedOption(null);
                    field.current.setAttribute("data-id", 0);
                }}
            />
            <div
                ref={optionList}
                className="absolute mt-2 w-full hidden bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-10"
            >
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option: any) => (
                        <div
                            key={option.id}
                            className={`cursor-pointer px-4 py-2 hover:bg-primary dark:hover:text-white  hover:text-white ${
                                selectedOption === option.id
                                    ? "bg-boxdark text-white"
                                    : "dark:text-dark"
                            }`}
                            onClick={() => {
                                field.previous = field.current;
                                field!.current.setAttribute(
                                    "data-id",
                                    option.id
                                );
                                setSelectedOption(option.id);
                                setSearchTerm(option.name);
                                field.current.value = option.name;
                                optionList.current?.classList.add("hidden");
                            }}
                        >
                            {option.name}
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-2 text-gray-500">
                        No options found
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchableSelect;
