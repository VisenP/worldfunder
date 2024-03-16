import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { FC, useState } from "react";
import { mainnet } from "viem/chains";
import { useEnsAddress, useWriteContract } from "wagmi";

import { mainContractAbi } from "../abis/contract.ts";
import { ProjectsSection } from "./ProjectsSections.tsx";

export const MainPage: FC = () => {
    const [name, setName] = useState("");

    const { data: address } = useEnsAddress({
        name: name,
        chainId: mainnet.id,
    });

    const { writeContract } = useWriteContract();

    console.log(name);
    console.log(address);

    return (
        <div
            className={
                "w-full flex flex-col bg-gradient-to-b from-sky-50 to-sky-100 mt-20 p-5 rounded-xl text-black"
            }
        >
            <div className={"w-full flex flex-col gap-5"}>
                <span className={"self-start text-2xl font-bold"}>
                    Enter your vote:{" "}
                </span>
                <input
                    className={
                        "p-5 flex justify-center rounded-xl bg-neutral-100 border-white"
                    }
                    type={"text"}
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                />
                <IDKitWidget
                    app_id="app_staging_a4efe90fee5921616b0607ea20918a55"
                    action="project-vote-1"
                    // On-chain only accepts Orb verifications
                    verification_level={VerificationLevel.Orb}
                    handleVerify={(proof) => {
                        if (!address) return;

                        console.log("Calling wiht signal: " + address);
                        writeContract({
                            abi: mainContractAbi,
                            address:
                                "0x7d6d18aa639d7a21a0a45350ed0539e9dc9cd262",
                            functionName: "vote",
                            args: [
                                address,
                                proof.merkle_root,
                                proof.nullifier_hash,
                                proof.proof,
                            ],
                        });
                    }}
                    signal={address ?? ""}
                    onSuccess={() => {}}
                >
                    {({ open }) => (
                        <button onClick={open}>Verify with World ID</button>
                    )}
                </IDKitWidget>
            </div>
            <ProjectsSection />
        </div>
    );
};
