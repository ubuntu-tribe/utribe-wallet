<template>
<transition-group name="p-message" tag="div">
    <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id" :life="3000" :sticky="false">{{msg.content}}</Message>
</transition-group>

    <div class="layout-dashboard">
       
        <div class="p-grid">

             <div class="p-col-12 p-md-6 p-xl-6">

                <div class="card no-gutter widget-overview-box widget-overview-box-1">
                    <span class="overview-icon">
                        <i class="pi pi-wallet"></i>
                    </span>
                    <span class="overview-title">My Account</span>
                     
                    <div class="p-grid overview-detail">
                        <div class="p-col-12">
                            <div class="overview-number">{{balance}} GIFT</div>
                        </div>
                    </div>
                    <div class="p-col-12 p-md-12">
                        <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                        <i class="pi pi-credit-card"></i>
                                </span>
                                <InputText id="myaddress" placeholder="Your Address" />
                        </div>
                    </div>
                </div>

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
                    <Button @click="sendCoins" label="send" icon="pi pi-check" :loading="loading[0]" />
                    </div>
                </div>


            </div>
           
            <div class="p-col-12 p-md-6 p-xl-6">
                
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

const rpcEndpoint = "http://195.48.9.150:26657";

export default {
    data() {
        return {
            messages: [],
            count: 0,
            selectedOrderWeek: null,
            products: null,
            address: null,
            addressreceiver: null,
            balance: null,
            balancereceiver: null,
            newbalance: null,
            mnemonic: null,
            wallet: null,
            //Buttons
            loading: [false],
           
        };
    },
     async mounted () {
     
      //Wallet
      this.mnemonic = "fly junk spawn frog ski pyramid zero buddy asthma normal birth pride riot verify ketchup car thank regular stick piece miss modify flee aim";
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic( this.mnemonic, { prefix: "utribe" } );
      const [firstAccount] = await wallet.getAccounts();
      this.address = firstAccount.address
      document.getElementById('myaddress').value=this.address;
      //client
      const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet)
     
      // get balance sender
      const before = await client.getBalance(firstAccount.address, "token")
      this.balance = before.amount
    

    },
    methods: {
        async sendCoins () {
            //handle Button state
            this.loading[0] = true;

             // set receiver
            //const recipient = "utribe13v8gktej55gxdknzff3359rhvpzwt75jqawh8f" ; //bob
            const recipient = document.getElementById('toadr').value
            this.addressreceiver = recipient;

            //amount
            const amount = Number(document.getElementById('amount').value)
            console.log(amount+" - "+this.balance)
            
            if(isNaN(amount)){
                console.log("nan");
                this.messages = [ {severity: 'warn', content: 'Value not valid must be a number', id: this.count++} ]
            } else if(amount > this.balance) {
                console.log("to mutch");
                this.messages = [ {severity: 'warn', content: 'Your balance is not sufficient', id: this.count++} ]
            } else {
                
                this.wallet = await DirectSecp256k1HdWallet.fromMnemonic( this.mnemonic, { prefix: "utribe" } );
                
                //client
                const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, this.wallet);
                //TX
                const sendamount = coins(amount, "token");
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
                const result = await client.sendTokens( this.address, recipient, sendamount, fee, memo);
                //const broadcastresult = ;
                console.log(result);
                // get balance sender
                const before = await client.getBalance(this.address, "token");  
                this.balance = before.amount

                this.messages = [ {severity: 'success', content: 'Transaction successfully', id: this.count++} ]
                this.loading[0] = false;
            }
            

      
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