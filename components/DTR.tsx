
"use client"

import { FunctionComponent, useState, ReactNode } from "react";
import {
    TDocDeployer__factory,
    TOKEN_REG_CONSTS,
} from '@tradetrust-tt/tradetrust-core'
import { useAccount, useChainId, useConfig, useWalletClient } from "wagmi";
import { encodeAbiParameters, parseEventLogs } from "viem";
import { getTransactionReceipt, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { toast } from "react-toastify";
import { constants } from "@tradetrust-tt/token-registry";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { manager_abi } from "../constants/abi";
import { Check } from "lucide-react";

// Add JSX namespace declaration
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

interface DTRProps {
}

interface TextProps {
    children: ReactNode;
    h2?: boolean;
}


const abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "InvalidAdminAddress", "type": "error" }, { "inputs": [], "name": "InvalidTokenId", "type": "error" }, { "inputs": [], "name": "TokenExists", "type": "error" }, { "inputs": [], "name": "TokenNotSurrendered", "type": "error" }, { "inputs": [], "name": "TransferFailure", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "ACCEPTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MINTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "RESTORER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "genesis", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "params", "type": "bytes" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "mint", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC721Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "restore", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "bytes32", "name": "adminRole", "type": "bytes32" }], "name": "setRoleAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "titleEscrowFactory", "outputs": [{ "internalType": "contract ITitleEscrowFactory", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }] as const

type HexString = `0x${string}`

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

interface TextProps {
    children: React.ReactNode; // Define children as ReactNode
    h2?: boolean; // h2 is optional and of type boolean
}

const Text: React.FC<TextProps> = ({ children, h2 }) => {
    if (h2) return <h2 className="text-xl font-bold mb-3">{children}</h2>;
    return <div className="mb-2">{children}</div>;
};

type Role = 'MinterRole' | 'AccepterRole' | 'RestorerRole' | 'DefaultAdmin' | 'MinterAdminRole' | 'AccepterAdminRole' | 'RestorerAdminRole';

