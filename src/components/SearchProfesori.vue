<template>
	<div class="SearchProfesori">
		<b-alert :show="showErrorAlert" variant="danger" dismissible @dismissed="showErrorAlert=false" class="alert">
			{{ errorMessage }}
		</b-alert>

		<b-button v-b-toggle.searchCollapse variant="priamry" @click="showSearch = !showSearch">Search for profesors</b-button>

		<b-collapse id="searchCollapse" class="mt-2" v-model="showSearch">
			<b-card>
				<b-form @submit="onSubmit()" @reset="onReset()">
					<b-form-group label="Ime:" label-for="imeInput">
						<b-form-input id="imeInput" type="text" v-model="queryData.ime" placeholder="Ime"></b-form-input>
					</b-form-group>
					<b-form-group label="Prezime:" label-for="prezimeInput">
						<b-form-input id="prezimeInput" type="text" v-model="queryData.prezime" placeholder="Prezime"></b-form-input>
					</b-form-group>
					<b-form-group label="Skola:" label-for="skolaInput">
						<b-form-input id="skolaInput" type="text" v-model="queryData.skola" placeholder="Skola"></b-form-input>
					</b-form-group>

					<b-container>
						<b-row align-h="end">
							<b-col cols="4.5">
								<b-button type="reset" variant="secondary">Reset</b-button>
								<b-button type="submit" variant="primary">Search</b-button>
							</b-col>
						</b-row>
					</b-container>
				</b-form>
			</b-card>
		</b-collapse>

		<ul id="listOfProfesori">
			<li v-for="profesor in listPorfesori" v-bind:key="profesor.jmbg">
				<b-card>
					<h3>{{ profesor.ime }} {{ profesor.prezime }}</h3>
					<p>JMBG: {{ profesor.jmbg }}</p>
					<router-link to="/profesori/profile"><p v-on:click="viewProfesor(profesor.jmbg)">Vidi profesora</p></router-link>
				</b-card>
			</li>
		</ul>
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
			listPorfesori: [],
			errorMessage: null,
			showErrorAlert: false,
			showSearch: false
		}
	},
	methods: {
		onSubmit () {
			let query = '';
			
			if (this.queryData.ime !== '') {
				query += 'ime=' + this.queryData.ime;
			}
			if (this.queryData.prezime !== '') {
				if (query != '') {
					query += '&';
				}
				query += 'prezime=' + this.queryData.prezime;
			}
			if (this.queryData.skola !== '') {
				if (!query.endsWith('&')) {
					query += '&';
				}
				query += 'skola=' + this.queryData.skola;
			}
			if (query !== '') {
				query = '?' + query;
			}

			fetch(`${this.$config.ApiUrl}/profesor${query}`, {
				method: 'GET'
			}).then(res => res.json()).then(data => {
				this.listPorfesori = JSON.parse(JSON.stringify(data));
			}).catch(err => {
				if (err) {
					this.showErrorAlert = true;
					this.errorMessage = err.message;
				}
			});

			this.onReset();

			this.showSearch = false;

			return false;
		},
		onReset () {
			this.queryData = {
				ime: '',
				prezime: '',
				skola: ''
			};
			
			return false;
		},
		viewProfesor (jmbg) {
			this.$session.set('profesorId', jmbg);
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
#listOfProfesori {
	padding: 0;
	list-style-type: none;
	width: 350px;
	margin-left: calc((100% - 350px)/2);
	margin-top: 20px;
}
#listOfProfesori li {
	margin-top: 10px;
}

@media screen and (max-width: 767px) {
	.SearchProfesori {
		width: 95%;
		margin-left: calc((100% - 95%)/2);
	}
	.alert {
		width: 100%;
		margin-left: 0;
	}
	#listOfProfesori {
		padding: 0;
		list-style-type: none;
		width: 100%;
		margin-left: 0;
		margin-top: 20px;
	}
	#listOfProfesori li {
		margin-top: 10px;
	}
}
</style>
