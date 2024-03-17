import { FC, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";

import { mainContractAbi } from "../abis/contract.ts";
import { MyProjectSection } from "../components/MyProjectSection.tsx";
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
    const { address } = useAccount();

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
        <div className={"w-full flex flex-col gap-5"}>
            <div className={"w-full grid grid-cols-3 gap-5 mt-5"}>
                {((projects as Project[]) ?? [])
                    .sort((a, b) => Number(b.votes) - Number(a.votes))
                    .filter((p) => p.name !== "cigan")
                    .map((project) => (
                        <ProjectSection project={project} key={project.addr} />
                    ))}
            </div>
            <span className={"self-start text-2xl font-bold mt-20"}>
                My project:{" "}
            </span>
            {projects && address ? (
                <MyProjectSection
                    project={(projects as Project[]).find(
                        (p) => p.addr === address
                    )}
                ></MyProjectSection>
            ) : (
                <span></span>
            )}
        </div>
    );
};
