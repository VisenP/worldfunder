import { FC, useEffect } from "react";
import { useReadContract } from "wagmi";

import { mainContractAbi } from "../abis/contract.ts";
import { ProjectSection } from "../components/ProjectSection.tsx";

export type Project = {
    addr: string;
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
        address: "0xb100a2d5097aabfd9ce73e87b665e7b0d47f9c62",
    });

    useEffect(() => {
        console.log(status);

        if (status === "success") console.log(projects);
    }, [status, projects, error]);

    return (
        <div className={"w-full grid grid-cols-3 gap-5 mt-5"}>
            {((projects as Project[]) ?? [])
                .sort((a, b) => Number(b.votes) - Number(a.votes))
                .map((project) => (
                    <ProjectSection project={project} key={project.addr} />
                ))}
        </div>
    );
};
