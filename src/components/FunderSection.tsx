import { FC } from "react";
import { mainnet } from "viem/chains";
import { useEnsAvatar, useEnsName } from "wagmi";

export type Funder = {
    addr: string;
    totalValue: bigint;
};

type Properties = {
    funder: Funder;
};

export const FunderSection: FC<Properties> = ({ funder }) => {
    const { data: name } = useEnsName({
        address: funder.addr,
        chainId: mainnet.id,
    });

    const { data: avatar } = useEnsAvatar({
        name: name,
        chainId: mainnet.id,
        query: {
            enabled: !!name,
        },
    });

    return (
        <div
            className={
                "w-full bg-white shadow-xl p-5 flex justify-between gap-5 items-center"
            }
        >
            <div className={"flex gap-3 items-center"}>
                {avatar && (
                    <img
                        src={avatar}
                        alt={""}
                        className={"w-10 h-10 rounded-xl"}
                    />
                )}
                <span>{name ? name : funder.addr}</span>
            </div>
            <span>
                {(funder.totalValue / 1_000_000_000_000_000_000n).toString()}{" "}
                ETH
            </span>
        </div>
    );
};
