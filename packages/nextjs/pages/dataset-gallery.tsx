import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useAccount, useContractReads } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

interface Dataset {
  id: number;
  name: string;
  link: string;
  contentHash: string;
  uri: string;
  bodhi_id: number;
  owner: string;
}

const DatasetGallery: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "my">("all");

  // 读取 dataset 总数
  const { data: nextTokenId } = useScaffoldContractRead({
    contractName: "CopyrightNFT",
    functionName: "_nextTokenId",
  });

  // 获取所有 datasets
  // Create individual hooks for first 10 datasets
  const dataset1 = useScaffoldContractRead({
    contractName: "BodhiBasedCopyright",
    functionName: "getCopyright",
    args: [BigInt(1)],
  });
  const dataset2 = useScaffoldContractRead({
    contractName: "BodhiBasedCopyright",
    functionName: "getCopyright",
    args: [BigInt(2)],
  });
  const dataset3 = useScaffoldContractRead({
    contractName: "BodhiBasedCopyright",
    functionName: "getCopyright",
    args: [BigInt(3)],
  });
  const dataset4 = useScaffoldContractRead({
    contractName: "BodhiBasedCopyright",
    functionName: "getCopyright",
    args: [BigInt(4)],
  });
  const dataset5 = useScaffoldContractRead({
    contractName: "BodhiBasedCopyright",
    functionName: "getCopyright",
    args: [BigInt(5)],
  });

  // Get owners for each dataset
  const owner1 = useScaffoldContractRead({
    contractName: "CopyrightNFT",
    functionName: "ownerOf",
    args: [BigInt(1)],
  });
  const owner2 = useScaffoldContractRead({
    contractName: "CopyrightNFT",
    functionName: "ownerOf",
    args: [BigInt(2)],
  });
  const owner3 = useScaffoldContractRead({
    contractName: "CopyrightNFT",
    functionName: "ownerOf",
    args: [BigInt(3)],
  });
  const owner4 = useScaffoldContractRead({
    contractName: "CopyrightNFT",
    functionName: "ownerOf",
    args: [BigInt(4)],
  });
  const owner5 = useScaffoldContractRead({
    contractName: "CopyrightNFT",
    functionName: "ownerOf",
    args: [BigInt(5)],
  });

  const datasetHooks = [dataset1, dataset2, dataset3, dataset4, dataset5];
  const ownerHooks = [owner1, owner2, owner3, owner4, owner5];

  useEffect(() => {
    if (!nextTokenId) {
      setLoading(false);
      return;
    }

    const fetchedDatasets: Dataset[] = datasetHooks
      .map((hook, index) => {
        if (!hook.data || !ownerHooks[index].data) return null;
        const [contentHash, name, licenseId, link, bodhi_id] = hook.data;
        return {
          id: index + 1,
          name,
          link,
          contentHash: contentHash.toString(),
          uri: link, // Using link as uri since they serve similar purposes
          bodhi_id: Number(bodhi_id),
          owner: ownerHooks[index].data as string,
        };
      })
      .filter((dataset): dataset is Dataset => dataset !== null);

    setDatasets(fetchedDatasets);
    // get the owner by call the contract CopyrightNFT, use the function ownerOf one by one by the NFT Id.
    setLoading(false);
  }, [nextTokenId, datasetHooks, ownerHooks]);

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const filteredDatasets = datasets;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">加载 Dataset 数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🗂️ Dataset 展览馆</h1>
        <p className="text-gray-600">
          浏览所有已创建的数据集 NFT，创建意味着被存证和确权，如果 Tokenized，则可以购买数据集的股份！
        </p>
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">总计: {nextTokenId ? Number(nextTokenId) - 1 : 0} 个数据集</span>
            {/* {connectedAddress && (
              <span className="text-sm text-gray-500">
                已连接: <Address address={connectedAddress} />
              </span>
            )} */}
          </div>

          {/* Filter Buttons */}
          {connectedAddress && (
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === "all" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter("my")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === "my" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                我的数据集
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dataset Cards Grid */}
      {filteredDatasets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">{filter === "my" ? "您还没有创建任何数据集" : "暂无数据集"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map(dataset => (
            <div
              key={dataset.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
            >
              {/* Dataset Image/Icon */}
              <div className="bg-gradient-to-br from-blue-400 to-purple-600 h-48 flex items-center justify-center relative">
                <div className="text-white text-6xl">📊</div>
                {connectedAddress && dataset.owner.toLowerCase() === connectedAddress.toLowerCase() && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    我的
                  </div>
                )}
              </div>

              {/* Dataset Info */}
              <div className="p-6">
                {/* Dataset ID */}
                <h3 className="text-xl font-bold mb-3">Dataset {dataset.name}</h3>

                {/* Content Hash */}
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Content Hash:</span>
                  <span className="ml-2 text-sm font-mono">{formatAddress(dataset.contentHash)}</span>
                </div>

                {/* URI */}
                <div className="mb-2">
                  <span className="text-sm text-gray-600">URI:</span>
                  <a
                    href={dataset.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800 truncate block"
                  >
                    {dataset.uri.length > 30 ? `${dataset.uri.slice(0, 30)}...` : dataset.uri}
                  </a>
                </div>

                {/* Link */}
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Link:</span>
                  <a
                    href={dataset.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800 truncate block"
                  >
                    {dataset.link.length > 30 ? `${dataset.link.slice(0, 30)}...` : dataset.link}
                  </a>
                </div>

                {/* Bodhi ID */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Bodhi ID:</span>
                  <a
                    href={`https://bodhi.wtf/${dataset.bodhi_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    #{dataset.bodhi_id} {/* Display Bodhi ID */}
                    {/* Debug info */}
                    <pre className="mt-2 text-xs overflow-auto">
                      {JSON.stringify(dataset, (_, value) =>
                        typeof value === 'bigint' ? value.toString() : value
                      , 2)}
                    </pre>
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    查看详情
                  </button>
                  {connectedAddress && dataset.owner.toLowerCase() !== connectedAddress.toLowerCase() && (
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      购买份额
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">{datasets.length}</div>
          <div className="text-blue-100">总数据集数量</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">{datasets.filter(d => d.bodhi_id >= 15544).length}</div>
          <div className="text-green-100">Bodhi NFT 数量</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">{datasets.filter(d => d.bodhi_id < 15544).length}</div>
          <div className="text-purple-100">标准数据集</div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">关于 Dataset NFT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="mb-2">
              <strong>📊 数据集注册：</strong>每个数据集都有唯一的 ID 和 Arweave 交易 ID，确保内容不可篡改。
            </p>
            <p>
              <strong>🔗 许可证绑定：</strong>数据集可以绑定不同类型的许可证，定义使用规则。
            </p>
          </div>
          <div>
            <p className="mb-2">
              <strong>🪙 份额交易：</strong>通过 Bodhi1155 合约，数据集可以被分割成份额进行交易。
            </p>
            <p>
              <strong>💰 创作者收益：</strong>所有交易都会向原创作者支付 5% 的费用。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetGallery;
