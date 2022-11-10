/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import { addressToP2PKH, addressToScripthash } from "@/libs/radiant-helpers/radiant-core-helpers";
import { ActivityLite } from "@/types/activity";
import { UTXO } from "@/types/base-token";
import { reject } from "lodash";
import * as rpcws from "rpc-websockets";
const defaultUrl = "wss://electrumx.radiantblockchain.org:50022/";
const WebSocket = rpcws.Client;

export class WSSElectrumClient {
    private static _instances: { [key: string]: WSSElectrumClient } = {};
    private constructor(private url: string) { }

    public async getAddressHistory(address: string): Promise<ActivityLite[] | any> {
        const scripthash = addressToScripthash(address);
        const p = new Promise((resolve, reject) => {
            const ws = new WebSocket(this.url);
            ws.on('open', function () {
                ws.call('blockchain.scripthash.get_history', [scripthash]).then(function (result: any) {
                    console.log('blockchain.scripthash.get_history result', result);
                    // Make sure the mempool tx's are at the top
                    const mempool = [];
                    for (const item of result) {
                        if (item.height <= 0) {
                            mempool.push(item);
                        }
                    }
                    mempool.sort(function(a, b){return a - b});
                    const confirmed = [];
                    for (const item of result) {
                        if (item.height > 0) {
                            confirmed.push(item);
                        }
                    }
                    const arranged = mempool.concat(confirmed.reverse());
                    const modified = arranged.map((item: any) => {
                        return Object.assign({}, item, {
                            txid: item.tx_hash
                        });
                    })
                    resolve(modified);
                }).catch((error) => {
                    reject(error);
                }).finally(() => {
                    ws.close();
                });
            });
        });
        return p;
    }

    public async getUnspentCoins(address: string): Promise<ActivityLite[] | any> {
        const scripthash = addressToScripthash(address);
        const p = new Promise((resolve, reject) => {
            const ws = new WebSocket(this.url);
            ws.on('open', function () {
                ws.call('blockchain.scripthash.listunspent', [scripthash]).then(function (result: any) {
                    console.log('blockchain.scripthash.listunspent result', result);
                    const modified = result.map((item: any) => {
                       return item;
                    })
                    resolve(modified);
                }).catch((error) => {
                    reject(error);
                }).finally(() => {
                    ws.close();
                });
            });
        });
        return p;
    }

    public async sendTransaction(signedRawtx: string): Promise<any> {
        
        const p = new Promise((resolve, reject) => {
            const ws = new WebSocket(this.url);
            ws.on('open', function () {
                ws.call('blockchain.transaction.broadcast', [signedRawtx]).then(function (result: any) {
                    console.log('blockchain.transaction.broadcast result', result);
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                }).finally(() => {
                    ws.close();
                });
            });
        });
        return p;
    
    }

    public async getBalance(address: string, withUnspentCoins?: boolean): Promise<{ confirmed: number, unconfirmed: number, balance: number } | any> {
        const scripthash = addressToScripthash(address);
        if (withUnspentCoins) {
            const p = new Promise((resolve, reject) => {
                const ws = new WebSocket(this.url);
                ws.on('open', function () {
                    ws.call('blockchain.scripthash.listunspent', [scripthash]).then(function (result: any) {
                        console.log('blockchain.scripthash.listunspent result', result);
                        const data = {
                            unconfirmed: 0,
                            confirmed: 0,
                            balance: 0,
                            utxos: [] as UTXO[]
                        };

                        for (const utxo of result) {
                            if (!utxo.height || utxo.height <= 0) {
                                data.unconfirmed += utxo.value;
                            } else {
                                data.confirmed += utxo.value;
                            }
                            data.balance += utxo.value;
                            data.utxos.push({
                                txid: utxo.tx_hash,
                                // height: utxo.height,
                                outputIndex: utxo.tx_pos,
                                value: utxo.value,
                                script: addressToP2PKH(address)
                            })
                        }
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    }).finally(() => {
                        ws.close();
                    });
                });
            });
            return p;
        } else {
            const p = new Promise((resolve, reject) => {
                const ws = new WebSocket(this.url);
                ws.on('open', function () {
                    ws.call('blockchain.scripthash.get_balance', [scripthash]).then(function (result: any) {
                        console.log('blockchain.scripthash.get_balance result', result);
                        const value: { unconfirmed: number, confirmed: number, balance: number } = Object.assign({}, result, {
                            balance: result["confirmed"] + result["unconfirmed"],
                            utxos: [],
                        })
                        resolve(value);
                    }).catch((error) => {
                        reject(error);
                    }).finally(() => {
                        ws.close();
                    });
                });
            });
            return p;
        }
    }

    public static Connection(url: string = defaultUrl): WSSElectrumClient {
        if (!this._instances || !this._instances[url]) {
            this._instances[url] = new this(url);
        }
        return this._instances[url];
    }
};

