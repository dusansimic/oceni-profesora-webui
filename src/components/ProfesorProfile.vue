<template>
	<div class="ProfesorProfile">
		<b-alert :show="showErrorAlert" variant="danger" dismissible @dismissed="showErrorAlert=false" class="alert">
			{{ errorMessage }}
		</b-alert>

		<h2>{{ profesorData.ime }} {{ profesorData.prezime }}</h2>
		<p>JMBG: {{ profesorData.jmbg }}</p>
		<p v-if="profesorData.srednjaOcena">Srednja ocena: {{ profesorData.srednjaOcena }}</p>
		<router-link to="/profesori/search"><b-button type="button" variant="danger" v-on:click="deleteUser()">Delete user</b-button></router-link>

		<b-form @submit="onSubmitKomentar()" @reset="onResetKomentar()" v-if="this.$session.has('userData')">
			<b-form-group label="Tekst komentara:" label-for="textInput">
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
		</b-form><br/>
		<b-form @submit="onSubmitOcena()" @reset="onResetOcena()" v-if="this.$session.has('userData')">
			<b-form-group label="Ocena:" label-for="ocenaInput">
				<b-form-input id="ocenaInput" type="number" v-model="ocenaData.ocena" placeholder="1-5"></b-form-input>
			</b-form-group>

			<b-container>
				<b-row align-h="end">
					<b-col cols="4.5">
						<b-button type="reset" variant="secondary">Reset</b-button>
						<b-button type="submit" variant="primary">Oceni</b-button>
					</b-col>
				</b-row>
			</b-container>
		</b-form><br/>
		<h3>Komentari:</h3><br/>
		<ul id="listOfKomentari">
			<li v-for="komentar in komentari" v-bind:key="komentar._id">
				<b-card class="komentarCard">
					<p>{{ komentar.text }}</p>
					<p><i>by <strong>{{ komentar.user }}</strong> {{ getTimeFromNow(komentar.vreme) }}</i></p>
					<b-container>
						<b-row align-h="end">
							<b-col cols="4.5">
								<b-button type="button" variant="danger" @click="deleteKomentar(komentar._id)">Delete</b-button>
								<b-button-group>
									<b-button type="button" @click="onLike(true, komentar._id)" :disabled="komentar.liked[0] == 'true'" v-b-tooltip.hover :title="getNumberOfLikes(komentar, true)">Like</b-button>
									<b-button type="button" @click="onLike(false, komentar._id)" :disabled="komentar.disliked[0] == 'true'" v-b-tooltip.hover :title="getNumberOfLikes(komentar, false)">Dislike</b-button>
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

			fetch(`${this.$config.ApiUrl}/profesor?jmbg=${profesorJMBG}`, {
				method: 'GET'
			}).then(res => res.json()).then(data => {
				if (data.status > 399) {
					this.errorMessage = data.message
					this.showErrorAlert = true
				}
				this.profesorData = JSON.parse(JSON.stringify(data[0]));
				this.getKomentari();
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true
					this.errorMessage = err.message
				}
			});
		},
		getKomentari () {
			fetch(`${this.$config.ApiUrl}/komentar/${this.profesorData.jmbg}/${this.$session.get('userData').username}`, {
				method: 'GET'
			}).then(res => res.json()).then(data => {
				if (data.status > 399) {
					this.errorMessage = data.message
					this.showErrorAlert = true
				}
				this.komentari = JSON.parse(JSON.stringify(data.komentari));
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});
		},
		onSubmitKomentar () {
			fetch(`${this.$config.ApiUrl}/komentar/${this.profesorData.jmbg}`, {
				method: 'PUT',
				headers: new Headers({
					'Content-Type': 'application/json',
					'x-access-token': this.$session.get('userData').token
				}),
				body: JSON.stringify({
					user: this.$session.get('userData').username,
					text: this.komentarData.text,
					vreme: new Date(),
					likes: 0,
					liked: [],
					dislikes: 0,
					disliked: []
				})
			}).then(res => res.json()).then(data => {
				if (data.status > 399) {
					this.errorMessage = data.message
					this.showErrorAlert = true
				}
				this.onResetOcena()
				this.getKomentari()
				this.onResetOcena()
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			})
			return false;
		},
		onResetKomentar () {
			this.komentarData = {
				text: ''
			};

			return false;
		},
		onSubmitOcena () {
			fetch(`${this.$config.ApiUrl}/ocena/${this.profesorData.jmbg}`, {
				method: 'PUT',
				headers: new Headers({
					'Content-Type': 'application/json',
					'x-access-token': this.$session.get('userData').token
				}),
				body: JSON.stringify({
					ocena: parseInt(this.ocenaData.ocena)
				})
			}).then(res => res.json()).then(data => {
				if (data.status > 399) {
					this.errorMessage = data.message
					this.showErrorAlert = true
				}
				this.onResetOcena();
				fetch(`${this.$config.ApiUrl}/profesor?jmbg=${this.profesorData.jmbg}`, {
					method: 'GET'
				}).then(res => res.json()).then(data => {
					if (data.status > 399) {
						this.errorMessage = data.message
						this.showErrorAlert = true
					}
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
			fetch(`${this.$config.ApiUrl}/komentar/${(isLike ? 'like' : 'dislike')}/${this.profesorData.jmbg}/${komentarID}`, {
				method: 'PUT',
				headers: new Headers({
					'Content-Type': 'application/json',
					'x-access-token': this.$session.get('userData').token
				}),
				body: JSON.stringify({
					username: this.$session.get('userData').username
				})
			}).then(res => res.json()).then(data => {
				if (data.status > 399) {
					this.errorMessage = data.message
					this.showErrorAlert = true
				}
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
		},
		deleteUser () {
			fetch(`${this.$config.ApiUrl}/profesor/${this.profesorData.jmbg}`, {
				method: 'DELETE',
				headers: new Headers({
					'x-access-token': this.$session.get('userData').token
				})
			}).then(res => res.json()).then(data => {
				console.log(data);
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});
		},
		deleteKomentar (komentarID) {
			fetch(`${this.$config.ApiUrl}/komentar/${this.profesorData.jmbg}/${komentarID}`, {
				method: 'DELETE',
				headers: new Headers({
					'x-access-token': this.$session.get('userData').token
				})
			}).then(res => res.json()).then(data => {
				console.log(data);
				this.getKomentari();
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
		width: 95%;
		margin-left: calc((100% - 95%)/2);
	}
	#listOfKomentari {
		padding: 0;
		list-style-type: none;
		width: 100%;
		margin-left: 0;
		margin-top: 20px;
	}
}
</style>
