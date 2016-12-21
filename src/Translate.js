import isPlainObject from 'lodash/isPlainObject';
import EventEmitter from 'events';
import Tree from './Tree';
import baseFilters from './filters';
import MemoryAdapter from './adapters/Memory';
import MemoryCache from './caches/Memory';
import Mode from './constants/Mode';

function baseDefaultValue(path) {
  return `Missing default translation for: ${path}`;
}

// TODO add || syntax
export default class Translate extends EventEmitter {
  constructor(options = {}) {
    super();

    if (isPlainObject(options.adapter)) {
      throw new Error('You need to use instance of adapter or data option');
    }

    const { locale, namespace, data, ...rest } = options;

    if (locale || namespace) {
      throw new Error('Use method setLocale instead of option locale and namespace');
    }

    this.options = {
      locales: undefined, // available locales
      cache: new MemoryCache({}),
      adapter: new MemoryAdapter({}),
      dotNotation: true,
      mode: Mode.MAIN,
      references: true,
      variables: true,
      combinations: true,
      defaultValue: baseDefaultValue,
      ...rest,
      filters: {
        ...baseFilters, // available filters
        ...rest.filters, // add user filters
      },
    };

    this.tree = new Tree(this);

    const { adapter } = this.getOptions();
    if (data) {
      adapter.rehydrate(data);
    }
  }

  clear() {
    const { cache } = this.getOptions();
    if (cache) {
      cache.clear();
    }

    this.tree = new Tree(this);
  }

  async setLocale(locale, namespace) {
    if (!locale) {
      throw new Error('Locale is undefined');
    }

    const options = this.getOptions();
    if (options.locales && options.locales.indexOf(locale) === -1) {
      throw new Error('Locale is not allowed. Setup locales');
    }

    const adapter = this.getAdapter();
    const data = await adapter.get(locale, namespace);
    if (options.locale !== locale) {
      this.clear();

      this.options = {
        ...options,
        locale,
      };
    }

    if (namespace) {
      this.set(namespace, data);
    } else {
      this.set(data);
    }

    this.emit('locale', locale, namespace);

    return data;
  }

  async loadNamespace(namespace) {
    const options = this.getOptions();

    return await this.setLocale(options.locale, namespace);
  }

  get(path, attrs, defaultValue) {
    if (path === undefined || path === null) {
      return undefined;
    }

    if (isPlainObject(path)) {
      const translated = {};
      Object.keys(path).forEach((key) => {
        translated[key] = this.get(path[key], attrs, defaultValue);
      });

      return translated;
    }

    return this.tree.get(path, attrs, defaultValue);
  }

  set(path, value) {
    const result = this.tree.set(path, value);

    this.emit('changed');

    return result;
  }

  getOptions() {
    return this.options;
  }

  getLocale() {
    return this.getOptions().locale;
  }

  getCache() {
    return this.getOptions().cache;
  }

  getAdapter() {
    return this.getOptions().adapter;
  }

  setFilter(type, fn) {
    if (isPlainObject(type)) {
      Object.keys(type).forEach(filterType =>
        this.setFilter(filterType, type[filterType]));
      return;
    }

    this.getOptions().filters[type] = fn;
  }

  getFilter(type) {
    const { filters } = this.getOptions();

    return filters && filters[type];
  }
}
