<template>
<Toast position="top-right" />
<transition-group name="p-message" tag="div">
    <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id" :life="3000" :sticky="true">{{msg.content}}</Message>
</transition-group>

    <div class="layout-dashboard">
       
        <div class="p-grid">
                   
           <div class="p-col-12 p-md-6 p-xl-6">
                <div class="card no-gutter widget-overview-box widget-overview-box-1">
                    <span class="overview-icon">
                        <i class="pi pi-wallet"></i>
                    </span>
                    <span class="overview-title">Hello {{myname}} setup your wallet now</span>
                    <br><br> 
                    <div id="console">
                        {{feedback}}
                        {{pubKey}}
                        {{privKey}}

                       <br><br> <p></p>
                    </div>
                    <br>
                    

                    <form @submit.prevent="submit">
                    <div class="p-col-12 p-md-12" id="createwalletdiv">
                            <h5>Lable your Wallet</h5> 
                            
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-user"></i>
                                </span>
                                <InputText placeholder="Wallet name" id="username"  autocomplete="username" />
                            </div>
                            

                            <h5>Wallet Mnemonic Key</h5>
                            <p><b> Copy and save the mnemonic phrase in a secure place. <br>The mnemonic phrase will be encrypted and also stored in Browsers-Keychain.</b></p>   
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-credit-card"></i>
                                </span>
                                <Textarea v-model="value" :autoResize="true" rows="5" cols="30" id="mnemonicbox" />
                            </div>
                            <Button @click="addMnemonic" label="renew Mnemonic Key" icon="pi pi-check" :loading="loading[1]" />
                            <br>
                            <p>Copy paste the Mnemonic Wallet Key to here</p>
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                        <i class="pi pi-credit-card"></i>
                                </span>
                                <Password v-model="value" name="mnemonics" id="" placeholder="" autocomplete="password"  />
                               
                               
                            </div>

                            <br><br>
                            <h5>Save your Account now.</h5>
                            <p>If this pop-up does not appear (add image browser store password), please press the Key logo on the top right corner of your browser.</p>
                            <Button type="submit"  @click="saveMnemonic" label="save and open wallet" icon="pi pi-key" :loading="loading[2]" />

                    </div>
                    </form>

                </div>
            </div>
        </div>
         
    </div>
</template>

<script>

//Torus
import OpenLogin from "@toruslabs/openlogin";
import eccrypto from "@toruslabs/eccrypto";



