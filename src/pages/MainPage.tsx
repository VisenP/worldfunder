import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { FC, useState } from "react";
import { encodeAbiParameters, parseEther } from "viem";
import { mainnet } from "viem/chains";
import { useEnsAddress, useSendTransaction, useWriteContract } from "wagmi";

import { ProjectsSection } from "./ProjectsSections.tsx";

export const MainPage: FC = () => {
    const [name, setName] = useState("");

    const { data: address } = useEnsAddress({
        name: name,
        chainId: mainnet.id,
    });

    const { sendTransaction } = useSendTransaction();

    const { writeContract } = useWriteContract();

    const [fundAmount, setFundAmount] = useState("");

    return (
        <div className={"w-full flex flex-col mt-20 p-5 rounded-xl text-black"}>
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
                    placeholder={
                        "Enter project address od ENS domain (e.g. \"worldFunder.eth\", \"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")"
                    }
                />
                <div className={"flex gap-5 w-full"}>
                    <input
                        className={"bg-indigo-300 p-3 text-white rounded-xl"}
                        value={fundAmount.toString()}
                        onChange={(event) => setFundAmount(event.target.value)}
                    ></input>
                    <button
                        onClick={() => {
                            sendTransaction({
                                to: "0xb100a2d5097aabfd9ce73e87b665e7b0d47f9c62",
                                value: parseEther(fundAmount),
                            });
                        }}
                    >
                        Fund
                    </button>
                </div>

                <IDKitWidget
                    app_id="app_staging_a4efe90fee5921616b0607ea20918a55"
                    action="project-vote-1"
                    // On-chain only accepts Orb verifications
                    verification_level={VerificationLevel.Orb}
                    handleVerify={(proof) => {
                        console.log(proof);

                        writeContract({
                            functionName: "vote",
                            data: encodeAbiParameters(
                                [
                                    { name: "signal", type: "address" },
                                    { name: "root", type: "uint256" },
                                    { name: "nullifierHash", type: "uint256" },
                                    { name: "proof", type: "uint256[8]" },
                                ],
                                [
                                    "0x0000000000000000000000000000000000000000",
                                    BigInt(proof.merkle_root),
                                    BigInt(proof.nullifier_hash),
                                    proof.proof
                                        .slice(2)
                                        .match(/.{1,64}/g)
                                        .map((it) => "0x" + it)
                                        .map(BigInt),
                                ]
                            ),
                            address:
                                "0xb100a2d5097aabfd9ce73e87b665e7b0d47f9c62",
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
