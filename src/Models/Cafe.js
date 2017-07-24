import {  ContentItem } from 'kentico-cloud-delivery-typescript-sdk';

export class Cafe extends ContentItem {

    constructor(){
        super({
            propertyResolver: ((fieldName) => {
                
                if (fieldName === 'zip_code'){
                    return 'zipCode';
                }

            })
        })    
    }    
}