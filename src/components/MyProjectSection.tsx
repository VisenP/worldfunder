import { FC, useState } from "react";
import { useWriteContract } from "wagmi";

import { mainContractAbi } from "../abis/contract.ts";
import { Project } from "../pages/ProjectsSections.tsx";

type Properties = {
    project?: Project;
};

export const MyProjectSection: FC<Properties> = ({ project }) => {
    const { writeContract } = useWriteContract();

    const [name, setName] = useState(project?.name ?? "");
    const [description, setDescription] = useState(project?.description ?? "");
    const [img, setImg] = useState(project?.img ?? "");
    const [link, setLink] = useState(project?.link ?? "");
    const [category, setCategory] = useState(project?.catagory ?? "");

    return (
        <div className={"flex flex-col gap-5 p-5"}>
            <input
                className={"w-full p-5 bg-white"}
                onChange={(event) => setName(event.target.value)}
                value={name}
                placeholder={"Name"}
            />
            <input
                className={"w-full p-5 bg-white"}
                onChange={(event) => setDescription(event.target.value)}
                value={description}
                placeholder={"Description"}
            />
            <input
                className={"w-full p-5 bg-white"}
                onChange={(event) => setImg(event.target.value)}
                value={img}
                placeholder={"Image link"}
            />
            <input
                className={"w-full p-5 bg-white"}
                onChange={(event) => setLink(event.target.value)}
                value={link}
                placeholder={"Link"}
            />
            <input
                className={"w-full p-5 bg-white"}
                onChange={(event) => setCategory(event.target.value)}
                value={category}
                placeholder={"Category"}
            />
            <button
                onClick={() => {
                    writeContract({
                        address: "0xb100a2d5097aabfd9ce73e87b665e7b0d47f9c62",
                        abi: mainContractAbi,
                        functionName: "addProject",
                        args: [name, description, img, link, category],
                    });
                }}
            >
                Set
            </button>
        </div>
    );
};
