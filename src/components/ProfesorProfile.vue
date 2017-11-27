<template>
	<div class="ProfesorProfile">
		<b-alert :show="showErrorAlert" variant="danger" dismissible @dismissed="showErrorAlert=false" class="alert">
			{{ errorMessage }}
		</b-alert>

		<h2>{{ profesorData.ime }} {{ profesorData.prezime }}</h2>
		<p>JMBG: {{ profesorData.jmbg }}</p>

		<b-form @submit="onSubmit()" @reset="onReset()">
			<b-form-group label="Ime:" label-for="imeInput">
				<b-form-input id="imeInput" type="text" v-model="komentarData.user" placeholder="User"></b-form-input>
			</b-form-group>
			<b-form-group>
				<b-form-textarea id="textInput" v-model="komentarData.text" placeholder="Text" :rows="3"></b-form-textarea>
			</b-form-group>
			<b-form-group label="Ocena:" label-for="ocenaInput">
				<b-form-input id="ocenaInput" type="number" v-model="komentarData.ocena" placeholder="1-5"></b-form-input>
			</b-form-group>

			<b-container>
						<b-row align-h="end">
							<b-col cols="4.5">
								<b-button type="reset" variant="secondary">Reset</b-button>
								<b-button type="submit" variant="primary">Comment</b-button>
							</b-col>
						</b-row>
					</b-container>
		</b-form></br>
		<h3>Komentari:</h3></br>
		<ul id="listOfKomentari">

		</ul>
	</div>
</template>

<script>
export default {
	name: 'ProfesorProfile',
	data () {
		return {
			profesorData: {

			},
			komentarData: {
				user: '',
				text: '',
				ocena: null
			},
			showErrorAlert: false,
			errorMessage: ''
		}
	},
	methods: {
		whenCreated () {
			const profesorJMBG = this.$session.get('profesorId');
			this.$session.remove('profesorId');

			fetch(this.$config.ApiUrl + '/queryProfesori', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					jmbg: profesorJMBG
				})
			}).then(res => res.json()).then(data => {
				this.profesorData = JSON.parse(JSON.stringify(data))[0];
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});
		},
		onSubmit () {
			fetch('')
		}
	},
	created () {
		this.whenCreated();
	}
}
</script>

<style>
.ProfesorProfile {
	width: 700px;
	margin-left: calc((100% - 700px)/2);
}

@media screen and (max-width: 767px) {
	.ProfesorProfile {
		width: 90%;
		margin-left: calc((100% - 90%)/2);
	}
}
</style>
