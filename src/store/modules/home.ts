import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { HOME_LOCAL_PACKS, HOME_SOURCE_PACKS } from '../types';
import { RootStore } from '../';
import { EVENT_LIST_LOCAL_PACKS } from '@/api/const';
import { IpcRendererEvent } from 'electron';

export interface HomeStore {
  localPacks: string[];
  sourcePacks: string[];
  fileTypes: string[];
  filterPageSizes: number[];
  supportLanguages: { [key: string]: string };
}

const state: HomeStore = {
  localPacks: [],
  sourcePacks: [],
  // TODO: From backend
  fileTypes: ['full', 'part'],
  filterPageSizes: [50, 100, 200, 500],
  // TODO: Hard code languages list for now
  // https://translation.googleapis.com/language/translate/v2/languages
  supportLanguages: {
    af: 'Afrikaans',
    sq: 'Albanian',
    am: 'Amharic',
    ar: 'Arabic',
    hy: 'Armenian',
    az: 'Azerbaijani',
    eu: 'Basque',
    be: 'Belarusian',
    bn: 'Bengali',
    bs: 'Bosnian',
    bg: 'Bulgarian',
    ca: 'Catalan',
    ceb: 'Cebuano',
    ny: 'Chichewa',
    'zh-CN': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    co: 'Corsican',
    hr: 'Croatian',
    cs: 'Czech',
    da: 'Danish',
    nl: 'Dutch',
    en: 'English',
    eo: 'Esperanto',
    et: 'Estonian',
    tl: 'Filipino',
    fi: 'Finnish',
    fr: 'French',
    fy: 'Frisian',
    gl: 'Galician',
    ka: 'Georgian',
    de: 'German',
    el: 'Greek',
    gu: 'Gujarati',
    ht: 'Haitian Creole',
    ha: 'Hausa',
    haw: 'Hawaiian',
    iw: 'Hebrew',
    hi: 'Hindi',
    hmn: 'Hmong',
    hu: 'Hungarian',
    is: 'Icelandic',
    ig: 'Igbo',
    id: 'Indonesian',
    ga: 'Irish',
    it: 'Italian',
    ja: 'Japanese',
    jw: 'Javanese',
    kn: 'Kannada',
    kk: 'Kazakh',
    km: 'Khmer',
    rw: 'Kinyarwanda',
    ko: 'Korean',
    ku: 'Kurdish (Kurmanji)',
    ky: 'Kyrgyz',
    lo: 'Lao',
    la: 'Latin',
    lv: 'Latvian',
    lt: 'Lithuanian',
    lb: 'Luxembourgish',
    mk: 'Macedonian',
    mg: 'Malagasy',
    ms: 'Malay',
    ml: 'Malayalam',
    mt: 'Maltese',
    mi: 'Maori',
    mr: 'Marathi',
    mn: 'Mongolian',
    my: 'Myanmar (Burmese)',
    ne: 'Nepali',
    no: 'Norwegian',
    or: 'Odia (Oriya)',
    ps: 'Pashto',
    fa: 'Persian',
    pl: 'Polish',
    pt: 'Portuguese',
    pa: 'Punjabi',
    ro: 'Romanian',
    ru: 'Russian',
    sm: 'Samoan',
    gd: 'Scots Gaelic',
    sr: 'Serbian',
    st: 'Sesotho',
    sn: 'Shona',
    sd: 'Sindhi',
    si: 'Sinhala',
    sk: 'Slovak',
    sl: 'Slovenian',
    so: 'Somali',
    es: 'Spanish',
    su: 'Sundanese',
    sw: 'Swahili',
    sv: 'Swedish',
    tg: 'Tajik',
    ta: 'Tamil',
    tt: 'Tatar',
    te: 'Telugu',
    th: 'Thai',
    tr: 'Turkish',
    tk: 'Turkmen',
    uk: 'Ukrainian',
    ur: 'Urdu',
    ug: 'Uyghur',
    uz: 'Uzbek',
    vi: 'Vietnamese',
    cy: 'Welsh',
    xh: 'Xhosa',
    yi: 'Yiddish',
    yo: 'Yoruba',
    zu: 'Zulu',
    he: 'Hebrew',
    zh: 'Chinese (Simplified)',
  },
};

const mutations: MutationTree<HomeStore> = {
  [HOME_SOURCE_PACKS]: (state, packs: string[]) => {
    state.sourcePacks = packs;
  },
  [HOME_LOCAL_PACKS]: (state, packs: string[]) => {
    state.localPacks = packs;
  },
};

const actions: ActionTree<HomeStore, RootStore> = {
  fetchLocalPacks: ({ commit }) => {
    const { ipcRenderer } = window._api;
    ipcRenderer.once(
      EVENT_LIST_LOCAL_PACKS,
      (_: IpcRendererEvent, packs: string[]) => {
        commit(HOME_LOCAL_PACKS, packs);
      },
    );
    ipcRenderer.invoke(EVENT_LIST_LOCAL_PACKS);
  },
};

const getters: GetterTree<HomeStore, RootStore> = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
