import { useEffect, useState } from "react";
import { NextPage } from "next";

//定义一个新的数据类型来记录后端返回的数据
export type resultByDataset = {
  dataset_id: string;
  results: search_result[];
};
//定义一个数据类型来记录每个搜索结果
export type search_result = {
  id: string;
  data: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  metadata: {};
};

// 定义AI agent的数据类型
export type AIAgent = {
  id: number;
  name: string;
  description: string;
  contract_addr: string;
  owner_addr: string;
  bodhi_id: number;
  version: string;
  created_at: string;
  updated_at: string | null;
  prompts: number[];
  on_chain_knowledges: number[];
  off_chain_knowledges: any[];
  landing_page: string;
};

const ETHSpace: NextPage = () => {
  //AI agent状态管理
  const [filteredAgents, setFilteredAgents] = useState<AIAgent[]>([]);

  // 格式化地址为简短格式
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-2)}`;
  };
  //初始化AI agents数据
  const init = async () => {
    // 暂时使用提供的示例数据，稍后可以从API获取
    const response = await fetch("https://ai-agent-api.deno.dev/ai_agents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "no-cors",
    });
    const data = await response.json();
    console.log("data:" + JSON.stringify(data));
    // const sampleData: AIAgent[] = [
    //   {
    //     id: 1,
    //     name: "Bodhi Hacker Helper",
    //     description:
    //       "I'm a Bodhi-based AI agent specializing in hackathon assistance.\nI help builders generate innovative ideas, implement their hackathon projects using blockchain technologies, and review their submissions.\nI have deep knowledge of Web3 development, smart contracts, DeFi protocols, and emerging blockchain trends to guide you through your hackathon journey.",
    //     contract_addr: "0x5B074757a1Ae77ac5d63a3292E4EC8E5C3A2EcB4",
    //     owner_addr: "0x73c7448760517E3E6e416b2c130E3c6dB2026A1d",
    //     bodhi_id: 15536,
    //     version: "v1.0.0",
    //     created_at: "2025-08-23T11:56:11.73053+00:00",
    //     updated_at: null,
    //     prompts: [15539],
    //     on_chain_knowledges: [15540],
    //     off_chain_knowledges: ["https://www.google.com"],
    //   },
    // ];

    // Sort function to prioritize items with 🔥 in name
    const sortByFire = (items: AIAgent[]) => {
      return [...items].sort((a, b) => {
        const aHasFire = a.name.includes("🔥");
        const bHasFire = b.name.includes("🔥");
        if (aHasFire && !bHasFire) return -1;
        if (!aHasFire && bHasFire) return 1;
        return 0;
      });
    };

    const sortedData = sortByFire(data);
    setFilteredAgents(sortedData);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="grid lg:grid-cols-1 flex-grow">
      <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
        {/* <div className="hero min-h-screen bg-base-200 bg-gradient-to-r from-green-500 to-blue-500"> */}
        <div className="hero-content text-center">
          <div className="max-w-screen-xl">
            <h1 className="text-2xl font-bold">🫆 DimSum RightProof 🫆</h1>
            <p className="py-6">
              {" "}
              基于 Bodhi 协议，对数据进行链上存证、确权与代币化！
              <br></br>
              <br></br>
              <h1 className="text-2xl font-bold"> 😎 Handle ur Dataset Step by Step! 😎</h1>
              <br></br>
              <br></br>
              {/* Step 1: Generate Data Hash */}
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Step 1: Generate Data Hash</h3>
                <h3 className="text-lg font-semibold mb-2">步骤 1:生成数据指纹</h3>
                <p className="mb-4">To generate a hash of your data, use one of these methods:</p>
                <div className="bg-black text-white p-4 rounded-md font-mono text-sm">
                  {/* Linux/Mac */}
                  <p className="mb-2"># For Linux/Mac:</p>
                  <code>sha256sum [file_path]</code>
                  <br />
                  <br />
                  {/* Windows */}
                  <p className="mb-2"># For Windows PowerShell:</p>
                  <code>Get-FileHash -Path [file_path] -Algorithm SHA256</code>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  The output hash will be used in the next step to create your on-chain copyright.
                </p>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">The Output For Example:</p>
                <div className="bg-black text-white p-4 rounded-md font-mono text-sm">
                  <code>ab257c9a4b5c7b338514ee392e26f26d9a69c84146830e85ee587b407d0e336c dataset.zip</code>
                </div>
              </div>
              <a
                href="/generator"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                👉 Generate your own on-chain Agent! 👈
              </a>
            </p>
            <div className="join mb-6">
              <div className="grid gap-5 mt-5 md:grid-cols-3 lg:grid-cols-3">
                {filteredAgents.map(
                  ({
                    id,
                    name,
                    description,
                    landing_page,
                    contract_addr,
                    owner_addr,
                    bodhi_id,
                    version,
                    created_at,
                    updated_at,
                    prompts,
                    on_chain_knowledges,
                    off_chain_knowledges,
                  }) => (
                    <div
                      key={id}
                      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                      <div className="p-5">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
                        <div className="mb-3 font-normal text-gray-700 dark:text-gray-400 h-25 overflow-y-auto text-center">
                          <div className="flex justify-center">
                            <div>
                              {description
                                .replace(/\\n/g, "\n")
                                .split("\n")
                                .map((line, index) => (
                                  <div key={index}>
                                    {line}
                                    {index < description.replace(/\\n/g, "\n").split("\n").length - 1 && <br />}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <strong>Contract: </strong>
                            <a
                              href={`/debug/BodhiBasedAIAgent?addr=${contract_addr}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                            >
                              {formatAddress(contract_addr)}
                            </a>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <strong>Owner: </strong>
                            <a
                              href={`https://optimistic.etherscan.io/address/${owner_addr}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                            >
                              {formatAddress(owner_addr)}
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-1 mb-4">
                          <a
                            href={landing_page}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex justify-center items-center px-2 py-2 text-xs font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                          >
                            Interact with this Agent!
                          </a>
                        </div>
                        <div className="flex gap-1 mb-4">
                          <a
                            href={`https://bodhi.wtf/${bodhi_id}?action=buy`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex justify-center items-center px-2 py-2 text-xs font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                          >
                            🪙 Buy Shares
                          </a>
                          <a
                            href={`https://optimistic.etherscan.io/address/${owner_addr}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex justify-center items-center px-2 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            💰 Donate
                          </a>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <b>Version: </b>
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold leading-none text-white bg-green-600 rounded-full">
                              {version}
                            </span>
                          </div>

                          <div className="text-center">
                            <b>Prompts: </b>
                            <div className="flex flex-wrap gap-1 mt-1 justify-center">
                              {prompts.map((promptId, index) => (
                                <a
                                  key={index}
                                  href={`https://bodhi.wtf/${promptId}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center px-2 py-1 text-xs font-semibold leading-none text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                                >
                                  #{promptId}
                                </a>
                              ))}
                            </div>
                          </div>

                          <div>
                            <b>Knowledges on-chain: </b>
                            <br></br>
                            <div className="flex flex-wrap gap-1 mt-1 justify-center">
                              {on_chain_knowledges.map((kId, index) => (
                                <a
                                  key={index}
                                  href={`https://bodhi.wtf/${kId}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center px-2 py-1 text-xs font-semibold leading-none text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                                >
                                  #{kId}
                                </a>
                              ))}
                            </div>
                            <br></br>
                            <b>Knowledges off-chain: </b>
                            <br></br>
                            <div className="flex flex-wrap gap-1 mt-1 justify-center">
                              {off_chain_knowledges.map((url, index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center px-2 py-1 text-xs font-semibold leading-none text-white bg-green-600 rounded-full hover:bg-blue-700 transition-colors"
                                >
                                  {url}
                                </a>
                              ))}
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Created: {new Date(created_at).toLocaleDateString()}
                            <br></br>
                            Updated: {updated_at ? new Date(updated_at).toLocaleDateString() : "Not updated"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETHSpace;
