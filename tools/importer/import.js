/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import accordion2Parser from './parsers/accordion2.js';
import columns9Parser from './parsers/columns9.js';
import hero11Parser from './parsers/hero11.js';
import hero4Parser from './parsers/hero4.js';
import cards15Parser from './parsers/cards15.js';
import cards12Parser from './parsers/cards12.js';
import hero17Parser from './parsers/hero17.js';
import tabs6Parser from './parsers/tabs6.js';
import accordion1Parser from './parsers/accordion1.js';
import accordion21Parser from './parsers/accordion21.js';
import columns23Parser from './parsers/columns23.js';
import search19Parser from './parsers/search19.js';
import cards25Parser from './parsers/cards25.js';
import columns3Parser from './parsers/columns3.js';
import hero5Parser from './parsers/hero5.js';
import hero28Parser from './parsers/hero28.js';
import accordion7Parser from './parsers/accordion7.js';
import cards26Parser from './parsers/cards26.js';
import hero29Parser from './parsers/hero29.js';
import columns20Parser from './parsers/columns20.js';
import columns32Parser from './parsers/columns32.js';
import tableBordered10Parser from './parsers/tableBordered10.js';
import columns30Parser from './parsers/columns30.js';
import columns36Parser from './parsers/columns36.js';
import cards35Parser from './parsers/cards35.js';
import cards34Parser from './parsers/cards34.js';
import cards39Parser from './parsers/cards39.js';
import columns37Parser from './parsers/columns37.js';
import columns33Parser from './parsers/columns33.js';
import accordion40Parser from './parsers/accordion40.js';
import hero44Parser from './parsers/hero44.js';
import columns43Parser from './parsers/columns43.js';
import cards48Parser from './parsers/cards48.js';
import columns47Parser from './parsers/columns47.js';
import cards42Parser from './parsers/cards42.js';
import accordion49Parser from './parsers/accordion49.js';
import tabs50Parser from './parsers/tabs50.js';
import tableNoHeader8Parser from './parsers/tableNoHeader8.js';
import hero54Parser from './parsers/hero54.js';
import table24Parser from './parsers/table24.js';
import hero60Parser from './parsers/hero60.js';
import columns57Parser from './parsers/columns57.js';
import columns59Parser from './parsers/columns59.js';
import accordion61Parser from './parsers/accordion61.js';
import columns62Parser from './parsers/columns62.js';
import accordion65Parser from './parsers/accordion65.js';
import accordion66Parser from './parsers/accordion66.js';
import accordion63Parser from './parsers/accordion63.js';
import tableNoHeader41Parser from './parsers/tableNoHeader41.js';
import cards68Parser from './parsers/cards68.js';
import hero70Parser from './parsers/hero70.js';
import cards69Parser from './parsers/cards69.js';
import columns72Parser from './parsers/columns72.js';
import tabs31Parser from './parsers/tabs31.js';
import cards74Parser from './parsers/cards74.js';
import tableStripedBordered64Parser from './parsers/tableStripedBordered64.js';
import table73Parser from './parsers/table73.js';
import hero71Parser from './parsers/hero71.js';
import columns75Parser from './parsers/columns75.js';
import hero27Parser from './parsers/hero27.js';
import columns45Parser from './parsers/columns45.js';
import columns76Parser from './parsers/columns76.js';
import search18Parser from './parsers/search18.js';
import tabs78Parser from './parsers/tabs78.js';
import columns52Parser from './parsers/columns52.js';
import columns51Parser from './parsers/columns51.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  accordion2: accordion2Parser,
  columns9: columns9Parser,
  hero11: hero11Parser,
  hero4: hero4Parser,
  cards15: cards15Parser,
  cards12: cards12Parser,
  hero17: hero17Parser,
  tabs6: tabs6Parser,
  accordion1: accordion1Parser,
  accordion21: accordion21Parser,
  columns23: columns23Parser,
  search19: search19Parser,
  cards25: cards25Parser,
  columns3: columns3Parser,
  hero5: hero5Parser,
  hero28: hero28Parser,
  accordion7: accordion7Parser,
  cards26: cards26Parser,
  hero29: hero29Parser,
  columns20: columns20Parser,
  columns32: columns32Parser,
  tableBordered10: tableBordered10Parser,
  columns30: columns30Parser,
  columns36: columns36Parser,
  cards35: cards35Parser,
  cards34: cards34Parser,
  cards39: cards39Parser,
  columns37: columns37Parser,
  columns33: columns33Parser,
  accordion40: accordion40Parser,
  hero44: hero44Parser,
  columns43: columns43Parser,
  cards48: cards48Parser,
  columns47: columns47Parser,
  cards42: cards42Parser,
  accordion49: accordion49Parser,
  tabs50: tabs50Parser,
  tableNoHeader8: tableNoHeader8Parser,
  hero54: hero54Parser,
  table24: table24Parser,
  hero60: hero60Parser,
  columns57: columns57Parser,
  columns59: columns59Parser,
  accordion61: accordion61Parser,
  columns62: columns62Parser,
  accordion65: accordion65Parser,
  accordion66: accordion66Parser,
  accordion63: accordion63Parser,
  tableNoHeader41: tableNoHeader41Parser,
  cards68: cards68Parser,
  hero70: hero70Parser,
  cards69: cards69Parser,
  columns72: columns72Parser,
  tabs31: tabs31Parser,
  cards74: cards74Parser,
  tableStripedBordered64: tableStripedBordered64Parser,
  table73: table73Parser,
  hero71: hero71Parser,
  columns75: columns75Parser,
  hero27: hero27Parser,
  columns45: columns45Parser,
  columns76: columns76Parser,
  search18: search18Parser,
  tabs78: tabs78Parser,
  columns52: columns52Parser,
  columns51: columns51Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
