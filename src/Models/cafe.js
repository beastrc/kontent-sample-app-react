import { ContentItem } from 'kentico-cloud-delivery';
import { resolveContentLink } from '../Utilities/ContentLinks';

export class Cafe extends ContentItem {
  constructor() {
    super({
      propertyResolver: fieldName => {
        if (fieldName === 'zip_code') {
          return 'zipCode';
        }
        return fieldName;
      },
      linkResolver: link => resolveContentLink(link)
    });
  }
}
