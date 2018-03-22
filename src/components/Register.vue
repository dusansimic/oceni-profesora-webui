<template>
	<div class="Register">
		<notifications id="notificationGroup" group="registration" position="bottom center" animation-type="css">
			<template slot="body" slot-scope="props">
				<b-alert show :variant="props.item.type">
					<h4>{{ props.item.title }}</h4>
					<p>{{ props.item.text }}</p>
				</b-alert>
			</template>
		</notifications>

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
			}
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
					this.$notify({
						group: 'registration',
						title: 'Registration successful',
						text: 'The registration was successful. Please login now.',
						type: 'success',
						duration: 8000
					})
				} else if (data.status > 399) {
					this.$notify({
						group: 'registration',
						title: 'Registration failed',
						text: data.message,
						type: 'danger',
						duration: 8000
					})
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
#notificationGroup {
	margin-bottom: 10px;
	margin-right: 10px;
}

@media screen and (max-width: 767px) {
	.Register {
		width: 95%;
		margin-left: calc((100% - 95%)/2);
	}
	#registerForm {
		width: 100%;
		margin-left: 0;
	}
}
</style>