const DTR: FunctionComponent<DTRProps> = () => {
    const config = useConfig()
    const chainId = useChainId()
    const { address, isConnected } = useAccount()
    const [isSubmitting, setSubmitting] = useState(false)
    const [isSubmitting2, setSubmitting2] = useState(false)
    const [loadingRoles, setLoadingRoles] = useState({
        MinterRole: false,
        AccepterRole: false,
        RestorerRole: false
    })
    const [rolesGranted, setRolesGranted] = useState({
        MinterRole: false,
        AccepterRole: false,
        RestorerRole: false
    })
    const { data: client } = useWalletClient()
    const [tokenRegistryAddress, setTokenRegistryAddress] = useState<`0x${string}`>()
    const [minterAddress, setMinterAddress] = useState<`0x${string}`>()

    const deployTokenRegistry = async () => {
        setSubmitting(true)
        try {
            const { TokenImplementation, Deployer } = TOKEN_REG_CONSTS.contractAddress
            const initParam = encodeAbiParameters(
                [{ type: 'string', name: 'name' }, { type: 'string', name: 'symbol' }, { type: 'address', name: 'deployer' }],
                ["eTEU eBill Registry", 'EBR', address!]
            )

            const hash = await writeContract(config, {
                abi: TDocDeployer__factory.abi,
                address: Deployer[chainId] as `0x${string}`,
                functionName: "deploy",
                args: [
                    TokenImplementation[chainId] as `0x${string}`,
                    initParam
                ]
            })

            await waitForTransactionReceipt(config, { hash })

            const h = await getTransactionReceipt(config, { hash })

            const topics = parseEventLogs({
                abi: TDocDeployer__factory.abi,
                logs: h.logs
            })

            const event = topics.find(topic => topic.eventName === "Deployment")
            if (event) {
                setTokenRegistryAddress(event.args.deployed)
            }
        }

        catch (error) {
            const err: any = error;
            const message = err?.cause?.reason || err?.shortMessage || err?.message || "Unknown Error"
            toast(message, {
                type: "error",
            })
        }

        finally {
            setSubmitting(false)
        }
    }

    const deployTokenMinter = async () => {
        try {
            if (!isConnected) {
                toast("Connect Wallet")
                return
            }
            setSubmitting2(true)

            const { data, status } = await axios.post("/api/getArtifacts")

            const hash = await client!.deployContract({
                abi: manager_abi,
                account: address!,
                bytecode: `0x${data.data.bytecode}`,
                args: [tokenRegistryAddress!]
            })

            const { contractAddress } = await waitForTransactionReceipt(config!, { hash })
            await sleep(10000);
            setMinterAddress(contractAddress!)
            let result, counter = 0;
            do {
                const { data: data2, status: status2 } = await axios.post("/api/verifyContract", { contractAddress });
                if (data2.status === "1") {
                    result = data2.result;
                    break;
                }
                counter += 1
                await sleep(2000);
            } while (counter < 10)

            if (result) {
                counter = 0;
                do {
                    const { data: data3, status: status3 } = await axios.post("/api/checkStatus", { guid: result, chainId })
                    if (data3.status === "1") {
                        break
                    }
                    counter += 1
                    await sleep(2000);
                } while (counter < 10)
            }

            toast.success("Token Created Successfully")
        }
        catch (error) {
            const err: any = error;
            const message = err?.cause?.reason || err?.shortMessage || err?.message || "Unknown Error"
            toast(message, {
                type: "error",
            })
        }
        finally {
            setSubmitting2(false)
        }

    }

    const grantRole = async (role: Role) => {
        // @ts-ignore
        setLoadingRoles(prev => ({ ...prev, [role]: true }))
        try {
            const hash = await writeContract(config, {
                abi: abi,
                address: tokenRegistryAddress!,
                functionName: "grantRole",
                args: [
                    constants.roleHash[role] as HexString,
                    minterAddress!
                ]
            })

            await waitForTransactionReceipt(config, { hash })
            // @ts-ignore
            setRolesGranted(prev => ({ ...prev, [role]: true }))
            toast.success(`${role} Granted Successfully`)
        }

        catch (error) {
            const err: any = error;
            const message = err?.cause?.reason || err?.shortMessage || err?.message || "Unknown Error"
            toast(message, {
                type: "error",
            })
        }
        finally {
            // @ts-ignore
            setLoadingRoles(prev => ({ ...prev, [role]: false }))
        }
    }

    return (
        <div className="container mx-auto min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
          <Card className="w-full max-w-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
            <CardHeader className="space-y-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-xl">
              <h2 className="text-3xl font-bold text-center">Token Registry and Minter Deployment</h2>
              <p className="text-blue-100 text-center">Follow the steps below to deploy the Token Registry and Minter</p>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <ol className="space-y-4 list-decimal list-inside text-sm">
                <li className="text-gray-700 dark:text-gray-300">Connect your wallet using the button below</li>
                <li className="text-gray-700 dark:text-gray-300">
                  Click on <strong className="text-blue-600 dark:text-blue-400">Deploy Token Registry</strong> to create a new Token Registry
                  <ul className="pl-6 mt-2 list-disc text-gray-600 dark:text-gray-400">
                    <li>After deployment, the Token Registry address will be displayed</li>
                  </ul>
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  Click on <strong className="text-blue-600 dark:text-blue-400">Deploy Token Minter</strong> to create a new Token Minter
                  <ul className="pl-6 mt-2 list-disc text-gray-600 dark:text-gray-400">
                    <li>After deployment, the Minter address will be displayed</li>
                  </ul>
                </li>
                <li className="text-gray-700 dark:text-gray-300">Click on <strong className="text-blue-600 dark:text-blue-400">Grant Minter Role</strong> to assign the Minter role to the deployed Minter</li>
                <li className="text-gray-700 dark:text-gray-300">Click on <strong className="text-blue-600 dark:text-blue-400">Grant Accepter Role</strong> to assign the Accepter role to the deployed Minter</li>
                <li className="text-gray-700 dark:text-gray-300">Click on <strong className="text-blue-600 dark:text-blue-400">Grant Restorer Role</strong> to assign the Restorer role to the deployed Minter</li>
              </ol>
      
              <div className="flex justify-center">
                <ConnectButton />
              </div>
      
              <div className="space-y-4">
                <div className="space-y-2">
                  <Button
                    variant="default"
                    onClick={deployTokenRegistry}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                  >
                    {isSubmitting ? "Deploying..." : "Deploy Token Registry"}
                  </Button>
                  {tokenRegistryAddress && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm border border-blue-200 dark:border-blue-700">
                      <span className="font-semibold text-blue-700 dark:text-blue-300">Token Registry Address:</span>
                      <span className="ml-2 font-mono text-gray-600 dark:text-gray-300">{tokenRegistryAddress}</span>
                    </div>
                  )}
                </div>
      
                <div className="space-y-2">
                  <Button
                    variant="default"
                    onClick={deployTokenMinter}
                    disabled={isSubmitting2 || !tokenRegistryAddress}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
                  >
                    {isSubmitting2 ? "Deploying..." : "Deploy Token Minter"}
                  </Button>
                  {minterAddress && (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900 rounded-lg text-sm border border-indigo-200 dark:border-indigo-700">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-300">Minter Address:</span>
                      <span className="ml-2 font-mono text-gray-600 dark:text-gray-300">{minterAddress}</span>
                    </div>
                  )}
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => grantRole("MinterRole")}
                    disabled={!minterAddress || rolesGranted.MinterRole || loadingRoles.MinterRole}
                    className="relative hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-300 border-blue-300 dark:border-blue-700"
                  >
                    {loadingRoles.MinterRole ? "Granting..." : "Grant Minter Role"}
                    {rolesGranted.MinterRole && (
                      <Check className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => grantRole("AccepterRole")}
                    disabled={!minterAddress || rolesGranted.AccepterRole || loadingRoles.AccepterRole}
                    className="relative hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-300 border-blue-300 dark:border-blue-700"
                  >
                    {loadingRoles.AccepterRole ? "Granting..." : "Grant Accepter Role"}
                    {rolesGranted.AccepterRole && (
                      <Check className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => grantRole("RestorerRole")}
                    disabled={!minterAddress || rolesGranted.RestorerRole || loadingRoles.RestorerRole}
                    className="relative hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-300 border-blue-300 dark:border-blue-700"
                  >
                    {loadingRoles.RestorerRole ? "Granting..." : "Grant Restorer Role"}
                    {rolesGranted.RestorerRole && (
                      <Check className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
      
      
}


export default DTR;