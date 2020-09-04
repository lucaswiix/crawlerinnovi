import cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs';

const urls =  [
    'https://www.innovimob.com.br/comprar/sp/santo-andre/jardim-santo-andre/casa/34967976'
]

const fetchData = async (url) => {
    const result = await axios.get(url);
    return result.data;
}

export const crawlerByUrl = async (url) => {
    const content = await fetchData(url);
    const $ = cheerio.load(content);

    const title = $('#ctrl_sticky > div > div.esq > div.dados_imovel > h1').text().trim();
    const localitation = $('#ctrl_sticky > div > div.esq > div.dados_imovel > h2 > span').text().trim();
    const price = $('#ctrl_sticky > div > div.esq > div.dados_imovel > div.infos_imovel > div.alinha_valores > div > h4').text().trim();
    const transactionType = $('#ctrl_sticky > div > div.esq > div.dados_imovel > div.infos_imovel > div.alinha_valores > div > h3').text().trim();
    const externalCode = $('#ctrl_sticky > div > div.esq > div.dados_imovel > div.referencia > span').text().trim();
    const features = $('.detalhe').toArray().map((element) => {
        const qty = $(element).find('span').first().text().trim();
        const name = $(element).find('span').last().text().trim();

        return qty === name ? name : `${qty.replace(/\D/g, '')} ${name}`;

    });

    
    const photos = $('.fotorama').children().toArray().map(el => {
        return $(el).attr('src');
    });
    return { 
        url,
        title,
        localitation,
        photos,
        externalCode,
        features,
        price,
        transactionType

    }
}

export async function main() {
    const asyncMap = urls.map(async (url) => {            
           return crawlerByUrl(url);
    });

    const response = await Promise.all(asyncMap);
    try {
        
    //    await Promise.all(response.map(async property => {
    //         await fs.writeFileSync(`${property.externalCode}.json`, JSON.stringify(response, null, 4));
    //     }));
        return response;

    } catch (error) {
        console.log('erro ou salvar', error);
    }
}
main();
