<template>
	<div class="AddProfesor">
		<notifications id="notificationGroup" group="addProfesor" position="bottom center" animation-type="css">
			<template slot="body" slot-scope="props">
				<b-alert show :variant="props.item.type">
					<h4>{{ props.item.title }}</h4>
					<p v-if="props.item.text">{{ props.item.text }}</p>
				</b-alert>
			</template>
		</notifications>

		<b-form @submit="onSubmit()" @reset="onReset()">
			<b-form-group label="Ime:" label-for="imeInput">
				<b-form-input id="imeInput" type="text" v-model="profesorData.ime" required placeholder="Ime" :state="profesorDataStates.imeState"></b-form-input>
				<b-form-invalid-feedback id="inputLiveFeedback">Morate uneti ime profesora</b-form-invalid-feedback>
			</b-form-group>
			<b-form-group label="Prezime:" label-for="prezimeInput">
				<b-form-input id="prezimeInput" type="text" v-model="profesorData.prezime" required placeholder="Prezime" :state="profesorDataStates.prezimeState"></b-form-input>
				<b-form-invalid-feedback id="inputLiveFeedback">Morate uneti prezime profesora</b-form-invalid-feedback>
			</b-form-group>
			<b-form-group label="JMBG:" label-for="jmbgInput">
				<b-form-input id="jmbgInput" type="number" v-model="profesorData.jmbg" required placeholder="JMBG" :state="profesorDataStates.jmbgState"></b-form-input>
				<b-form-invalid-feedback id="inputLiveFeedback">Morate uneti validan JMBG</b-form-invalid-feedback>
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
				komentari: [],
				ocene: []
			},
			profesorDataStates: {
				imeState: null,
				prezimeState: null,
				jmbgState: null
			}
		}
	},
	methods: {
		checkData () {
			this.profesorDataStates.imeState = !!this.profesorData.ime
			this.profesorDataStates.prezimeState = !!this.profesorData.prezime
			this.profesorDataStates.jmbgState = (this.profesorData.jmbg.length === 13)
			return this.profesorDataStates.imeState && this.profesorDataStates.prezimeState && this.profesorDataStates.jmbgState
		},
		onSubmit () {
			if (!this.checkData()) return
			fetch(`${this.$config.ApiUrl}/profesor`, {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(this.profesorData)
			}).then(res => res.json()).then(data => {
				if (data !== null) {
					this.$notify({
						group: 'addProfesor',
						title: 'Profesor je dodat!',
						type: 'success',
						duration: 8000
					})
				} else {
					this.$notify({
						group: 'addProfesor',
						title: 'Dodavanje neuspesno',
						text: data.message,
						type: 'danger',
						duration: 8000
					})
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
				komentari: [],
				ocene: []
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
