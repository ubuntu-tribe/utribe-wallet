<template>
	<div class="p-grid p-fluid">
		
		<div class="p-col-12">
			<div class="card">
				<h5>My Profile</h5>
				<div class="p-fluid p-formgrid p-grid">
					<div class="p-field p-col-12 p-md-6">
						<label for="firstname2">Firstname</label>
						<InputText id="firstname2" type="text"/>
					</div>
					<div class="p-field p-col-12 p-md-6">
						<label for="lastname2">Lastname</label>
						<InputText id="lastname2" type="text"/>
					</div>
					<div class="p-field p-col-12">
						<label for="address">Address</label>
						<Textarea id="address" rows="4"/>
					</div>
					<div class="p-field p-col-12 p-md-6">
						<label for="city">City</label>
						<InputText id="city" type="text" />
					</div>
					<div class="p-field p-col-12 p-md-3">
						<label for="zip">Zip</label>
						<InputText id="zip" type="text"/>
					</div>
					<div class="p-field p-col-12 p-md-3">
						<label for="country">Country</label>
						<AutoComplete placeholder="Search" id="country" :dropdown="true"  v-model="selectedAutoValue" :suggestions="autoFilteredValue" @complete="searchCountry($event)" field="name"/>
					</div>
					<div class="p-col-12 p-md-12">
                    <Button @click="saveProfile" label="save" icon="pi pi-check" :loading="loading[0]" />
                    </div>
				</div>
			</div>
		</div>
		
	</div>
</template>
<script>
	import CountryService from '../service/CountryService';
	
	export default {
		data() {
			return {
				floatValue: null,
				autoValue: null,
				selectedAutoValue: null,
				autoFilteredValue: [],
				loading: [false],
				
			}
		},
		countryService: null,
		
		created() {
			this.countryService = new CountryService();
			
		},
		mounted() {
			this.countryService.getCountries().then(data => this.autoValue = data);
			
		},
		methods: {
			async saveProfile () {
            	//handle Button state
            	this.loading[0] = true;

			},
			searchCountry(event) {
				setTimeout(() => {
					if (!event.query.trim().length) {
						this.autoFilteredValue = [...this.autoValue];
					}
					else {
						this.autoFilteredValue = this.autoValue.filter((country) => {
							return country.name.toLowerCase().startsWith(event.query.toLowerCase());
						});
					}
				}, 250);
			}
		}
	}
</script>

<style scoped lang="scss">
	::v-deep(.p-multiselect) {
		min-width: 15rem;
	}
	::v-deep(.multiselect-custom-virtual-scroll .p-multiselect) {
		min-width: 20rem;
	}
	::v-deep(.multiselect-custom .p-multiselect-label) {
		padding-top: .25rem;
		padding-bottom: .25rem;
	}
	::v-deep(.multiselect-custom .country-item.country-item-value) {
		padding: .25rem .5rem;
		border-radius: 3px;
		display: inline-flex;
		margin-right: .5rem;
		background-color: var(--primary-color);
		color: var(--primary-color-text);
	}
	::v-deep(.multiselect-custom .country-item.country-item-value img.flag) {
		width: 17px;
	}
	.country-item {
		display: flex;
		align-items: center;
	}
	.country-item img.flag {
		width: 18px;
		margin-right: .5rem;
	}
	::v-deep(.multiselect-custom .country-placeholder) {
		padding: 0.25rem;
	}
	::v-deep(.p-chips .p-chips-token) {
		background-color: var(--primary-color);
		color: var(--primary-color-text);
	}
	::v-deep(.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token) {
		margin: 0.1rem 0.5rem 0.1rem 0;
	}
</style>