import { embed } from '../util.js';
import { score } from '../score.js';
import { fetchList, fetchRecords } from '../content.js';
import { store } from '../main.js';

import Spinner from '../components/Spinner.js';
import LevelAuthors from '../components/List/LevelAuthors.js';

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 75" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg" style="opacity: 0.5">#{{ i + 1 }}</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i }" @click="selected = i">
                            <button :class="{ 'type-label-lg': selected == i, 'type-body-lg': selected != i }">
                                {{ level?.name || \`Error (\${err}.json)\` }}
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div v-if="!list || !list[selected]" class="level-placeholder">
                    <p class="type-body-lg">No levels found.</p>
                </div>
                <div v-else-if="list[selected][1]" class="level-placeholder">
                    <p class="type-body-lg">Failed to load level \`{{ list[selected][1] }}.json\`.</p>
                </div>
                <div v-else class="level" v-with="level = list[selected][0]">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :verifier="level.verifier"></LevelAuthors>
                    <div class="tabs">
                        <button class="tab-type-label-lg" :class="{ 'active': tab == 0 }" @click="tab = 0">Video</button>
                        <button class="tab-type-label-lg" :class="{ 'active': tab == 1 }" @click="tab = 1">Records ({{ records.length }})</button>
                    </div>
                    <div v-if="tab == 0">
                        <iframe class="video" :src="embed(level.verification)" frameborder="0" allowfullscreen></iframe>
                        <ul class="stats">
                            <li>
                                <div class="type-label-md">ID</div>
                                <p>{{ level.id }}</p>
                            </li>
                            <li>
                                <div class="type-label-md">Points</div>
                                <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                            </li>
                        </div>
                    </div>
                    <div v-if="tab == 1">
                        <div class="record-list">
                            <div class="record" v-for="record in records">
                                <div class="user">
                                    <p class="type-label-lg">{{ record.user }}</p>
                                    <a :href="record.link" target="_blank">
                                        <img src="assets/video.svg" alt="Video">
                                    </a>
                                </div>
                                <div class="stats">
                                    <p>{{ record.percent }}%</p>
                                    <p>{{ record.hz }}Hz</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        records: [],
        loading: true,
        selected: 0,
        tab: 0,
        store
    }),
    async mounted() {
        // Fix: fetchList and fetchRecords now look for relative paths correctly
        this.list = await fetchList();
        if (this.list.length > 0) {
            this.records = await fetchRecords(this.list[this.selected][0].name);
        }
        this.loading = false;
    },
    watch: {
        async selected(obj) {
            this.tab = 0;
            this.records = await fetchRecords(this.list[obj][0].name);
        },
    },
};
