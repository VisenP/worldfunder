import { FC } from "react";

import { Project } from "../pages/ProjectsSections.tsx";

type Properties = {
    project: Project;
};

export const ProjectSection: FC<Properties> = ({ project }) => {
    return (
        <div
            className={
                "w-full flex-col gap-1 justify-center bg-white to-sky-50 rounded-2xl mt-5 transition-all ease-linear transform hover:-translate-y-1 shadow-2xl items-center"
            }
        >
            <div className={"flex justify-center w-full"}>
                <img
                    src={project.img}
                    className={
                        "w-[256x] h-[256px] self-center rounded-t-xl -mt-5"
                    }
                    alt={""}
                />
            </div>
            <div className={"flex px-2 -mt-2"}>
                <div
                    className={
                        "mt-2 w-full p-5 font-bold flex justify-between items-center"
                    }
                >
                    <span className={"text-5xl"}>{project.name}</span>
                    <div>{project.votes.toString()}</div>
                </div>
            </div>
            <div className={"flex flex-col px-5 gap-5 py-5"}>
                <span>{project.description}</span>
                <div className={"flex justify-between gap-5"}>
                    <span>{project.catagory}</span>
                    <a href={project.link}>Link</a>
                </div>
            </div>
        </div>
    );
};
