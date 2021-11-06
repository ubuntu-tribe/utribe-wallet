<template>
    <div class="layout-dashboard">
       
        <div class="p-grid">

             <div class="p-col-12 p-md-6 p-xl-6">
                <div class="card no-gutter widget-overview-box widget-overview-box-1">
                    <span class="overview-icon">
                        <i class="pi pi-wallet"></i>
                    </span>
                    <span class="overview-title">My Account</span>
                     
                    <div class="p-grid overview-detail text-left">
                        <div class="p-col-12">
                            <div class="overview-number">{{balance}}</div>
                            <Chip icon="pi pi-check" > {{address}}</Chip>
                            
                        </div>
                    </div>
                </div>
            </div>
           
            <div class="p-col-12 p-md-6 p-xl-6">
                <div class="card no-gutter widget-overview-box widget-overview-box-3">
                    <span class="overview-icon">
                        <i class="pi pi-wallet"></i>
                    </span>
                    <span class="overview-title">Receiving Account</span>
                     
                    <div class="p-grid overview-detail text-left">
                        <div class="p-col-12">
                            <div class="overview-number">{{balancereceiver}}</div>
                            <div class="person-subtext"><Chip icon="pi pi-check" >{{addressreceiver}}</Chip></div>
                            
                        </div>
                    </div>
                </div>
            </div>

            
             <div class="p-col-12 p-md-6 p-xl-6">
                <div class="card no-gutter widget-overview-box widget-overview-box-2">
                    <span class="overview-icon">
                        <i class="pi pi-wallet"></i>
                    </span>
                    <span class="overview-title">Send</span>
                     
                    
                     <div class="p-col-12 p-md-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                    <i class="pi pi-user"></i>
                            </span>
                            <InputText placeholder="utribe13v8gktej55gxdknzff3359rhvpzwt75jqawh8f" value="utribe13v8gktej55gxdknzff3359rhvpzwt75jqawh8f" id="toadr" name="toadr" />
                        </div>
                    </div>

                    <div class="p-col-12 p-md-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">$</span>
                            <InputText placeholder="amount" id="amount" name="amount" />
                            <span class="p-inputgroup-addon">.00</span>
                        </div>
                    </div>
                     <div class="p-col-12 p-md-12">
                    <Button @click="sendCoins" label="send" icon="pi pi-check" :loading="isLoading" />
                    </div>
                </div>
            </div>

       
           


            <div class="p-col-12 p-lg-8">

                <div class="card">
                    <h4>Recent Transactions</h4>
                    <p>summary of transaction</p>
                    <ul class="widget-person-list">
                        <li>
                            <div class="person-item">
                                <img src="assets/demo/images/avatar/amyelsner.png" alt="diamond-layout" />
                                <div class="person-info">
                                    <div class="person-name">Amy Elsner</div>
                                    <div class="person-subtext">Accounting</div>
                                </div>
                            </div>
                            <div class="person-actions">
                                <Button class="p-button-rounded p-button-success" icon="pi pi-envelope"></Button>
                                <Button class="p-button-rounded p-button-warning" icon="pi pi-cog"></Button>
                            </div>
                        </li>
                        <li>
                            <div class="person-item">
                                <img src="assets/demo/images/avatar/annafali.png" alt="diamond-layout" />
                                <div class="person-info">
                                    <div class="person-name">Anna Fali</div>
                                    <div class="person-subtext">Procurement</div>
                                </div>
                            </div>
                            <div class="person-actions">
                                <Button class="p-button-rounded p-button-success" icon="pi pi-envelope"></Button>
                                <Button class="p-button-rounded p-button-warning" icon="pi pi-cog"></Button>
                            </div>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductService from '../service/ProductService';
//Cosmos
import { coin, coins, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto"; //custom adress prefix

export default {
    data() {
        return {
            selectedOrderWeek: null,
            products: null,
            address: null,
            addressreceiver: null,
            balance: null,
            balancereceiver: null,
            newbalance: null,
           
        };
    },
     async mounted () {
     
      //Wallet
      const mnemonic = "fly junk spawn frog ski pyramid zero buddy asthma normal birth pride riot verify ketchup car thank regular stick piece miss modify flee aim";
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic( mnemonic, { prefix: "utribe" } );
      const [firstAccount] = await wallet.getAccounts();
      this.address = firstAccount.address
      const rpcEndpoint = "http://195.48.9.150:26657";
      //client
      const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);
     
      // get balance sender
      const before = await client.getBalance(firstAccount.address, "token");  
      this.balance = before.amount + " " + before.denom
    

    },
    methods: {
        async sendCoins () {
             // set receiver
            //const recipient = "utribe13v8gktej55gxdknzff3359rhvpzwt75jqawh8f" ; //bob
            const recipient = document.getElementById('toadr').value
            this.addressreceiver = recipient;
            console.log(recipient);

            //Wallet
            const mnemonic = "fly junk spawn frog ski pyramid zero buddy asthma normal birth pride riot verify ketchup car thank regular stick piece miss modify flee aim";
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic( mnemonic, { prefix: "utribe" } );
            const [firstAccount] = await wallet.getAccounts();
            this.address = firstAccount.address
            const rpcEndpoint = "http://195.48.9.150:26657";
            //client
            const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);
            //TX
            const amount = coins(10, "token");
            const memo = "test transaction"
            const fee = {
                amount: [
                {
                    denom: "token",
                    amount: "2",
                },
                ],
                gas: "180000", // 180k
            };

            //Send TX
            const result = await client.sendTokens( firstAccount.address, recipient, amount, fee, memo);
            //assertIsBroadcastTxSuccess(result);

            // get balance sender
            const before = await client.getBalance(firstAccount.address, "token");  
            this.balance = before.amount + " " + before.denom

      
        },

        menuToggle($event) {
            this.$refs.menu.toggle($event);
        },

        refreshDataset($event) {
            this.$refs.chart.reinit($event);
        },

        formatCurrency(value) {
            return value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            });
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