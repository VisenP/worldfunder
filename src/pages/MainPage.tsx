import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { FC, useState } from "react";
import { useEnsAddress } from "wagmi";

export const MainPage: FC = () => {
    const [name, setName] = useState("");

    const { data: address } = useEnsAddress({ name: name });

    console.log(name);
    console.log(address);

    return (
        <div
            className={
                "w-full flex flex-col bg-neutral-800 mt-20 p-5 rounded-xl h-[1000px]"
            }
        >
            <div className={"w-full flex flex-col gap-5"}>
                <span>Enter your vote: </span>
                <input
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
                        console.log(proof);
                    }}
                    signal={"Da"}
                    onSuccess={() => {}}
                >
                    {({ open }) => (
                        <button onClick={open}>Verify with World ID</button>
                    )}
                </IDKitWidget>
            </div>
        </div>
    );
};
