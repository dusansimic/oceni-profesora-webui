<template>
	<div class="SearchProfesori">
		<b-alert :show="showErrorAlert" variant="danger" dismissible @dismissed="showErrorAlert=false" class="alert">
			{{ errorMessage }}
		</b-alert>
		<b-form @submit="onSubmit()">
			<b-form-group label="Ime:" label-for="imeInput">
				<b-form-input id="imeInput" type="text" v-model="queryData.ime" placeholder="Ime"></b-form-input>
			</b-form-group>
			<b-form-group label="Prezime:" label-for="prezimeInput">
				<b-form-input id="prezimeInput" type="text" v-model="queryData.prezime" placeholder="Prezime"></b-form-input>
			</b-form-group>
			<b-form-group label="Skola:" label-for="skolaInput">
				<b-form-input id="skolaInput" type="text" v-model="queryData.skola" placeholder="Skola"></b-form-input>
			</b-form-group>

			<b-button type="submit" variant="primary">Search</b-button>
			<b-button type="reset" variant="secondary" @click="onReset()">Reset</b-button>
		</b-form>
	</div>
</template>

<script>
export default {
	name: 'SearchProfesori',
	data () {
		return {
			queryData: {
				ime: '',
				prezime: '',
				skola: ''
			},
			listPorfesori: {

			},
			errorMessage: null,
			showErrorAlert: false
		}
	},
	methods: {
		onSubmit () {
			let query = {};
			
			if (this.queryData.ime !== '') {
				query.ime = this.queryData.ime;
			}
			if (this.queryData.prezime !== '') {
				query.prezime = this.queryData.prezime;
			}
			if (this.queryData.skole !== '') {
				query.skola = this.queryData.skola;
			}

			fetch('http://localhost:3000/api/queryProfesori', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(query)
			}).then(res => res.json()).then(data => {
				this.listPorfesori = JSON.parse(JSON.stringify(data));
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});

			this.onReset();

			return false;
		},
		onReset () {
			this.queryData = {
				ime: '',
				prezime: '',
				skola: ''
			};
		}
	}
}
</script>

<style>
.SearchProfesori {
  width: 500px;
  margin-left: calc((100% - 500px)/2);
}
.alert {
	width: 300px;
	margin-left: calc((100% - 300px)/2);
}
</style>
