import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { FC, useMemo, useState } from "react";
import { isAddress, parseEther } from "viem";
import { mainnet } from "viem/chains";
import {
    useEnsAddress,
    useReadContract,
    useSendTransaction,
    useWriteContract,
} from "wagmi";

import { mainContractAbi } from "../abis/contract.ts";
import { FunderSection } from "../components/FunderSection.tsx";
import { ProjectsSection } from "./ProjectsSections.tsx";

export const MainPage: FC = () => {
    const [rawData, setRawData] = useState("");

    const { data: address } = useEnsAddress({
        name: rawData,
        chainId: mainnet.id,
    });

    const realAddress = useMemo(() => {
        if (isAddress(rawData)) return rawData;

        if (address) return address;
    }, [rawData, name]);

    const { data: funders } = useReadContract({
        functionName: "getFunders",
        args: [],
        abi: mainContractAbi,
        address: "0xb100a2d5097aabfd9ce73e87b665e7b0d47f9c62",
    });

    const { sendTransaction } = useSendTransaction();

    const { writeContract } = useWriteContract();

    const [fundAmount, setFundAmount] = useState("");

    return (
        <div className={"w-full flex flex-col mt-20 p-5 rounded-xl text-black"}>
            <div className={"w-full flex flex-col gap-5"}>
                <span className={"self-start text-2xl font-bold"}>
                    Top funders:{" "}
                </span>
                <div className={"w-full flex flex-col gap-5"}>
                    {((funders ?? []) as Funder[])
                        .sort((a, b) => b.totalValue - a.totalValue)
                        .map((funder) => (
                            <FunderSection funder={funder} key={funder.addr} />
                        ))}
                </div>
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
                <button
                    onClick={() => {
                        writeContract({
                            address:
                                "0xb100a2d5097aabfd9ce73e87b665e7b0d47f9c62",
                            abi: mainContractAbi,
                            functionName: "addProject",
                            args: [
                                "Example Name",
                                "A short description",
                                "https://assets.kraken.com/marketing/web/icons/sym-eth.svg",
                                "https://nodejs.org",
                                "Tools",
                            ],
                        });
                    }}
                >
                    Test
                </button>
                <span className={"self-start text-2xl font-bold"}>
                    Enter your vote:{" "}
                </span>
                <input
                    className={
                        "p-5 flex justify-center rounded-xl bg-neutral-100 border-white"
                    }
                    type={"text"}
                    onChange={(event) => setRawData(event.target.value)}
                    value={rawData}
                    placeholder={
                        "Enter project address or ENS domain (e.g. \"worldFunder.eth\", \"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\")"
                    }
                />

                <IDKitWidget
                    app_id="app_staging_a4efe90fee5921616b0607ea20918a55"
                    action="project-vote-1"
                    // On-chain only accepts Orb verifications
                    verification_level={VerificationLevel.Orb}
                    handleVerify={(proof) => {
                        writeContract({
                            address:
                                "0xb100a2d5097aabfd9ce73e87b665e7b0d47f9c62",
                            abi: mainContractAbi,
                            functionName: "vote",
                            args: [
                                "0x0000000000000000000000000000000000000000",
                                BigInt(proof.merkle_root),
                                BigInt(proof.nullifier_hash),
                                proof.proof
                                    .slice(2)
                                    .match(/.{1,64}/g)
                                    .map((it) => "0x" + it)
                                    .map(BigInt) as any,
                            ],
                        });
                    }}
                    signal={address ?? ""}
                    onSuccess={() => {}}
                >
                    {({ open }) => (
                        <button onClick={open} disabled={!realAddress}>
                            {!realAddress
                                ? "Enter a valid address"
                                : "Vote with WorldID for " + realAddress}
                        </button>
                    )}
                </IDKitWidget>
            </div>
            <ProjectsSection />
        </div>
    );
};
