<template>
<transition-group name="p-message" tag="div">
    <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id" :life="3000" :sticky="false">{{msg.content}}</Message>
</transition-group>

    <div class="layout-dashboard">
       
        <div class="p-grid">
            <div class="p-col-12 p-md-6 p-xl-6">
                <div class="card no-gutter widget-overview-box widget-overview-box-1">
                    <div v-if="counttest > 10">

               
                        <span class="overview-icon">
                                <i class="pi pi-wallet"></i>
                        </span>
                        <span class="overview-title">Welcome to Utribe Wallet </span>
                        <br> 
                        <p>please Login</p>
                        <div>
                            <Button @click="triggerLogin" label="Login / create Account" icon="pi pi-key" :loading="loading[2]" />  
                            <br />
                        </div>
                        <div id="console">
                            <p></p>
                        </div>

                    </div><!-- end if -->

                    <!-- ELSE -->
                    <div v-else>
                        <span class="overview-icon">
                            <i class="pi pi-wallet"></i>
                        </span>
                        <span class="overview-title">Hello {{myname}}</span>
                        
                        <div class="p-grid overview-detail text-left">
                            <div class="p-col-12">
                                <div class="overview-number">{{feedback}}</div>
                                
                                <Button @click="addMnemonic" label="open wallet" icon="pi pi-check" :loading="loading[1]" />
                            </div>
                        </div>

                    </div><!-- end else -->

                </div>
            </div>
        </div>
           
                    
     
    </div>
</template>

<script>
//Torus
import OpenLogin from "@toruslabs/openlogin";


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
            //privKey: "",
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
       
        //Tor.us
        if(this.sdk) return;
        this.sdk = new OpenLogin({
        clientId: this.verifier.clientId,
        network: "testnet" // valid values (testnet or mainnet)
        });

        await this.sdk.init();
        if (this.sdk.privKey) {
        console.log("Private key: ", this.sdk.privKey);
        }

        
        await this.init();
    
    },
    methods: {
        
       
        menuToggle($event) {
            this.$refs.menu.toggle($event);
        },
        //Tor.us
        async init() {
            if(this.sdk) return
            this.sdk = new OpenLogin({ clientId: this.verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
            window.openlogin = this.sdk;
            await this.sdk.init();
            if (this.sdk.privKey) {
                console.log("private key: ", this.sdk.privKey);
                this.console(this.sdk.privKey)
            }
        },
        async triggerLogin() {
            await this.sdk.login({
                loginProvider: "google",
                redirectUrl: "http://195.48.9.162:8080/#/torus/id:"
            });
            console.log("private key: ", this.sdk.privKey);
        },
        async triggerFastLogin() {
            await this.sdk.fastLogin( { redirectUrl: "http://195.48.9.162:8080/#/torus/id:"} ) 
        },
        console(text) {
            document.querySelector("#console>p").innerHTML = typeof text === "object" ? JSON.stringify(text) : text;
        },
        
    },

   
    watch: {
        async isMocked() {
        await this.init();
        }
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