<template>
	<div class="ProfesorProfile">
		<b-alert :show="showErrorAlert" variant="danger" dismissible @dismissed="showErrorAlert=false" class="alert">
			{{ errorMessage }}
		</b-alert>

		<h2>{{ profesorData.ime }} {{ profesorData.prezime }}</h2>
		<p>JMBG: {{ profesorData.jmbg }}</p>
	</div>
</template>

<script>
export default {
	name: 'ProfesorProfile',
	data () {
		return {
			profesorData: {

			},
			showErrorAlert: false,
			errorMessage: ''
		}
	},
	methods: {
		whenCreated () {
			const profesorJMBG = this.$session.get('profesorId');
			this.$session.remove('profesorId');

			fetch('http://localhost:3000/api/queryProfesori', {
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
		}
	},
	created () {
		this.whenCreated();
	}
}
</script>
