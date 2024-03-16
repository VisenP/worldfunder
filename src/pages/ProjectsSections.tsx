import { FC, useEffect } from "react";
import { useReadContract } from "wagmi";

import { mainContractAbi } from "../abis/contract.ts";
import { ProjectSection } from "../components/ProjectSection.tsx";

export type Project = {
    id: string;
    name: string;
    description: string;
    img: string;
    link: string;
    catagory: string;
    votes: number;
};

export const ProjectsSection: FC = () => {
    const {
        data: projects,
        status,
        error,
    } = useReadContract({
        functionName: "getProjects",
        args: [],
        abi: mainContractAbi,
        address: "0x7d6d18aa639d7a21a0a45350ed0539e9dc9cd262",
    });

    useEffect(() => {
        console.log(status);

        if (status === "success") console.log(projects);
    }, [status, projects, error]);

    return (
        <div className={"w-full grid grid-cols-3 gap-5 mt-5"}>
            {((projects as Project[]) ?? [])
                .sort((a, b) => b.votes - a.votes)
                .map((project) => (
                    <ProjectSection project={project} key={project.id} />
                ))}
        </div>
    );
};
