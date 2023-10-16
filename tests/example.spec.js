import {describe, it, expect} from 'vitest'

import {mount} from '@vue/test-utils'
import App from '@/App.vue'

import "fake-indexeddb/auto";
import Dexie from 'dexie';

Dexie.dependencies.indexedDB = indexedDB;
Dexie.dependencies.IDBKeyRange = IDBKeyRange;

describe('App.vue', () => {
    it('Render Login: ', () => {
        const wrapper = mount(App)
        expect(wrapper.text()).toBe('Enter Username and Press Enter')
    }),
    it.skip('Render ChatBox', async () => {
        // can't setup index db for testing yet
        const wrapper = mount(App)
        await wrapper.find('input').setValue('Lin')
        await wrapper.find('input').trigger('keydown.enter')
        expect(wrapper.text()).contain('Lin')
    })
})