//Cosmos
import { coin, coins, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto"; //custom adress prefix
const rpcEndpoint = "http://195.48.9.153:26657";


//document.getElementById('createwalletdiv').hide()
export default {
    data() {
        return {
            messages: [],
            count: 0,
            counttest: 11,
            myname: null,
            feedback: null,
            mnemonicbox: null,
            walletobject: null,
            //Buttons
            loading: [false,false,false],
            //Tor.us
            privKey: "",
            pubKey: null,
            consoleOutput: "",
            isMocked: true,
            loginHint: "",
            selectedVerifier: "google",
            verifier: {
                loginProvider: "google", // "facebook", "apple", "twitter", "reddit", etc. See full list of supported logins: https://docs.tor.us/direct-auth/verifiers
                clientId: "BFTS7IfH33HVEXISSMVlqC2Y1Pvf-6OEdr9wQKbkmgnhD9wxoCOk443gxK6hmvObxKwQNacY-Di5SNMF8S40uzo",
            }
        };
    },
 

    async mounted () {
        //create first Mnemonic
        
        const mnemonicgenerated = await DirectSecp256k1HdWallet.generate(24)
        this.mnemonicbox = mnemonicgenerated.secret.data
        this.walletobject = mnemonicgenerated
        document.getElementById('mnemonicbox').value=this.mnemonicbox;
     
        //Tor.us
        if(this.sdk) return;
            this.sdk = new OpenLogin({
            clientId: this.verifier.clientId,
            network: "testnet" // valid values (testnet or mainnet)
        });

        await this.sdk.init();
        if (this.sdk.privKey) {
            console.log("Private key1: ", this.sdk.privKey);
            //this.messages = [ {severity: 'success', content: 'Login successfully', id: this.count++} ]
            this.$toast.add({severity:'success', summary: 'Login', detail:'successfully', life: 3000});
           
            // Corresponding uncompressed (65-byte) public key.
            //var privateKeyB = Buffer.from(this.sdk.privKey, 'hex');
            var publicKeyB = eccrypto.getPublic(this.sdk.privKey);
            console.log("Public Key"+publicKeyB)
            console.log("Public Key Hex"+publicKeyB.toString('hex'))
            
            // Encrypting the message for B.
            const encrypted = eccrypto.encrypt(publicKeyB, Buffer.from("1234 HAllo")); //.then(function(encrypted) {
            console.log("Message encrypted:", encrypted);
            // B decrypting the message.
            eccrypto.decrypt(privateKeyB, encrypted).then(function(plaintext) {
                console.log("Message to part B:", plaintext.toString());
            });
           // });
            // const publicKey = eccrypto.getPublic(this.sdk.privKey);
            this.pubKey = "Your Torus Public Key: "+publicKey;
            this.privKey = "Your Torus Private Key: "+this.sdk.privKey
            this.feedback = "Your Torus Private Key: "+ this.sdk.privKey
        }

        
        await this.init();
    
    },
    methods: {
        saveMnemonic () {
            console.log("submitted")
            localStorage.setItem('mnemonic', this.mnemonicbox)
            const walletname = document.getElementById('username').value
            localStorage.setItem('walletname', walletname)
            this.$router.push({ path: '/wallet' })

        },
        async addMnemonic () {
            this.loading[1] = true;
            const mnemonicgenerated = await DirectSecp256k1HdWallet.generate(24)
            this.mnemonicbox = mnemonicgenerated.secret.data
            this.walletobject = mnemonicgenerated
            //document.getElementById('createwalletdiv').show()
            document.getElementById('mnemonicbox').value=this.mnemonicbox;

        },
        delMnemonic () {
            this.loading[0] = true;
            this.loading[1] = false;
            localStorage.removeItem('mnemonic')
            this.feedback = "Account deleted "+localStorage.getItem('mnemonic')
            this.mnemonicbox = null
        },
        async encryptMnemonic() {
            const passwordenc = document.getElementById('passwordenc').value
            const mnemonicserialized = await DirectSecp256k1HdWallet.serialize(passwordenc)
            console.log(mnemonicserialized)
            
        },
        menuToggle($event) {
            this.$refs.menu.toggle($event);
        },
        //Tor.us
        // async init() {
        //     if(this.sdk) return
        //     this.sdk = new OpenLogin({ clientId: this.verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
        //     window.openlogin = this.sdk;
        //     await this.sdk.init();
        //     if (this.sdk.privKey) {
            
        //         this.console("PK"+this.sdk.privKey)
        //     }
        // },
        // async triggerLogin() {
        //     await this.sdk.login({
        //         loginProvider: "google",
        //         redirectUrl: "http://195.48.9.162:8080/torus"
        //     });
        //     console.log("private key: ", this.sdk.privKey);
        // },
        // async triggerFastLogin() {
        //     await this.sdk.fastLogin({ redirectUrl: "http://195.48.9.162:8080/torus"})
        // },
        console(text) {
            document.querySelector("#console>p").innerHTML = typeof text === "object" ? JSON.stringify(text) : text;
        },
       
    },

 
};
</script>


<style lang="scss" scoped>
.layout-dashboard {
    .orders {
        h4 {
            margin-bottom: 20px;
        }

        .p-button {
            margin-top: -20px;
        }

        .order-tabs {
            margin-bottom: 1rem;

            .order-tab {
                padding: 1rem 2rem 2rem 1rem;
                position: relative;
                transition: box-shadow 0.2s;

                &:hover {
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.15);
                    cursor: pointer;
                }

                i {
                    font-size: 1rem;
                    vertical-align: middle;
                }

                .order-label {
                    margin-left: 0.25rem;
                    vertical-align: middle;
                }

                .stat-detail-icon {
                    position: absolute;
                    right: 1rem;
                    top: 2.25rem;
                    height: 1rem;
                    width: 1rem;
                }

                img {
                    position: absolute;
                    bottom: 0;
                    left: 5%;
                    width: 90%;
                }
            }
        }
    }

    .overview-chart {
        overflow: auto;
    }

    .dashbard-demo-dropdown {
        min-width: 8rem;
        margin-left: auto;
    }

    .product-badge {
        border-radius: 2px;
        padding: 0.25em 0.5rem;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.3px;

        &.status-instock {
            background: #c8e6c9;
            color: #256029;
        }

        &.status-outofstock {
            background: #ffcdd2;
            color: #c63737;
        }

        &.status-lowstock {
            background: #feedaf;
            color: #8a5340;
        }
    }
}
</style>