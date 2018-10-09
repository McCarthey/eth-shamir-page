<template>
	<div class="sign-dialog__content">
		<div class="input-wrap">
			<p class="input-label">Nonce: </p>
			<input type="number"
			 class="sign-dialog__input"
			 v-model="config.nonce">
		</div>
		<div class="input-wrap">
			<p class="input-label">Gas Price: </p>
			<input type="number"
			 class="sign-dialog__input"
			 v-model="config.gasPrice">
		</div>
		<div class="input-wrap">
			<p class="input-label">Gas Limit: </p>
			<input type="number"
			 class="sign-dialog__input"
			 v-model="config.gasLimit">
		</div>
		<div class="input-wrap">
			<p class="input-label">To: </p>
			<input type="text"
			 class="sign-dialog__input"
			 v-model="config.to">
		</div>
		<div class="input-wrap">
			<p class="input-label">Value: </p>
			<input type="number"
			 class="sign-dialog__input"
			 v-model="config.value">
		</div>
		<div class="input-wrap">
			<p class="input-label">Data: </p>
			<input type="text"
			 class="sign-dialog__input"
			 v-model="config.data">
		</div>
		<button class="btn-sign"
		 @click="emitSign">Signature</button>
	</div>
</template>

<script>
	export default {
		name: 'SignForm',
		data() {
			return {
				config: {
					nonce: 0,
					gasPrice: 1100000000,
					gasLimit: 4000000,
					to: '',
					value: 0,
					data: ''
				}
			}
		},
		methods: {
			emitSign() {
				const data = this.config
				this.$emit('signData', data)
				this.config = {
					nonce: 0,
					gasPrice: 1100000000,
					gasLimit: 4000000,
					to: '',
					value: 0,
					data: ''
				}
			}
		}
	}
</script>

<style scoped>
	.input-wrap {
	    display: flex;
	    margin: 10px;
	}
	.input-label {
	    width: 100px;
	    text-align: left;
	}
	.sign-dialog__input {
	    margin: 0;
	    width: 380px;
	}
	.btn-sign {
	    margin-top: 20px;
	    width: 192px;
	    background-color: #e6a23c;
	}
	.btn-sign:hover {
	    background-color: rgb(190, 130, 39);
	}
</style>


