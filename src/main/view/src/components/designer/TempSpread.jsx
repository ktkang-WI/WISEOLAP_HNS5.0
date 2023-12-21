import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@grapecity/spread-sheets-resources-ko';
import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-designer-resources-ko';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import
'@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css';
import * as ExcelIO from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-designer';
GC.Spread.Common.CultureManager.culture('ko-kr');
// license keys
const sjsLicense = 'intelligence.wise.co.kr,5962557' +
'29596446#B0DTH7Z7MJ9GdpVTNwhFcolnU8V4M8ZXVCxUVZFTdB' +
'RVVpljSnlFT6VWa8tUQWFGVxljTtl6Vw5UWiJle9I6T5h5M8w6N8' +
'YmSV56Mth5U6lWNThjcURHNmp7NstCZ4ond5cUT7smNTpWWzIlTxJ' +
'nYiljcmNlYxZ6bWVFajBzVsVFavNnd6FFUl3GVwxUSPJXNFNGU0h5' +
'LQtCRPd4dBVUWPBjR9NHd8BnMwtCUv2meuFkcHZEMmF5QGVTVXlzND' +
'dWS6IlazJ7THhTbttUW9ADWx34cvZWTjJDNkV4UnNmZ4QmewgVMtln' +
'ZyBFTr54RCdWZHZjcxdTaaBncO3mWiojITJCLiEUOGBTQChjMiojII' +
'JCL5ITO9MjM4AjN0IicfJye&Qf35VfiwUQRNlI0IyQiwiI5EjL6ByUK' +
'BCZhVmcwNlI0IiTis7W0ICZyBlIsIiM5IjM5ADI5IDMxIjMwIjI0ICd' +
'yNkIsIicr9ybj9SZzl6duU6YuV6ZpxGblRnbpJiOiMXbEJCLi4YhtT' +
'bnsTYlsjLhsTInsLiOiEmTDJCLiYDN4YTO5kjM7UTNyYTO5IiOiQWSi' +
'wSfdJSZsJWYUR7b6lGUislOicGbmJCLlNHbhZmOiI7ckJye0ICbuFkI1' +
'pjIEJCLi4TP7NFZh3UZ4YHO9NGe9EUewNnQKVTQVNUMv3ybFtEZ7wEW9Q' +
'6bH3EVEl5TLRjNuNVT9FGWNVEULJEaxdmT4RTMPZXdmV7TPZFW6FmandUV' +
'OllSQV5djxUNxqVCV';
GC.Spread.Sheets.LicenseKey = sjsLicense;
ExcelIO.LicenseKey = sjsLicense;
GC.Spread.Sheets.Designer.LicenseKey = 'intelligence.wise.co.kr,' +
'431752997214611#B0u6VWVlWMPV5UxF5ZZRmRT3yYJhGcwxWNVZGNENVW4VXYW' +
'J7TxdETMJzShRFbLp6KQ5ET944RFJUcqhUaRZ6SvlVbB3WbrRkbPdHVhhXeplTM' +
'KZXTMdFRmJ4bVp5LX3UMktUT98GRX36Q6MWW4Ana9cWYrAja9wUYZV4cuB7L7QX' +
'OmpUaPJ4bzB5V92CUwYGZVJFarNnNllUZ6MnSvkUWGV5bjh4QEFGZ4QVS9AHd9o' +
'VYrFTe6YVRvU4KwR4KjFlQJ9kSZV5LxpWaQhVNwtSQU36Szg6aTl7L7l6LVJGaB' +
'B5dFVnV5hHe63EcQR7ThlmZ6J7ZFJXMxADcDZlZUpWMFB7SiojITJCLiMDNCVjQB' +
'lzMiojIIJCL6ITO9QDOzETN0IicfJye35XX3JSS42UUiojIDJCLiUTMuYHIu3GZkF' +
'ULyVmbnl6clRULTpEZhVmcwNlI0IiTis7W0ICZyBlIsISM4YjM8ADI6ETMxIjMwI' +
'jI0ICdyNkIsIicr9ybj9SZzl6duU6YuV6ZpxGblRnbpJiOiMXbEJCLi4YhtTbnsT' +
'YlsjLhsTInsLiOiEmTDJCLiETM6QTMycTO9ITN7EzM4IiOiQWSiwSfdJSZsJWYU' +
'R7b6lGUislOicGbmJCLlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TP73GUydVd9l4' +
'ZwkXczA5QwU6VyBlS6JzLlNmMyRHOyQEOilVMYRUOnJnZh3yZS5mSKB7UlNXNilTTX' +
'lWORRkYOZWTNpEUQ34YolDNFVlero4c1RiV';

const config = GC.Spread.Sheets.Designer.DefaultConfig;
const sheets = GC.Spread.Sheets;
const initRibbon = (spreadRef) => {
  console.log(config.commandMap);
  console.log(sheets);
  // add new tab
  const newTab = {
    id: 'operate',
    text: 'Favorite',
    buttonGroups: []
  };
  // delete config.fileMenu;
  config.ribbon.unshift(newTab);
  return config;
};

const TempSpread = () => {
  const spreadRef = {spread: undefined};
  const config = initRibbon(spreadRef);

  const designerInitialized = (e) => {
    setTimeout(function() {
    }, 3000);
    spreadRef.spread = e.getWorkbook();
  };

  return (
    <Designer
      styleInfo={{width: '100%', height: '100%'}}
      config={config}
      designerInitialized={designerInitialized}
    ></Designer>
  );
};

export default TempSpread;
