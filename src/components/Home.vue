<template>
	<div class="Home">
		<h1 v-if="!username">Hello world</h1>
		<h1 v-if="username"> Hello {{ username }}</h1>
		<p v-if="username" id="tokenText">{{ token }}</p>
	</div>
</template>

<script>
export default {
	name: 'Home',
	data () {
		return {
			username: null,
			token: null
		}
	},
	methods: {
		onLoad () {
			if (this.$session.has('userData')) {
				this.username = this.$session.get('userData').username
				this.token = this.$session.get('userData').token;
			}
		}
	},
	created () {
		this.onLoad()
	}
}
</script>

<style>
#tokenText {
	width: 500px;
	margin-left: calc((100% - 500px)/2);
	word-wrap: break-word;
}

@media screen and (max-width: 767px) {
	#tokenText {
		width: 95%;
		margin-left: calc((100% - 95%)/2);
		word-wrap: break-word;
	}
}
</style>
