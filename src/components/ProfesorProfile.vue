<template>
	<div class="ProfesorProfile">
		<b-alert :show="showErrorAlert" variant="danger" dismissible @dismissed="showErrorAlert=false" class="alert">
			{{ errorMessage }}
		</b-alert>

		<h2>{{ profesorData.ime }} {{ profesorData.prezime }}</h2>
		<p>JMBG: {{ profesorData.jmbg }}</p>
		<p v-if="profesorData.srednjaOcena">Srednja ocena: {{ profesorData.srednjaOcena }}</p>

		<b-form @submit="onSubmitKomentar()" @reset="onResetKomentar()">
			<b-form-group label="Ime:" label-for="imeInput">
				<b-form-input id="imeInput" type="text" v-model="komentarData.user" placeholder="User"></b-form-input>
			</b-form-group>
			<b-form-group>
				<b-form-textarea id="textInput" v-model="komentarData.text" placeholder="Text" :rows="3" :max-rows="6"></b-form-textarea>
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
		<b-form @submit="onSubmitOcena()" @reset="onResetOcena()">
			<b-form-group label="Ocena:" label-for="ocenaInput">
				<b-form-input id="ocenaInput" type="number" v-model="ocenaData.ocena" placeholder="1-5"></b-form-input>
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
			<li v-for="komentar in komentari" v-bind:key="komentar.user">
				<b-card class="komentarCard">
					<p>{{ komentar.text }}</p>
					<p><i>by <strong>{{ komentar.user }}</strong> {{ getTimeFromNow(komentar.vreme) }}</i></p>
					<b-container>
						<b-row align-h="end">
							<b-col cols="4.5">
								<b-button-group>
									<b-button type="button" @click="onLike(true, komentar._id)" v-b-tooltip.hover :title="getNumberOfLikes(komentar, true)">Like</b-button>
									<b-button type="button" @click="onLike(false, komentar._id)" v-b-tooltip.hover :title="getNumberOfLikes(komentar, false)">Dislike</b-button>
								</b-button-group>
							</b-col>
						</b-row>
					</b-container>
				</b-card>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'ProfesorProfile',
	data () {
		return {
			profesorData: {},
			komentarData: {
				user: '',
				text: ''
			},
			ocenaData: {
				ocena: null
			},
			komentari: [],
			showErrorAlert: false,
			errorMessage: ''
		}
	},
	methods: {
		whenCreated () {
			const profesorJMBG = this.$session.get('profesorId');

			fetch(this.$config.ApiUrl + '/queryProfesori?jmbg=' + profesorJMBG, {
				method: 'GET',
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			}).then(res => res.json()).then(data => {
				this.profesorData = JSON.parse(JSON.stringify(data[0]));
				this.getKomentari();
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});
		},
		getKomentari () {
			fetch(this.$config.ApiUrl + '/getKomentari/fromProfesor/' + this.profesorData.jmbg, {
				method: 'GET',
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			}).then(res => res.json()).then(data => {
				this.komentari = JSON.parse(JSON.stringify(data[0].komentari));
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});
		},
		onSubmitKomentar () {
			fetch(this.$config.ApiUrl + '/addKomentar/' + this.profesorData.jmbg, {
				method: 'PUT',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					user: this.komentarData.user,
					text: this.komentarData.text,
					ocena: this.komentarData.ocena,
					vreme: new Date(),
					likes: 0,
					dislikes: 0
				})
			}).then(res => res.json()).then(data => {
				this.onResetOcena();
				this.getKomentari();
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});

			return false;
		},
		onResetKomentar () {
			this.komentarData = {
				user: '',
				text: ''
			};

			return false;
		},
		onSubmitOcena () {
			fetch(this.$config.ApiUrl + '/addOcena/' + this.profesorData.jmbg, {
				method: 'PUT',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					ocena: parseInt(this.ocenaData.ocena)
				})
			}).then(res => res.json()).then(data => {
				this.onResetOcena();
				fetch(this.$config.ApiUrl + '/queryProfesori?jmbg=' + this.profesorData.jmbg, {
					method: 'GET',
					headers: new Headers({
						'Content-Type': 'application/json'
					})
				}).then(res => res.json()).then(data => {
					this.profesorData = JSON.parse(JSON.stringify(data[0]));
				}).catch(err => {
					if (err) {
						this.showErrorAlert = true;
						this.errorMessage = err.message;
					}
				});
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});
		},
		onResetOcena () {
			this.ocenaData = {
				ocena: null
			};

			return false;
		},
		getTimeFromNow (time) {
			return this.$moment(time).fromNow();
		},
		onLike (isLike, komentarID) {
			fetch(this.$config.ApiUrl + '/' + (isLike ? 'likeKomentar' : 'dislikeKomentar') + '/' + this.profesorData.jmbg + '/' + komentarID, {
				method: 'PUT',
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			}).then(res => res.json()).then(data => {
				this.getKomentari();
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});
		},
		getNumberOfLikes (komentar, isLike) {
			if (isLike) {
				return komentar.likes + ((komentar.likes == 1) ? ' like' : ' likes');
			}

			return komentar.dislikes + ((komentar.dislikes == 1) ? ' dislike' : ' dislikes');
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
#listOfKomentari {
	padding: 0;
	list-style-type: none;
	width: 350px;
	margin-left: calc((100% - 350px)/2);
	margin-top: 20px;
}
.komentarCard {
	margin-top: 10px;
}

@media screen and (max-width: 767px) {
	.ProfesorProfile {
		width: 90%;
		margin-left: calc((100% - 90%)/2);
	}
	#listOfKomentari {
		padding: 0;
		list-style-type: none;
		width: 85%;
		margin-left: calc((100% - 85%)/2);
		margin-top: 20px;
	}
}
</style>
