<template>
	<div class="AddProfesor">
		<b-alert :show="showOkAlert" dismissible variant="success" @dismissed="showOkAlert=false">
			{{ okMessage }}
		</b-alert>
		<b-form @submit="onSubmit()" @reset="onReset()">
			<b-form-group label="Ime:" label-for="imeInput">
				<b-form-input id="imeInput" type="text" v-model="profesorData.ime" required placeholder="Ime"></b-form-input>
			</b-form-group>
			<b-form-group label="Prezime:" label-for="prezimeInput">
				<b-form-input id="prezimeInput" type="text" v-model="profesorData.prezime" required placeholder="Prezime"></b-form-input>
			</b-form-group>
			<b-form-group label="JMBG:" label-for="jmbgInput">
				<b-form-input id="jmbgInput" type="number" v-model="profesorData.jmbg" required placeholder="JMBG"></b-form-input>
			</b-form-group>

			<b-container>
				<b-row align-h="end">
					<b-col cols="4.5">
						<b-button type="reset" variant="secondary">Reset</b-button>
						<b-button type="submit" variant="primary">Add</b-button>
					</b-col>
				</b-row>
			</b-container>
		</b-form>
	</div>
</template>

<script>
export default {
	name: 'AddProfesor',
	data () {
		return {
			profesorData: {
				ime: '',
				prezime: '',
				jmbg: '',
				skole: [],
				komentari: []
			},
			okMessage: '',
			showOkAlert: false,
			errorMessage: '',
			showErrorAlert: false
		}
	},
	methods: {
		onSubmit () {
			fetch(this.$config.ApiUrl + '/addProfesor', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(this.profesorData)
			}).then(res => res.json()).then(data => {
				if (data.insertedCount === 1) {
					this.showOkAlert = true;
					this.okMessage = 'Profesor je dodat!';
				} else {
					this.showErrorAlert = true;
					this.errorMessage = 'Something went terrebly wrong!';
				}
			}).catch(err => {
				this.showErrorAlert = true;
				this.errorMessage = err.message;
			});

			this.onReset();

			return false;
		},
		onReset () {
			this.profesorData = {
				ime: '',
				prezime: '',
				jmbg: '',
				skole: [],
				komentari: []
			};

			return false;
		}
	}
}
</script>

<style>
.AddProfesor {
  width: 500px;
  margin-left: calc((100% - 500px)/2);
}

@media screen and (max-width: 767px) {
	.AddProfesor {
		width: 90%;
		margin-left: calc((100% - 90%)/2);
	}
}
</style>
