import Vue from 'vue'
import Config from '@/config.json'

describe('Home.vue', () => {
	it('should render correct contents', () => {
		expect(Config.ApiUrl)
			.toEqual('http://localhost/api')
	})
})