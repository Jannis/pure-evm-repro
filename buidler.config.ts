import { usePlugin } from "@nomiclabs/buidler/config";
import { BigNumber } from "ethers";
usePlugin("@nomiclabs/buidler-waffle");

const MAX_INT = BigNumber.from(2).pow(256).sub(1);
// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: "0.6.4",
  },
  networks: {
    ganache: {
      chainId: 1337,
      url: "http://localhost:8545",
    },
    buidlerevm: {
      loggingEnabled: false,
      accounts: [
        {
          // 0xebb77dCE22ae0f9003359B7f7fe7b7eA0034529d
          privateKey:
            "0xf8db28f19cfb75625e0c100de3de8be364f2f4a6d77ff3b3ea361b93bef625dd",
          balance: MAX_INT.div(2).toString(),
        },
        {
          // 0xbBFeca66860d78Eb9d037B0F9F6093025EF096A3
          privateKey:
            "0xbce6e7f2cbb131f5538b052f433b381c0738d37c3df2d667d023ee10adbb33f0",
          balance: MAX_INT.div(2).toString(),
        },
        {
          // 0x9f2Acf6dd8D083B9688113e8ee5DEfC3906ee7D8
          privateKey:
            "0x5454ba77acd18c6cef9dd471a7bc57d8ff261433a2c2d90049659fe68eaf1de4",
          balance: MAX_INT.div(2).toString(),
        },
        {
          // 0x7bf6714413b8829c470d549dA07B6338D0de4142
          privateKey:
            "0x615ff2525e11be7b323e699e720378641ea2c418d829d065e74d1fd70a44706b",
          balance: MAX_INT.div(2).toString(),
        },
        {
          // 0x691F096377eD5C63e3f43b0903EFd7a34CcC23Bf
          privateKey:
            "0x20a88167e85946376ba44cf26f347c2f6d3d4f6e3302bda1990355d267c22051",
          balance: MAX_INT.div(2).toString(),
        },
      ],
    },
  },
};
