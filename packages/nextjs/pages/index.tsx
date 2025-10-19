import { useEffect, useState } from "react";
import { NextPage } from "next";

// Mock data for licenses
const LICENSE_OPTIONS = [
  {
    id: "cc0",
    name: "CC0 - No Rights Reserved",
    usage: "Free to use, modify, distribute, and sell without any restrictions",
    profit: "100% profit goes to the user, no royalties required",
    bodhi_id: 10000,
  },
  {
    id: "cc-by",
    name: "CC BY - Attribution",
    usage: "Free to use with mandatory credit to original creator",
    profit: "100% profit goes to the user, but must credit original creator",
    bodhi_id: 10001,
  },
  {
    id: "cc-by-sa",
    name: "CC BY-SA - Attribution-ShareAlike",
    usage: "Free to use and modify, but must share under same license",
    profit: "100% profit goes to the user, derivatives must use same license",
    bodhi_id: 10002,
  },
  {
    id: "cc-by-nc",
    name: "CC BY-NC - Attribution-NonCommercial",
    usage: "Free for non-commercial use only with attribution",
    profit: "No commercial use allowed, non-profit only",
    bodhi_id: 10003,
  },
  {
    id: "cc-by-nd",
    name: "CC BY-ND - Attribution-NoDerivs",
    usage: "Can be shared but not modified, must credit creator",
    profit: "100% profit goes to the user, no derivative works allowed",
    bodhi_id: 10004,
  },
  {
    id: "mit",
    name: "MIT License",
    usage: "Free to use, modify, and distribute with minimal restrictions",
    profit: "100% profit goes to the user, includes commercial use",
    bodhi_id: 10005,
  },
  {
    id: "apache",
    name: "Apache License 2.0",
    usage: "Free to use with patent rights and warranty included",
    profit: "100% profit goes to the user, includes patent rights",
    bodhi_id: 10006,
  },
  {
    id: "gpl",
    name: "GNU GPL v3",
    usage: "Free to use but must keep source code open",
    profit: "100% profit goes to the user, derivatives must be open source",
    bodhi_id: 10007,
  },
];

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
  // State for selected license
  const [selectedLicense, setSelectedLicense] = useState(LICENSE_OPTIONS[0]);

  // 格式化地址为简短格式
  // const formatAddress = (address: string) => {
  //   if (!address) return "";
  //   return `${address.slice(0, 4)}...${address.slice(-2)}`;
  // };
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
            <p className="py-6"> 基于 Bodhi 协议，对数据进行链上存证、确权与代币化！</p>
            <h2 className="text-2xl font-bold mb-6"> 😎 Handle ur Dataset Step by Step! 😎</h2>
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
            <div className="flex justify-center items-center my-8">
              <span className="text-6xl animate-bounce">⬇️</span>
            </div>
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Step 2: Select a License for Your Dataset</h3>
              <h3 className="text-lg font-semibold mb-2">步骤 2: 为数据集选择许可证</h3>

              <div className="form-control w-full max-w-lg mx-auto">
                <label className="label">
                  <span className="label-text">Choose a License Type:</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedLicense.id}
                  onChange={e => {
                    const newSelectedLicense = LICENSE_OPTIONS.find(license => license.id === e.target.value);
                    if (newSelectedLicense) {
                      setSelectedLicense(newSelectedLicense);
                    }
                  }}
                >
                  {LICENSE_OPTIONS.map(license => (
                    <option key={license.id} value={license.id}>
                      {license.name}
                    </option>
                  ))}
                </select>

                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                    {selectedLicense.name}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <b>Usage Terms:</b>
                    {selectedLicense.usage}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <b>Profit Distribution:</b>
                    {selectedLicense.profit}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <b>Bodhi Link:</b>
                    <a
                      href={`https://bodhi.wtf/${selectedLicense.bodhi_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline hover:no-underline transition-all duration-200"
                    >
                      {`https://bodhi.wtf/${selectedLicense.bodhi_id}`} 🔗
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-8">
              <span className="text-6xl animate-bounce">⬇️</span>
            </div>
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Step 3(Optional): Tokenize the Dataset based on Bodhi Protocol
              </h3>
              <h3 className="text-lg font-semibold mb-2">步骤 3(可选): 基于 Bodhi 协议对数据集进行代币化</h3>

              {/* TODO: the inputbox: the name of dataset, the description of the dataset, the hash of the dataset */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETHSpace;
