import { Contract, ContractFactory } from "ethers";
const pure_evm = require("pure-evm");

// Get artifacts
import SimpleLinkedTransferApp from "../artifacts/SimpleLinkedTransferApp.json";
import {
  getSimpleLinkedTransferInfo,
  encodeState,
  encodeAction,
  decodeState,
  provider,
  expect,
} from "./utils";
import { defaultAbiCoder } from "ethers/lib/utils";

describe("Pure evm with view function", () => {
  let simpleLinkedTransferApp: Contract;

  // Constants
  let formatted;
  let functionData;
  let state;
  let action;

  beforeEach(async () => {
    // Deploy contract
    const wallet = (await provider.getWallets())[0];
    const deploy = await new ContractFactory(
      SimpleLinkedTransferApp.abi,
      SimpleLinkedTransferApp.bytecode,
      wallet
    ).deploy();
    simpleLinkedTransferApp = await deploy.deployed();

    // Setup test constants
    const res = getSimpleLinkedTransferInfo();
    state = res.state;
    action = res.action;

    // Get the function data
    functionData = simpleLinkedTransferApp.interface.encodeFunctionData(
      "applyAction",
      [encodeState(state), encodeAction(action)]
    );

    // Format for evm execution
    formatted = Uint8Array.from(
      Buffer.from(functionData.replace("0x", ""), "hex")
    );
  });

  it("should fetch the deployed bytecode using rpc call", async () => {
    // Verify rpc will return bytecode
    const bytecode = await provider.send("eth_getCode", [
      simpleLinkedTransferApp.address,
      "latest",
    ]);
    expect(bytecode).to.equal(SimpleLinkedTransferApp.deployedBytecode);
  });

  it("returns deployed bytecode if executed using init code", async () => {
    // Execute on evm, decode output
    const output = pure_evm.exec(
      Uint8Array.from(
        Buffer.from(SimpleLinkedTransferApp.bytecode.replace("0x", ""), "hex")
      ),
      formatted
    );
    const outputHex = "0x" + Buffer.from(output).toString("hex");
    expect(outputHex).to.be.eq(SimpleLinkedTransferApp.deployedBytecode);
  });

  it("should be able to call applyAction using pure-evm", async () => {
    // Execute on evm, decode output
    const output = pure_evm.exec(
      Uint8Array.from(
        Buffer.from(
          SimpleLinkedTransferApp.deployedBytecode.replace("0x", ""),
          "hex"
        )
      ),
      formatted
    );
    const bytes = defaultAbiCoder.decode(["bytes"], output)[0];
    const evmDecoded = decodeState(bytes);

    // Execute on contract, decode output
    const encoded = await simpleLinkedTransferApp.functions.applyAction(
      encodeState(state),
      encodeAction(action)
    );
    const contractDecoded = decodeState(encoded);

    // Verify both values are the same once decoded
    expect(evmDecoded).to.containSubset(contractDecoded);
  });
});