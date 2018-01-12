<template>
	<div class="Register">
		<b-alert :show="showErrorAlert" variant="danger" dismissible @dismissed="showErrorAlert=false" class="alert">
			{{ errorMessage }}
		</b-alert>

		<b-card id="registerForm">
			<b-form @submit="onSubmit()">
				<b-form-group label="Korisinik:" label-for="usernameInput">
					<b-form-input id="usernameInput" type="text" v-model="registrationData.username" placeholder="Korisnik"></b-form-input>
				</b-form-group>
				<b-form-group label="Lozinka:" label-for="password1Input">
					<b-form-input id="password1Input" type="password" v-model="registrationData.password1" placeholder="Lozinka"></b-form-input>
				</b-form-group>
				<b-form-group label="Ponovi lozinku:" label-for="password2Input">
					<b-form-input id="password2Input" type="password" v-model="registrationData.password2" placeholder="Lozinka" :state="registrationData.password2State"></b-form-input>
					<b-form-invalid-feedback id="inputLiveFeedback">Passwords don't match</b-form-invalid-feedback>
				</b-form-group>

				<b-container>
						<b-row align-h="end">
							<b-col cols="4.5">
								<b-button type="submit" variant="primary">Register</b-button>
							</b-col>
						</b-row>
					</b-container>
			</b-form>
		</b-card>
	</div>
</template>

<script>
export default {
	name: 'Register',
	data () {
		return {
			registrationData: {
				username: '',
				password1: '',
				password2: '',
				password2State: null,
				hashedPassword: ''
			},
			showErrorAlert: false,
			errorMessage: ''
		}
	},
	methods: {
		checkPassword () {
			if (this.registrationData.password1 !== this.registrationData.password2) {
				this.registrationData.password2State = false
				return false
			}
			this.registrationData.password2State = null
			return true
		},
		hashPassword () {
			this.registrationData.hashedPassword = this.$sha256(this.registrationData.password1)
		},
		onSubmit () {
			if (!this.checkPassword()) return
			this.hashPassword()
			console.log(this.registrationData.hashedPassword)
			fetch(`${this.$config.ApiUrl}/user`, {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					username: this.registrationData.username,
					passwordHash: this.registrationData.hashedPassword
				})
			}).then(res => res.json()).then(data => {
				if (data.ok) {
					console.log('A okay.')
				} else {
					console.log('Not okay.')
				}
				if (data.status > 399) {
					this.errorMessage = data.message
					this.showErrorAlert = true
				}
			}).catch(err => {
				console.log('in err')
				console.error(err)
				this.errorMessage = err.message
				this.showErrorAlert = true
			})
		}
	}
}
</script>

<style>
#registerForm {
	width: 500px;
	margin-left: calc((100% - 500px)/2);
}

@media screen and (max-width: 767px) {
	.Register {
		width: 95%;
		margin-left: calc((100% - 95%)/2);
	}
	#registerForm {
		width: 95%;
		margin-left: calc((100% - 95%)/2);
	}
}
</style>
