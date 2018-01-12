<template>
	<div class="Login">
		<b-alert :show="showErrorAlert" variant="danger" dismissible @dismissed="showErrorAlert=false" class="alert">
			{{ errorMessage }}
		</b-alert>

		<b-card id="loginForm">
			<b-form @submit="onSubmit()">
				<b-form-group label="Korisinik:" label-for="usernameInput">
					<b-form-input id="usernameInput" type="text" v-model="loginData.username" placeholder="Korisnik"></b-form-input>
				</b-form-group>
				<b-form-group label="Lozinka:" label-for="passwordInput">
					<b-form-input id="passwordInput" type="password" v-model="loginData.password" placeholder="Lozinka"></b-form-input>
				</b-form-group>

				<b-container>
						<b-row align-h="end">
							<b-col cols="4.5">
								<b-button type="submit" variant="primary">Login</b-button>
							</b-col>
						</b-row>
					</b-container>
			</b-form>
		</b-card>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data () {
		return {
			loginData: {
				username: '',
				password: '',
				hashedPassword: ''
			},
			showErrorAlert: false,
			errorMessage: ''
		}
	},
	methods: {
		hashPassword () {
			this.loginData.hashedPassword = this.$sha256(this.loginData.password)
		},
		onSubmit () {
			this.hashPassword()
			fetch(`${this.$config.ApiUrl}/user/auth`, {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					username: this.loginData.username,
					passwordHash: this.loginData.hashedPassword
				})
			}).then(res => res.json()).then(data => {
				if (data.ok) {
					this.$session.set('userData', {
						username: this.loginData.username,
						token: data.token
					})
					this.$forceUpdate()
				}
				if (data.status > 399) {
					this.errorMessage = data.message
					this.showErrorAlert = true
				}
			}).catch(err => {
				this.errorMessage = err.message
				this.showErrorAlert = true
			})
		}
	}
}
</script>

<style>
#loginForm {
	width: 500px;
	margin-left: calc((100% - 500px)/2);
}

@media screen and (max-width: 767px) {
	.Login {
		width: 95%;
		margin-left: calc((100% - 95%)/2);
	}
	#loginForm {
		width: 95%;
		margin-left: calc((100% - 95%)/2);
	}
}
</style>
