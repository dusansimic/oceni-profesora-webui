<template>
	<div class="Login">
		<notifications id="notificationGroup" group="login" position="bottom center" animation-type="css">
			<template slot="body" slot-scope="props">
				<b-alert show :variant="props.item.type">
					<h4>{{ props.item.title }}</h4>
					<p>{{ props.item.text }}</p>
				</b-alert>
			</template>
		</notifications>

		<b-container>
			<b-row align-v="center">
				<b-col>
					<b-card id="loginForm">
						<b-form @submit="onSubmit()">
							<b-form-group label="Korisinik:" label-for="usernameInput">
								<b-form-input id="usernameInput" type="text" v-model="loginData.username" placeholder="Korisnik" :state="loginData.usernameState"></b-form-input>
								<b-form-invalid-feedback id="inputLiveFeedback">Username is incorrect</b-form-invalid-feedback>
							</b-form-group>
							<b-form-group label="Lozinka:" label-for="passwordInput">
								<b-form-input id="passwordInput" type="password" v-model="loginData.password" placeholder="Lozinka" :state="loginData.passwordState"></b-form-input>
								<b-form-invalid-feedback id="inputLiveFeedback">Password is incorrect</b-form-invalid-feedback>
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
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data () {
		return {
			loginData: {
				username: '',
				usernameState: null,
				password: '',
				passwordState: null,
				hashedPassword: ''
			},
			showErrorAlert: false,
			errorMessage: '',
			showOkAlert: false,
			okMessage: ''
		}
	},
	methods: {
		hashPassword () {
			this.loginData.hashedPassword = this.$sha256(this.loginData.password)
		},
		onSubmit () {
			this.hashPassword()
			this.loginData.usernameState = null
			this.loginData.passwordState = null
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
					this.$forceUpdate(),
					this.$router.push({ name: 'Home' })
				} else if (data.status > 399) {
					this.$notify({
						group: 'login',
						title: 'Login failed',
						text: data.message,
						type: 'danger',
						duration: 8000
					})
					if (data.message === 'User with that username was not found!') {
						this.loginData.usernameState = false
					}
					if (data.message === 'Password was incorrect!') {
						this.loginData.passwordState = false
					}
				}
				console.log(data)
			}).catch(err => {
				this.errorMessage = err.message
				this.showErrorAlert = true
			})
		}
	}
}
</script>

<style>
.Login {
	height: calc(100vh - 76px);
}
#loginContainer {
	height: 100%;
}
#loginForm {
	width: 500px;
	margin-left: calc((100% - 500px)/2);
}
.alert {
	width: 250px;
	margin-left: calc((100% - 250px)/2);
}

@media screen and (max-width: 767px) {
	.Login {
		width: 95%;
		margin-left: calc((100% - 95%)/2);
	}
	#loginForm {
		width: 100%;
		margin-left: 0;
	}
	.alert {
		width: 100%;
		margin-left: 0;
	}
}
</style>
